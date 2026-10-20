import React, { useEffect, useRef, useState } from 'react'
import { Send, Check, ChevronDown } from 'lucide-react'
import ProfilePicture from '../assets/profile/profile-picture.png'
import { socialMediaLinks } from '../data/SocialMediaData'
import { useTheme } from '../context/ThemeContext'
import SectionHead from '../components/SectionHead'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const ENDPOINT = '/.netlify/functions/contact'

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

// Hanya untuk menampilkan email di layar. Server yang memverifikasi token sebenarnya.
function decodeJwt(token) {
  const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

function Contact() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({ fullName: '', subject: 'General Inquiry', message: '' })
  const [user, setUser] = useState(null) // { credential, email, name }
  const [gsiReady, setGsiReady] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const btnRef = useRef(null)
  const hpRef = useRef(null)
  const startedAt = useRef(Date.now())
  const handlerRef = useRef(null)

  // muat Google Identity Services
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGsiReady(true)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.onload = () => setGsiReady(true)
    document.head.appendChild(s)
  }, [])

  handlerRef.current = (resp) => {
    try {
      const p = decodeJwt(resp.credential)
      setUser({ credential: resp.credential, email: p.email, name: p.name || '' })
      setFormData((f) => ({ ...f, fullName: f.fullName || p.name || '' }))
      setStatus('idle')
      setErrorMsg('')
    } catch {
      setStatus('error')
      setErrorMsg('Could not read the Google sign-in. Please try again.')
    }
  }

  // gambar tombol "Continue with Google"; gambar ulang saat tema berganti
  useEffect(() => {
    if (!gsiReady || user || !CLIENT_ID || !btnRef.current) return
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (r) => handlerRef.current(r),
    })
    window.google.accounts.id.renderButton(btnRef.current, {
      type: 'standard',
      theme: theme === 'dark' ? 'filled_black' : 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
    })
  }, [gsiReady, user, theme])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (status === 'sent' || status === 'error') setStatus('idle')
  }

  const signOut = () => {
    window.google?.accounts?.id?.disableAutoSelect()
    setUser(null)
    setStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setStatus('error')
      setErrorMsg('Please verify your email with Google first.')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: user.credential,
          fullName: formData.fullName,
          subject: formData.subject,
          message: formData.message,
          website: hpRef.current?.value || '', // honeypot
          t: Date.now() - startedAt.current,   // lama pengisian form (ms)
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('sent')
        setFormData((f) => ({ ...f, message: '' }))
        startedAt.current = Date.now()
        return
      }
      if (res.status === 401) setUser(null) // token kedaluwarsa: minta masuk ulang
      setStatus('error')
      setErrorMsg(data.message || 'Something went wrong. Please try again.')
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  const sending = status === 'sending'

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
              {/* Email: diverifikasi lewat akun Google */}
              <div>
                <span className="label mb-2 block">Email</span>
                {user ? (
                  <div className="surface flex items-center justify-between gap-3 border hair px-4 py-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <Check size={16} className="accent shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </span>
                    <button type="button" onClick={signOut} className="label shrink-0 transition-colors hover:accent">
                      Change
                    </button>
                  </div>
                ) : CLIENT_ID ? (
                  <div>
                    <div ref={btnRef} className="min-h-[44px]" />
                    <p className="muted mt-2 text-sm leading-relaxed">
                      Continue with Google so I know your email is real. It's only used to reply to you.
                    </p>
                  </div>
                ) : (
                  <p className="accent text-sm">Google sign-in is not configured yet.</p>
                )}
              </div>

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

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={sending || !user}
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

                <p role="status" aria-live="polite" className="accent text-sm">
                  {status === 'sent' && "Thank you! I'll get back to you soon."}
                </p>
              </div>

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
                className="flex items-center gap-3 border-b hair px-6 py-3 text-sm transition-colors hover:accent sm:px-8"
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