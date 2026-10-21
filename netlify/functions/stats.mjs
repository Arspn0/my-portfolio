import { getStore } from '@netlify/blobs'
import { createHash } from 'node:crypto'

// Pengembangan lokal: baca .env langsung bila Netlify CLI tidak menyuntikkannya ke fungsi.
for (const p of ['.env', '../../../.env']) {
  try {
    process.loadEnvFile?.(p)
    break
  } catch {}
}

// crawler dan alat otomatis tidak dihitung sebagai pengunjung
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python-requests/i

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

// IPv6: satu perangkat bisa berganti alamat di dalam blok /64 yang sama (privacy extensions),
// jadi hanya 4 grup pertama yang dipakai agar satu orang tidak terhitung berkali-kali.
function expandIPv6(ip) {
  const [head, tail = ''] = ip.split('::')
  const h = head ? head.split(':') : []
  const t = tail ? tail.split(':') : []
  const fill = ip.includes('::') ? Array(Math.max(0, 8 - h.length - t.length)).fill('0') : []
  return [...h, ...fill, ...t].map((g) => g.padStart(4, '0'))
}
function normalizeIp(raw) {
  const ip = raw.split('%')[0].trim().toLowerCase()
  if (ip.includes(':') && !ip.includes('.')) return expandIPv6(ip).slice(0, 4).join(':')
  return ip
}

// Jumlah dihitung dari penanda yang ada (satu penanda per pengunjung/like), bukan dari penghitung
// yang ditambah satu-satu. Penghitung read-modify-write rawan kehilangan data saat dua permintaan
// bersamaan, dan nilai 'counts' di bawah hanyalah cache yang dihitung ulang dari kebenaran.
async function countKeys(store, prefix) {
  const { blobs } = await store.list({ prefix })
  return blobs.length
}
async function recount(store) {
  const [visitors, likes] = await Promise.all([countKeys(store, 'v:'), countKeys(store, 'l:')])
  const counts = { visitors, likes }
  await store.setJSON('counts', counts)
  return counts
}

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  // hanya terima dari situs sendiri
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const origin = req.headers.get('origin')
  if (allowed.length && (!origin || !allowed.includes(origin))) return json(403, { error: 'forbidden' })

  const salt = process.env.STATS_SALT
  if (!salt) {
    console.error('stats: variabel belum terisi: STATS_SALT')
    return json(500, { error: 'server_misconfigured' })
  }

  const raw = await req.text()
  if (raw.length > 1000) return json(413, { error: 'too_large' })
  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return json(400, { error: 'bad_json' })
  }
  const action = body.action
  if (action !== 'visit' && action !== 'like') return json(400, { error: 'invalid_action' })

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip')
  if (!ip) return json(400, { error: 'ip_unavailable' })

  // IP tidak pernah disimpan mentah, hanya hash bergaram
  const id = createHash('sha256').update(`${salt}|${normalizeIp(ip)}`).digest('hex').slice(0, 32)
  const ua = req.headers.get('user-agent') || ''

  try {
    const store = getStore('site-stats')
    const [visitor, liker] = await Promise.all([
      store.get(`v:${id}`, { type: 'json' }),
      store.get(`l:${id}`, { type: 'json' }),
    ])

    let isVisitor = !!visitor
    let isLiked = !!liker
    let changed = false
    const now = Date.now()

    // onlyIfNew: penulisan atomik. Jika dua permintaan datang bersamaan, hanya satu yang menang
    // (modified = true), sehingga tidak ada pengunjung atau like ganda.
    if (action === 'visit' && !isVisitor && ua && !BOT_RE.test(ua)) {
      const r = await store.setJSON(`v:${id}`, { t: now }, { onlyIfNew: true })
      isVisitor = true
      changed = r.modified
    }

    if (action === 'like') {
      // like hanya sah dari IP yang sudah tercatat sebagai pengunjung
      if (!isVisitor) {
        return json(403, { error: 'not_visitor', message: 'Visit the site first, then you can like it.' })
      }
      if (!isLiked) {
        const r = await store.setJSON(`l:${id}`, { t: now }, { onlyIfNew: true })
        isLiked = true
        changed = r.modified
      }
    }

    // hitung ulang hanya saat ada perubahan, atau saat cache belum ada
    let counts = changed ? await recount(store) : await store.get('counts', { type: 'json' })
    if (!counts) counts = await recount(store)

    return json(200, { visitors: counts.visitors, likes: counts.likes, liked: isLiked })
  } catch (err) {
    console.error('stats: error tak terduga', err)
    return json(500, { error: 'server_error' })
  }
}
