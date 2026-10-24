// Mengambil konten dari Supabase lalu menulisnya ke src/data/*.json dalam bentuk yang mudah dipakai halaman:
//   projectsData.json    : daftar project (bentuk sama seperti file lama, plus field baru)
//   experienceData.json  : daftar pengalaman
//   siteData.json        : speciality (Home) dan tech stack (Home dan About)
// Berjalan otomatis sebelum `npm run build` (skrip "prebuild"), atau manual: `npm run content`.
//
// Tiap kelompok data disinkronkan sendiri-sendiri. Jika satu kelompok gagal (tabel belum dibuat,
// database tidak terjangkau, hasil kosong), file lamanya dipertahankan dan build tetap lanjut.
// Setel CONTENT_STRICT=1 jika build harus gagal pada kasus itu.
import { writeFile } from 'node:fs/promises'

for (const p of ['.env', '../.env']) {
  try {
    process.loadEnvFile?.(p)
    break
  } catch {}
}

const BASE_URL = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '')
const KEY = process.env.SUPABASE_ANON_KEY?.trim() // kunci anon (eyJ...) atau publishable (sb_publishable_...)
const STRICT = process.env.CONTENT_STRICT === '1'
const OUT = {
  projects: 'src/data/projectsData.json',
  experiences: 'src/data/experienceData.json',
  site: 'src/data/siteData.json',
}

const log = (...a) => console.log('[content]', ...a)

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

const writeJson = (file, data) => writeFile(file, JSON.stringify(data, null, 2) + '\n')

const utc = (d) => new Date(`${d}T00:00:00Z`)
const month = (d, style) => utc(d).toLocaleString('en-US', { month: style, timeZone: 'UTC' })

// durasi dihitung termasuk bulan awal dan bulan akhir
function duration(start, end) {
  const s = utc(start)
  const e = end ? utc(end) : new Date()
  let m = (e.getUTCFullYear() - s.getUTCFullYear()) * 12 + (e.getUTCMonth() - s.getUTCMonth()) + 1
  const y = Math.floor(m / 12)
  m %= 12
  const parts = []
  if (y) parts.push(`${y} Year${y > 1 ? 's' : ''}`)
  if (m) parts.push(`${m} Month${m > 1 ? 's' : ''}`)
  return parts.join(' ') || '1 Month'
}

// PostgREST mengembalikan relasi 1:1 sebagai objek (atau null); array juga ditangani
const one = (v) => (Array.isArray(v) ? v[0] : v) || null

function toProject(row) {
  const dev = one(row.project_dev_details)
  const design = one(row.project_design_details)
  if (!dev && !design) console.warn(`[content] project "${row.slug}" belum punya baris detail`)
  return {
    // ----- field lama -----
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type[0].toUpperCase() + row.type.slice(1),
    month: month(row.published_on, 'long'),
    year: row.published_on.slice(0, 4),
    shortDescription: row.summary,
    fullDescription: row.overview,
    image: row.cover_url,
    tech: dev?.tech ?? design?.software ?? [],
    liveLink: dev?.live_url || '',
    githubLink: dev?.github_url || '',
    features: dev?.features ?? design?.deliverables ?? [],
    screenshots: dev?.screenshots ?? design?.gallery ?? [],
    featured: !!row.featured,
    // ----- tambahan -----
    date: row.published_on, // "YYYY-MM-DD", dipakai Home untuk mengurutkan project terbaru
    family: dev ? 'dev' : design ? 'design' : null,
    brief: design?.brief || '',
    modelUrl: design?.model_url || '',
    processImages: design?.process_images ?? [],
  }
}

function toExperience(row) {
  const range = `${month(row.started_on, 'short')} ${row.started_on.slice(0, 4)} - ${
    row.ended_on ? `${month(row.ended_on, 'short')} ${row.ended_on.slice(0, 4)}` : 'Present'
  }`
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    year: range,
    duration: duration(row.started_on, row.ended_on),
    description: row.description,
    technologies: row.technologies || [],
  }
}

async function syncPortfolio() {
  const [projectRows, experienceRows] = await Promise.all([
    query(
      'projects',
      'select=*,project_dev_details(*),project_design_details(*)&status=eq.published&order=published_on.asc,id.asc'
    ),
    query('experiences', 'select=*&order=started_on.asc,id.asc'),
  ])

  const valid = projectRows.filter((r) => {
    const ok = r.slug && r.title && r.type && r.overview && r.cover_url && r.published_on
    if (!ok) console.warn('[content] baris project dilewati (kolom wajib kosong):', r.id ?? r.slug)
    return ok
  })
  if (!valid.length) throw new Error('tidak ada project terbit')
  if (!experienceRows.length) throw new Error('tabel experiences kosong')

  await writeJson(OUT.projects, { projects: valid.map(toProject) })
  await writeJson(OUT.experiences, { experiences: experienceRows.map(toExperience) })
  log(`${valid.length} project dan ${experienceRows.length} pengalaman disimpan.`)
}

async function syncSite() {
  const [specRows, techRows, settingRows] = await Promise.all([
    query('specialities', 'select=*&order=sort_order.asc,slug.asc'), // RLS: hanya yang is_active
    query('tech_stack', 'select=*'),
    query('site_settings', 'select=key,value'),
  ])

  const specialities = specRows
    .filter((r) => r.slug && r.title && r.image_url)
    .map((r) => ({ id: r.slug, title: r.title, description: r.description, image: r.image_url }))
  if (!specialities.length) throw new Error('tidak ada speciality aktif')

  // posisi kecil tampil lebih dulu; posisi kosong = tidak tampil di halaman itu
  const pick = (key) =>
    techRows
      .filter((t) => t[key] != null)
      .sort((a, b) => a[key] - b[key] || a.name.localeCompare(b.name))
      .map((t) => t.name)
  const techStack = { home: pick('home_position'), about: pick('about_position') }
  if (!techStack.home.length || !techStack.about.length) throw new Error('daftar tech stack kosong')

  // kunci snake_case menjadi camelCase (cv_url -> cvUrl); nilai kosong dilewati
  const camel = (k) => k.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
  const settings = Object.fromEntries(
    settingRows.filter((r) => r.key && r.value?.trim()).map((r) => [camel(r.key), r.value.trim()])
  )

  await writeJson(OUT.site, { specialities, techStack, settings })
  log(
    `${specialities.length} speciality, tech stack Home ${techStack.home.length} dan About ${techStack.about.length}, ` +
      `${Object.keys(settings).length} pengaturan disimpan.`
  )
}

async function guarded(name, fn) {
  try {
    await fn()
  } catch (err) {
    if (STRICT) throw err
    console.warn(`[content] ${name} gagal, file lama dipertahankan: ${err.message}`)
  }
}

async function main() {
  if (!BASE_URL || !KEY) {
    const msg = 'SUPABASE_URL atau SUPABASE_ANON_KEY belum diisi'
    if (STRICT) throw new Error(msg)
    log(`${msg}, memakai data yang sudah ada.`)
    return
  }
  await guarded('portofolio (project dan pengalaman)', syncPortfolio)
  await guarded('konten situs (speciality dan tech stack)', syncSite)
}

await main()
