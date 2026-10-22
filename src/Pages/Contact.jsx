import React, { useEffect, useRef, useState } from 'react'
import { Send, Check, ChevronDown } from 'lucide-react'
import ProfilePicture from '../assets/profile/profile-picture.png'
import { socialMediaLinks } from '../data/SocialMediaData'
import { useTheme } from '../context/ThemeContext'
import { brandStyle } from '../data/BrandColors'
import SectionHead from '../components/SectionHead'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const ENDPOINT = '/.netlify/functions/contact'
const EMPTY_FORM = { fullName: '', email: '', subject: 'General Inquiry', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const subjectOptions = [
  'General Inquiry',
  'Project Collaboration',
  'Job Opportunity',
  'Freelance Work',
  'Just Saying Hi',
]

const field =
  'surface ink w-full border hair px-4 py-3 text-base placeholder:text-neo-light-muted dark:placeholder:text-neo-dark-muted ' +
  'transition-colors focus:outline-none focus:border-neo-light-accent dark:focus:border-neo-dark-accent'

function Contact() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')
  const [tsReady, setTsReady] = useState(false)
  const [tsFailed, setTsFailed] = useState(false)
  const [token, setToken] = useState('')
  const [notice, setNotice] = useState(false) // pesan terima kasih

  const tsRef = useRef(null)
  const widgetId = useRef(null)
  const hpRef = useRef(null)
  const startedAt = useRef(Date.now())
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // muat skrip Cloudflare Turnstile
  useEffect(() => {
    if (window.turnstile) {
      setTsReady(true)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.onload = () => setTsReady(true)
    s.onerror = () => setTsFailed(true)
    document.head.appendChild(s)
  }, [])

  // pasang widget; dipasang ulang saat tema berganti agar warnanya cocok.
  // appearance "interaction-only": widget tersembunyi kecuali perlu interaksi.
  useEffect(() => {
    if (!tsReady || !SITE_KEY || !tsRef.current) return
    const id = window.turnstile.render(tsRef.current, {
      sitekey: SITE_KEY,
      theme: theme === 'dark' ? 'dark' : 'light',
      appearance: 'interaction-only',
      callback: (t) => {
        setToken(t)
        setTsFailed(false)
      },
      'expired-callback': () => setToken(''),
      'error-callback': () => {
        setToken('')
        setTsFailed(true)
      },
    })
    widgetId.current = id
    return () => {
      try {
        window.turnstile.remove(id)
      } catch {}
      setToken('')
    }
  }, [tsReady, theme])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (status === 'error') setStatus('idle')
    setNotice(false)
  }

  const resetCaptcha = () => {
    // token hanya berlaku sekali: minta token baru setelah setiap percobaan kirim
    setToken('')
    try {
      window.turnstile.reset(widgetId.current)
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setStatus('error')
      setErrorMsg('Still verifying your browser. Please wait a moment and try again.')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          turnstileToken: token,
          website: hpRef.current?.value || '', // honeypot
          t: Date.now() - startedAt.current,   // lama pengisian form (ms)
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        // semua kolom dikosongkan; tombol menampilkan "Message sent" sebentar lalu kembali seperti semula
        setFormData(EMPTY_FORM)
        setStatus('sent')
        setNotice(true)
        startedAt.current = Date.now()
        timers.current.push(setTimeout(() => setStatus((s) => (s === 'sent' ? 'idle' : s)), 2500))
        timers.current.push(setTimeout(() => setNotice(false), 7000))
      } else {
        setStatus('error')
        setErrorMsg(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    } finally {
      resetCaptcha()
    }
  }

  const sending = status === 'sending'
  // tombol hanya bisa diklik jika semua kolom terisi dan verifikasi browser selesai
  const canSend =
    !sending &&
    !!token &&
    formData.fullName.trim().length >= 2 &&
    EMAIL_RE.test(formData.email.trim()) &&
    formData.message.trim().length >= 10
  const verifying = !token && !tsFailed && !!SITE_KEY

  return (
    <div className="page ink min-h-screen overflow-x-hidden pt-12 transition-colors duration-300 md:pt-14">
      <div className="mx-auto max-w-7xl border-x hair">
        <SectionHead n={1} title="Contact" meta="Replies within 24 hours" />

        <div className="grid border-t hair lg:grid-cols-[1.4fr_1fr]">

          {/* LEFT: FORM */}
          <div className="p-6 sm:p-12">
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Connect with me
            </h1>
            <p className="muted mt-4 max-w-lg leading-relaxed sm:text-lg">
              Let's work together and make beautiful things.
            </p>

            <form onSubmit={handleSubmit} className="relative mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="label mb-2 block">Full name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={80}
                    className={field}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label mb-2 block">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    className={field}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <p className="muted -mt-2 text-sm">Double-check your email so I can reply.</p>

              <div>
                <label htmlFor="subject" className="label mb-2 block">Subject</label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`${field} cursor-pointer appearance-none pr-10`}
                  >
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="muted pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="label mb-2 block">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={2000}
                  rows="5"
                  className={`${field} resize-none`}
                  placeholder="Tell me about your project..."
                ></textarea>
                <p className="label mt-2 text-right">{formData.message.length} / 2000</p>
              </div>

              {/* Honeypot: tidak terlihat oleh manusia, bot biasanya mengisinya */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" ref={hpRef} />
                </label>
              </div>

              {/* Turnstile (hampir selalu tidak terlihat) */}
              <div ref={tsRef} />

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={!canSend}
                  className="btn-solid disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                      Sending
                    </>
                  ) : status === 'sent' ? (
                    <><Check size={14} /> Message sent</>
                  ) : (
                    <><Send size={14} /> Send message</>
                  )}
                </button>

                <p role="status" aria-live="polite" className="muted text-sm">
                  {notice && <span className="accent">Thank you! I'll get back to you soon.</span>}
                  {!notice && verifying && 'Checking your browser…'}
                </p>
              </div>

              {!SITE_KEY && (
                <p className="accent text-sm">The contact form is not configured yet.</p>
              )}
              {tsFailed && (
                <p role="alert" className="border hair px-4 py-3 text-sm leading-relaxed">
                  <span className="accent">Error · </span>
                  Browser verification failed to load. Please refresh the page or disable extensions that block scripts.
                </p>
              )}
              {status === 'error' && errorMsg && (
                <p role="alert" className="border hair px-4 py-3 text-sm leading-relaxed">
                  <span className="accent">Error · </span>{errorMsg}
                </p>
              )}
            </form>
          </div>

          {/* RIGHT: PROFILE PANEL */}
          <aside className="border-t hair lg:border-l lg:border-t-0">
            <div className="label flex items-center gap-2 border-b hair px-6 py-3 sm:px-8">
              <span className="h-2 w-2 rounded-full bg-neo-light-accent dark:bg-neo-dark-accent" aria-hidden="true" />
              Available for work
            </div>

            <img
              src={ProfilePicture}
              alt="Profile"
              className="aspect-[4/3] w-full border-b hair object-cover"
            />

            <p className="muted border-b hair px-6 py-5 text-sm leading-relaxed sm:px-8">
              Feel free to reach out for collaborations, projects, or just a friendly chat.
              I usually respond within 24 hours.
            </p>

            <div className="label border-b hair px-6 py-3 sm:px-8">Find me on</div>
            {socialMediaLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={brandStyle(social)}
                className="brand-hover flex items-center gap-3 border-b hair px-6 py-3 text-sm transition-colors sm:px-8"
              >
                <social.icon size={16} />
                {social.label}
              </a>
            ))}
          </aside>

        </div>
      </div>
    </div>
  )
}

export default Contact