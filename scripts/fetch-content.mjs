// Mengambil data project dan experience dari Supabase lalu menulisnya ke src/data/*.json
// dalam bentuk yang sama seperti file lama, jadi halaman yang ada tidak perlu diubah.
// Berjalan otomatis sebelum `npm run build` (lewat skrip "prebuild"), atau manual: `npm run content`.
//
// Jika variabel belum diisi atau database tidak bisa dijangkau, file JSON yang sudah ada
// dipertahankan dan build tetap lanjut. Setel CONTENT_STRICT=1 jika build harus gagal pada kasus itu.
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
const OUT = { projects: 'src/data/projectsData.json', experiences: 'src/data/experienceData.json' }

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
    // ----- field lama, bentuk sama seperti projectsData.json sebelumnya -----
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
    // ----- tambahan untuk halaman detail versi baru -----
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

async function main() {
  if (!BASE_URL || !KEY) {
    const msg = 'SUPABASE_URL atau SUPABASE_ANON_KEY belum diisi'
    if (STRICT) throw new Error(msg)
    log(`${msg}, memakai data yang sudah ada.`)
    return
  }
  try {
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
    if (!valid.length) throw new Error('tidak ada project terbit, snapshot lama dipertahankan')
    if (!experienceRows.length) throw new Error('tabel experiences kosong, snapshot lama dipertahankan')

    await writeFile(OUT.projects, JSON.stringify({ projects: valid.map(toProject) }, null, 2) + '\n')
    await writeFile(OUT.experiences, JSON.stringify({ experiences: experienceRows.map(toExperience) }, null, 2) + '\n')
    log(`${valid.length} project dan ${experienceRows.length} pengalaman disimpan.`)
  } catch (err) {
    if (STRICT) throw err
    console.warn('[content] gagal mengambil data, memakai snapshot lama:', err.message)
  }
}

await main()
