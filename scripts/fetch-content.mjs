// Mengambil konten dari Supabase lalu menulisnya ke src/data/*.json.
// Berjalan otomatis sebelum `npm run build` (skrip "prebuild"), atau manual: `npm run content`.
//
// Aturan penamaan (satu set data = satu file SQL = satu file JSON):
//   supabase/Data-Speciality.sql  ->  src/data/specialityData.json
//   supabase/Data-Tools.sql       ->  src/data/toolsData.json
//   supabase/Data-Experience.sql  ->  src/data/experienceData.json
//   supabase/Data-primer.sql      ->  src/data/primerData.json
//   supabase/Data-Projects.sql    ->  src/data/projectsData.json
//
// Tiap set data disinkronkan sendiri-sendiri. Jika satu gagal (tabel belum dibuat, database tidak
// terjangkau, hasil kosong), file JSON lamanya dipertahankan dan set lain tetap jalan.
// Jika file lamanya juga belum ada, build dihentikan dengan pesan yang jelas.
// Setel CONTENT_STRICT=1 jika build harus gagal pada kegagalan apa pun.
import { writeFile, access } from 'node:fs/promises'

for (const p of ['.env', '../.env']) {
  try {
    process.loadEnvFile?.(p)
    break
  } catch {}
}

const BASE_URL = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '')
const KEY = process.env.SUPABASE_ANON_KEY?.trim() // kunci anon (eyJ...) atau publishable (sb_publishable_...)
const STRICT = process.env.CONTENT_STRICT === '1'

const log = (...a) => console.log('[content]', ...a)
const exists = (file) => access(file).then(() => true, () => false)
const writeJson = (file, data) => writeFile(file, JSON.stringify(data, null, 2) + '\n')

