import { getStore } from '@netlify/blobs'
import { createHash } from 'node:crypto'

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
  const id = createHash('sha256').update(`${salt}|${ip}`).digest('hex').slice(0, 32)
  const ua = req.headers.get('user-agent') || ''

  try {
    const store = getStore('site-stats')
    const [visitor, liker, counts] = await Promise.all([
      store.get(`v:${id}`, { type: 'json' }),
      store.get(`l:${id}`, { type: 'json' }),
      store.get('counts', { type: 'json' }),
    ])

    const c = { visitors: counts?.visitors || 0, likes: counts?.likes || 0 }
    let isVisitor = !!visitor
    let isLiked = !!liker
    let changed = false
    const now = Date.now()

    if (action === 'visit' && !isVisitor && !BOT_RE.test(ua)) {
      await store.setJSON(`v:${id}`, { t: now })
      c.visitors += 1
      isVisitor = true
      changed = true
    }

    if (action === 'like') {
      // like hanya sah dari IP yang sudah tercatat sebagai pengunjung
      if (!isVisitor) {
        return json(403, { error: 'not_visitor', message: 'Visit the site first, then you can like it.' })
      }
      if (!isLiked) {
        await store.setJSON(`l:${id}`, { t: now })
        c.likes += 1
        isLiked = true
        changed = true
      }
    }

    if (changed) await store.setJSON('counts', c)
    return json(200, { visitors: c.visitors, likes: c.likes, liked: isLiked })
  } catch (err) {
    console.error('stats: error tak terduga', err)
    return json(500, { error: 'server_error' })
  }
}
