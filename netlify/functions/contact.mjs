import { getStore } from '@netlify/blobs'
import { createHash } from 'node:crypto'
import { resolveMx, resolve4 } from 'node:dns/promises'

for (const p of ['.env', '../../../.env']) {
  try {
    process.loadEnvFile?.(p)
    break
  } catch {}
}

const SUBJECTS = [
  'General Inquiry',
  'Project Collaboration',
  'Job Opportunity',
  'Freelance Work',
  'Just Saying Hi',
]
const SENDER_NAME = 'Client Message'
const SUBJECT_TAG = 'Portfolio Web Message'
const MIN_FILL_MS = 3000 // form yang terisi lebih cepat dari ini dianggap bot
const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

const EMAIL_RE = /^[^\s@<>(),;:"\[\]\\]+@[^\s@<>(),;:"\[\]\\]+\.[^\s@<>(),;:"\[\]\\]{2,}$/

// Daftar sebagian domain email sekali pakai. Tambahkan sendiri bila perlu.
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'yopmail.com', 'trashmail.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'mohmal.com',
  'emailondeck.com', 'tempail.com', 'burnermail.io', 'spam4.me', 'moakt.com', 'tmpmail.org',
])

const sha = (s) => createHash('sha256').update(String(s)).digest('hex').slice(0, 32)
const oneLine = (s) => String(s ?? '').replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim()
const multiLine = (s) =>
  String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

// kunci pembatasan: buang +tag dan titik Gmail agar tidak bisa dihindari dengan trik alamat
function normalizeEmail(email) {
  const [local, domain] = email.split('@')
  const isGmail = domain === 'gmail.com' || domain === 'googlemail.com'
  let l = local.split('+')[0]
  if (isGmail) l = l.replace(/\./g, '')
  return `${l}@${isGmail ? 'gmail.com' : domain}`
}

const withTimeout = (p, ms) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])

// domain email harus bisa menerima surat (MX, atau A sebagai cadangan)
async function canReceiveMail(domain) {
  try {
    const mx = await withTimeout(resolveMx(domain), 3000)
    if (mx.length) return true
  } catch {}
  try {
    const a = await withTimeout(resolve4(domain), 3000)
    return a.length > 0
  } catch {
    return false
  }
}

async function verifyTurnstile(token, ip) {
  const form = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token })
  if (ip && ip !== 'unknown') form.set('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) return false
  const data = await res.json()
  return data.success === true
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

  const missing = ['TURNSTILE_SECRET_KEY', 'RESEND_API_KEY', 'CONTACT_TO_EMAIL'].filter((k) => !process.env[k])
  if (missing.length) {
    console.error('contact: variabel belum terisi:', missing.join(', '))
    return json(500, { error: 'server_misconfigured', message: 'The contact form is not available right now.' })
  }
  const { RESEND_API_KEY, CONTACT_TO_EMAIL } = process.env

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
  const email = String(body.email ?? '').trim().toLowerCase()
  const subject = String(body.subject ?? '')
  const message = multiLine(body.message)

  if (name.length < 2 || name.length > 80) {
    return json(400, { error: 'invalid_name', message: 'Please enter your name (2 to 80 characters).' })
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json(400, { error: 'invalid_email', message: 'Please enter a valid email address.' })
  }
  const domain = email.split('@')[1]
  if (DISPOSABLE.has(domain)) {
    return json(400, { error: 'disposable_email', message: 'Please use a permanent email address so I can reply.' })
  }
  if (!SUBJECTS.includes(subject)) return json(400, { error: 'invalid_subject', message: 'Invalid subject.' })
  if (message.length < 10 || message.length > 2000) {
    return json(400, { error: 'invalid_message', message: 'Message must be 10 to 2000 characters.' })
  }

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown'

  // Turnstile: pastikan pengirim bukan bot
  if (typeof body.turnstileToken !== 'string' || !body.turnstileToken || body.turnstileToken.length > 4000) {
    return json(403, { error: 'captcha_missing', message: 'Verification is missing. Please refresh the page and try again.' })
  }
  let human = false
  try {
    human = await verifyTurnstile(body.turnstileToken, ip)
  } catch (err) {
    console.error('contact: Turnstile tidak dapat dihubungi', err)
    return json(502, { error: 'captcha_unavailable', message: 'Verification service is unavailable. Please try again later.' })
  }
  if (!human) {
    return json(403, { error: 'captcha_failed', message: 'Verification failed. Please try again.' })
  }

  if (!(await canReceiveMail(domain))) {
    return json(400, { error: 'invalid_email', message: 'That email domain cannot receive mail. Please check for typos.' })
  }

  const store = getStore('contact-guard')
  const now = Date.now()
  const nEmail = normalizeEmail(email)
  let recs = []

  try {
    const limit = await checkLimits(
      store,
      [
        { key: `email:${sha(nEmail)}:10m`, windowMs: 10 * MIN, max: 1 }, // 1 pesan / 10 menit / email
        { key: `email:${sha(nEmail)}:day`, windowMs: DAY, max: 3 },      // 3 pesan / hari / email
        { key: `ip:${sha(ip)}:10m`, windowMs: 10 * MIN, max: 2 },        // 2 pesan / 10 menit / IP
        { key: `ip:${sha(ip)}:hour`, windowMs: HOUR, max: 5 },           // 5 pesan / jam / IP
        { key: `global:${new Date().toISOString().slice(0, 10)}`, windowMs: DAY, max: 50 }, // rem darurat harian
      ],
      now
    )
    if (!limit.ok) {
      const mins = Math.max(1, Math.ceil(limit.retryAfter / 60))
      return json(429, {
        error: 'rate_limited',
        retryAfter: limit.retryAfter,
        message: `Too many messages. Please try again in about ${mins} minute${mins > 1 ? 's' : ''}.`,
      })
    }
    recs = limit.recs

    const dupKey = `dup:${sha(`${nEmail}|${message.toLowerCase().replace(/\s+/g, ' ')}`)}`
    const prev = await store.get(dupKey, { type: 'json' })
    if (prev && now - prev.t < DAY) {
      return json(409, { error: 'duplicate', message: 'You already sent this exact message.' })
    }

    await reserve(store, recs, now)

    // email teks biasa saja (tanpa HTML) agar aman dari injeksi
    const text = [
      `Name: ${name}`,
      `Email (not verified): ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${process.env.CONTACT_FROM || 'onboarding@resend.dev'}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: email, // tombol Reply di Gmail langsung mengarah ke pengunjung
        subject: `[${SUBJECT_TAG}] ${subject}: ${name}`,
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
