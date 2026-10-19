import React, { useState } from 'react'
import { Send, Check, ChevronDown } from 'lucide-react'
import ProfilePicture from '../assets/profile/profile-picture.png'
import { socialMediaLinks } from '../data/SocialMediaData'
import SectionHead from '../components/Sectionhead'

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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [formStatus, setFormStatus] = useState({ submitted: false, loading: false })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus({ loading: true, submitted: false })

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ loading: false, submitted: true })
      setFormData({ fullName: '', email: '', subject: 'General Inquiry', message: '' })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormStatus({ loading: false, submitted: false })
      }, 3000)
    }, 1500)
  }

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

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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
                    className={field}
                    placeholder="your@email.com"
                  />
                </div>
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
                  rows="5"
                  className={`${field} resize-none`}
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="btn-solid disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formStatus.loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                      Sending
                    </>
                  ) : formStatus.submitted ? (
                    <><Check size={14} /> Message sent</>
                  ) : (
                    <><Send size={14} /> Send message</>
                  )}
                </button>

                <p role="status" aria-live="polite" className="accent text-sm">
                  {formStatus.submitted && "Thank you! I'll get back to you soon."}
                </p>
              </div>
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