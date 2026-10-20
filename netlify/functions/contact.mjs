import { getStore } from '@netlify/blobs'
import { createHash } from 'node:crypto'

const SUBJECTS = [
  'General Inquiry',
  'Project Collaboration',
  'Job Opportunity',
  'Freelance Work',
  'Just Saying Hi',
]
const MIN_FILL_MS = 3000 // form yang terisi lebih cepat dari ini dianggap bot
const DAY = 24 * 60 * 60 * 1000

// batas kirim (semuanya dicek sebelum email dikirim)
const rules = ({ sub, ip }) => [
  { key: `acct:${sub}:10m`, windowMs: 10 * 60 * 1000, max: 1 }, // 1 pesan / 10 menit / akun Google
  { key: `acct:${sub}:day`, windowMs: DAY, max: 3 },            // 3 pesan / hari / akun Google
  { key: `ip:${sha(ip)}:hour`, windowMs: 60 * 60 * 1000, max: 5 }, // 5 pesan / jam / IP
  { key: `global:${new Date().toISOString().slice(0, 10)}`, windowMs: DAY, max: 50 }, // rem darurat harian
]

const sha = (s) => createHash('sha256').update(String(s)).digest('hex').slice(0, 32)
const oneLine = (s) => String(s ?? '').replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim()
const multiLine = (s) =>
  String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

// Verifikasi ID token Google: hanya akun Google asli dengan email terverifikasi yang lolos
async function verifyGoogleToken(credential) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  )
  if (!res.ok) return null
  const t = await res.json()
  const issOk = t.iss === 'accounts.google.com' || t.iss === 'https://accounts.google.com'
  const verified = t.email_verified === true || t.email_verified === 'true'
  if (t.aud !== process.env.GOOGLE_CLIENT_ID || !issOk || !verified || !t.email || !t.sub) return null
  if (Number(t.exp) * 1000 < Date.now()) return null
  return { email: String(t.email).toLowerCase(), sub: String(t.sub), name: t.name || '' }
}

async function checkLimits(store, list, now) {
  const recs = []
  for (const r of list) {
    const rec = (await store.get(r.key, { type: 'json' })) || { hits: [] }
    const hits = rec.hits.filter((t) => now - t < r.windowMs)
    if (hits.length >= r.max) {
      return { ok: false, retryAfter: Math.ceil((r.windowMs - (now - hits[0])) / 1000) }
    }
    recs.push({ key: r.key, hits })
  }
  return { ok: true, recs }
}
const reserve = (store, recs, now) =>
  Promise.all(recs.map((r) => store.setJSON(r.key, { hits: [...r.hits, now] })))
const release = (store, recs) => Promise.all(recs.map((r) => store.setJSON(r.key, { hits: r.hits })))

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  // hanya terima dari situs sendiri
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const origin = req.headers.get('origin')
  if (allowed.length && (!origin || !allowed.includes(origin))) return json(403, { error: 'forbidden' })

  const { GOOGLE_CLIENT_ID, RESEND_API_KEY, CONTACT_TO_EMAIL } = process.env
  if (!GOOGLE_CLIENT_ID || !RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('contact: environment variables belum lengkap')
    return json(500, { error: 'server_misconfigured', message: 'The contact form is not available right now.' })
  }

  const raw = await req.text()
  if (raw.length > 10_000) return json(413, { error: 'too_large', message: 'Message is too large.' })
  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return json(400, { error: 'bad_json', message: 'Invalid request.' })
  }

  // honeypot: bot mengisi kolom tersembunyi. Pura-pura berhasil agar bot tidak belajar.
  if (body.website) return json(200, { ok: true })

  if (typeof body.t !== 'number' || body.t < MIN_FILL_MS) {
    return json(400, { error: 'too_fast', message: 'Please take a moment to write your message, then send again.' })
  }

  const name = oneLine(body.fullName)
  const subject = String(body.subject ?? '')
  const message = multiLine(body.message)
  if (name.length < 2 || name.length > 80) {
    return json(400, { error: 'invalid_name', message: 'Please enter your name (2 to 80 characters).' })
  }
  if (!SUBJECTS.includes(subject)) return json(400, { error: 'invalid_subject', message: 'Invalid subject.' })
  if (message.length < 10 || message.length > 2000) {
    return json(400, { error: 'invalid_message', message: 'Message must be 10 to 2000 characters.' })
  }
  if (typeof body.credential !== 'string' || body.credential.length > 4000) {
    return json(401, { error: 'unverified', message: 'Please verify your email with Google first.' })
  }

  const user = await verifyGoogleToken(body.credential)
  if (!user) {
    return json(401, { error: 'unverified', message: 'Google verification failed or expired. Please sign in again.' })
  }

  const store = getStore('contact-guard')
  const now = Date.now()
  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown'
  let recs = []

  try {
    const limit = await checkLimits(store, rules({ sub: user.sub, ip }), now)
    if (!limit.ok) {
      const mins = Math.max(1, Math.ceil(limit.retryAfter / 60))
      return json(429, {
        error: 'rate_limited',
        retryAfter: limit.retryAfter,
        message: `Too many messages. Please try again in about ${mins} minute${mins > 1 ? 's' : ''}.`,
      })
    }
    recs = limit.recs

    const dupKey = `dup:${sha(`${user.sub}|${message.toLowerCase().replace(/\s+/g, ' ')}`)}`
    const prev = await store.get(dupKey, { type: 'json' })
    if (prev && now - prev.t < DAY) {
      return json(409, { error: 'duplicate', message: 'You already sent this exact message.' })
    }

    await reserve(store, recs, now)

    // email teks biasa saja (tanpa HTML) agar aman dari injeksi
    const text = [
      `Name: ${name}`,
      `Email (verified by Google): ${user.email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Portfolio Contact <${process.env.CONTACT_FROM || 'onboarding@resend.dev'}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: user.email,
        subject: `[Portfolio] ${subject}: ${name}`,
        text,
      }),
    })

    if (!res.ok) {
      console.error('contact: pengiriman gagal', res.status, await res.text())
      await release(store, recs) // pengiriman gagal tidak menghabiskan jatah pengguna
      return json(502, { error: 'send_failed', message: 'Could not send your message. Please try again later.' })
    }

    await store.setJSON(dupKey, { t: now })
    return json(200, { ok: true })
  } catch (err) {
    console.error('contact: error tak terduga', err)
    if (recs.length) await release(store, recs).catch(() => {})
    return json(500, { error: 'server_error', message: 'Something went wrong. Please try again later.' })
  }
}