async function query(table, params) {
  const headers = { apikey: KEY }
  if (KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${KEY}`
  const res = await fetch(`${BASE_URL}/rest/v1/${table}?${params}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`)
  return res.json()
}

// ----- Data-Speciality.sql -> specialityData.json -----
async function loadSpeciality() {
  const [rows, textRows] = await Promise.all([
    query('specialities', 'select=*&order=sort_order.asc,slug.asc'), // RLS: hanya yang is_active
    query('speciality_texts', 'select=key,value'),
  ])
  const specialities = rows
    .filter((r) => r.slug && r.title && r.image_url)
    .map((r) => ({ id: r.slug, title: r.title, description: r.description ?? '', image: r.image_url }))
  if (!specialities.length) throw new Error('tidak ada speciality aktif')
  const texts = Object.fromEntries(textRows.map((r) => [r.key, r.value?.trim() ?? '']))
  const openToRoles = texts.open_to_roles ?? ''
  return {
    data: { specialities, openToRoles },
    summary: `${specialities.length} speciality, teks open to roles ${openToRoles ? 'terisi' : 'kosong'}`,
  }
}

// ----- Data-Projects.sql -> projectsData.json -----
// PostgREST mengembalikan relasi 1:1 sebagai objek (atau null); array juga ditangani
const one = (v) => (Array.isArray(v) ? v[0] : v) || null

const fileName = (url) => {
  const f = url.split('?')[0].split('/').pop() || ''
  try {
    return decodeURIComponent(f)
  } catch {
    return f
  }
}
const KIND_BY_EXT = { gif: 'gif', mp4: 'video', webm: 'video', mov: 'video', glb: 'model', gltf: 'model' }

// kolom kind boleh kosong: ditebak dari nama file ("360" atau "panorama" di nama = panorama)
function inferKind(url) {
  const f = fileName(url).toLowerCase()
  if (/360|panorama/.test(f)) return 'panorama'
  return KIND_BY_EXT[f.split('.').pop()] ?? 'image'
}

// kolom caption boleh kosong: "03-Final-Render.webp" menjadi "Final render"
function inferCaption(url) {
  const t = fileName(url).replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim()
  return t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : ''
}

function buildMedia(rows) {
  return (rows ?? [])
    .filter((r) => r.url?.trim())
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((r) => ({
      kind: r.kind || inferKind(r.url),
      url: r.url.trim(),
      label: r.caption?.trim() || inferCaption(r.url),
      cover: !!r.is_cover,
    }))
}

// thumbnail: file image atau gif yang is_cover-nya true (urutan paling awal jika lebih dari satu);
// jika tidak ada yang ditandai, foto pertama
function coverOf(media) {
  const canBeCover = (m) => m.kind === 'image' || m.kind === 'gif'
  return (media.find((m) => m.cover && canBeCover(m)) ?? media.find((m) => m.kind === 'image'))?.url
}

async function loadProjects() {
  const [rows, typeRows] = await Promise.all([
    query(
      'projects',
      'select=*,project_dev_details(*),project_design_details(*),project_media(*)&status=eq.published&order=published_on.desc,id.asc'
    ),
    query('project_types', 'select=*&order=sort_order.asc,slug.asc'),
  ])
  const labelOf = Object.fromEntries(typeRows.map((t) => [t.slug, t.label]))

  const projects = []
  for (const row of rows) {
    const label = labelOf[row.type]
    if (!row.slug || !row.title || !row.published_on || !label) {
      console.warn(`[content] project dilewati (kolom wajib kosong atau tipe tidak dikenal): ${row.slug ?? row.id}`)
      continue
    }
    const dev = one(row.project_dev_details)
    const design = one(row.project_design_details)
    if (!dev && !design) console.warn(`[content] project "${row.slug}" belum punya baris detail`)
    const media = buildMedia(row.project_media)
    const image = coverOf(media)
    if (!image) {
      console.warn(`[content] project "${row.slug}" dilewati: belum ada foto di project_media`)
      continue
    }
    projects.push({
      id: row.id,
      title: row.title,
      slug: row.slug,
      type: label, // label kategori, sama dengan teks tab filter
      typeId: row.type,
      family: row.family, // 'dev' atau 'design'
      month: monthName(row.published_on, 'long'),
      year: row.published_on.slice(0, 4),
      date: row.published_on, // "YYYY-MM-DD"
      shortDescription: row.summary ?? '',
      fullDescription: row.overview ?? '',
      challenges: row.challenges ?? '',
      image,
      tech: row.tools_used ?? [],
      liveLink: dev?.live_url || '',
      githubLink: dev?.github_url || '',
      features: dev?.features ?? design?.deliverables ?? [], // fitur (dev) atau hasil yang dikerjakan (design)
      brief: design?.brief || '',
      featured: !!row.featured,
      media: media.map(({ cover, ...m }) => m), // [{ kind, url, label }] sesuai urutan tampil
    })
  }
  if (!projects.length) throw new Error('tidak ada project terbit yang lengkap')

  // tab filter: kategori yang punya project terbit, urut sesuai sort_order di project_types
  const types = typeRows.filter((t) => projects.some((p) => p.typeId === t.slug)).map((t) => t.label)
  return {
    data: { types, projects },
    summary: `${projects.length} project, kategori: ${types.join(', ')}`,
  }
}

// ----- Data-primer.sql -> primerData.json -----
async function loadPrimer() {
  const rows = await query('primer', 'select=*&limit=1')
  if (!rows.length) throw new Error('tabel primer tidak punya baris')
  const r = rows[0]
  const clean = (v) => (typeof v === 'string' ? v.trim() : '')
  const cvUrl = clean(r.cv_url)

  // nama file saat diunduh diambil dari nama file di URL CV
  let cvFilename = ''
  if (cvUrl) {
    const last = cvUrl.split('?')[0].split('/').pop() || ''
    try {
      cvFilename = decodeURIComponent(last)
    } catch {
      cvFilename = last
    }
  }

  const data = {
    profileTitleUrl: clean(r.profile_title_url),
    profilePictureUrl: clean(r.profile_picture_url),
    cvUrl,
    cvFilename,
  }
  const empty = Object.entries(data).filter(([k, v]) => k !== 'cvFilename' && !v).map(([k]) => k)
  return {
    data,
    summary: empty.length ? `terisi kecuali ${empty.join(', ')}` : 'foto judul, foto profil, dan CV terisi',
  }
}

// ----- Data-Experience.sql -> experienceData.json -----
const utc = (d) => new Date(`${d}T00:00:00Z`)
const monthName = (d, style) => utc(d).toLocaleString('en-US', { month: style, timeZone: 'UTC' })

// durasi dibulatkan ke bulan terdekat (minimal 1); yang masih berjalan dihitung sampai hari ini
function duration(start, end) {
  const days = ((end ? utc(end) : new Date()) - utc(start)) / 86400000
  const total = Math.max(1, Math.round(days / 30.4375))
  const y = Math.floor(total / 12)
  const m = total % 12
  const parts = []
  if (y) parts.push(`${y} Year${y > 1 ? 's' : ''}`)
  if (m) parts.push(`${m} Month${m > 1 ? 's' : ''}`)
  return parts.join(' ')
}

async function loadExperience() {
  const rows = await query('experiences', 'select=*&order=started_on.asc,id.asc')
  const valid = rows.filter((r) => r.company && r.position && r.started_on)
  if (!valid.length) throw new Error('tabel experiences kosong')
  const experiences = valid.map((r) => ({
    id: r.id,
    company: r.company,
    position: r.position,
    year: `${monthName(r.started_on, 'short')} ${r.started_on.slice(0, 4)} - ${
      r.ended_on ? `${monthName(r.ended_on, 'short')} ${r.ended_on.slice(0, 4)}` : 'Present'
    }`,
    duration: duration(r.started_on, r.ended_on),
    description: r.description ?? '',
    technologies: r.technologies ?? [],
    startDate: r.started_on,
    endDate: r.ended_on ?? null,
  }))
  return { data: { experiences }, summary: `${experiences.length} pengalaman` }
}

// ----- Data-Tools.sql -> toolsData.json -----
async function loadTools() {
  const rows = await query('tools', 'select=*&order=sort_order.asc,name.asc')
  const valid = rows.filter((r) => r.name?.trim() && r.type)
  if (!valid.length) throw new Error('tabel tools kosong')
  const tools = valid.map((r) => ({ name: r.name.trim(), type: r.type }))
  const home = valid.filter((r) => r.show_on_home !== false).map((r) => r.name.trim())
  const about = valid.filter((r) => r.show_on_about !== false).map((r) => r.name.trim())
  return {
    data: { tools, home, about }, // tools: semua beserta tipe; home dan about: nama saja, sudah berurutan
    summary: `${tools.length} tools (Home ${home.length}, About ${about.length})`,
  }
}

async function loadSocial() {
  const rows = await query('social_links', 'select=*&order=sort_order.asc,platform.asc')
  // hanya tautan yang aman dipakai sebagai href (bukan javascript: dan sejenisnya)
  const socials = rows
    .filter((r) => r.platform?.trim() && /^(https?:|mailto:)/i.test(r.url?.trim() ?? ''))
    .map((r) => ({ label: r.platform.trim(), href: r.url.trim() }))
  if (!socials.length) throw new Error('tabel social_links kosong')
  return { data: { socials }, summary: `${socials.length} tautan sosial` }
}

const DATASETS = [
  { name: 'Speciality', out: 'src/data/specialityData.json', load: loadSpeciality },
  { name: 'Tools', out: 'src/data/toolsData.json', load: loadTools },
  { name: 'Experience', out: 'src/data/experienceData.json', load: loadExperience },
  { name: 'Primer', out: 'src/data/primerData.json', load: loadPrimer },
  { name: 'Projects', out: 'src/data/projectsData.json', load: loadProjects },
  { name: 'Social', out: 'src/data/socialData.json', load: loadSocial },
]

async function sync({ name, out, load }) {
  try {
    const { data, summary } = await load()
    await writeJson(out, data)
    log(`${name}: ${summary} disimpan ke ${out}.`)
  } catch (err) {
    if (STRICT) throw err
    if (!(await exists(out))) {
      throw new Error(`${name} gagal (${err.message}) dan ${out} belum ada, build tidak bisa dilanjutkan`)
    }
    console.warn(`[content] ${name} gagal, file lama dipertahankan: ${err.message}`)
  }
}

async function main() {
  if (!BASE_URL || !KEY) {
    const msg = 'SUPABASE_URL atau SUPABASE_ANON_KEY belum diisi'
    if (STRICT) throw new Error(msg)
    const missing = []
    for (const d of DATASETS) if (!(await exists(d.out))) missing.push(d.out)
    if (missing.length) throw new Error(`${msg}, dan file belum ada: ${missing.join(', ')}`)
    log(`${msg}, memakai data yang sudah ada.`)
    return
  }
  // semua set data dicoba; kegagalan fatal (file belum ada atau mode STRICT) dilaporkan di akhir
  const fatal = []
  for (const d of DATASETS) {
    try {
      await sync(d)
    } catch (err) {
      fatal.push(err.message)
    }
  }
  if (fatal.length) throw new Error(fatal.join('\n'))
}

await main()
