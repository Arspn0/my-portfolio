import React from 'react'
import { ArrowUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { socialMediaLinks } from '../data/SocialMediaData'
import { brandStyle } from '../data/BrandColors'
import FooterStats from './FooterStats'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
]

function Footer() {
  const currentYear = new Date().getFullYear()
  const { pathname } = useLocation()
  // Di halaman Contact, deskripsi, daftar halaman, dan sosial sudah ada di kartu halaman itu
  const compact = pathname === '/contact'
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="page ink border-t hair pb-14 md:pb-0">
      <div className="mx-auto max-w-7xl border-x hair">

        {!compact && (
          <div className="grid md:grid-cols-[1.6fr_1fr_1fr]">
            {/* Brand */}
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center border hair font-display font-bold">AS</span>
                <span className="font-display text-2xl font-bold tracking-tight">Aris</span>
              </div>
              <p className="muted mt-5 max-w-sm leading-relaxed">
                Designing and building websites, mobile apps, and 3D concepts.
              </p>
            </div>

            {/* Pages */}
            <nav aria-label="Footer" className="border-t hair md:border-l md:border-t-0">
              <div className="label border-b hair px-6 py-3 sm:px-10">Pages</div>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block border-b hair px-6 py-3 text-sm transition-colors hover:accent sm:px-10"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Social */}
            <div className="border-t hair md:border-l md:border-t-0">
              <div className="label border-b hair px-6 py-3 sm:px-10">Social</div>
              {socialMediaLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href ?? social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={brandStyle(social)}
                  className="brand-hover flex items-center gap-3 border-b hair px-6 py-3 text-sm transition-colors sm:px-10"
                >
                  <social.icon size={16} />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t hair label flex flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center sm:px-10">
          <span>© {currentYear} Aris. All rights reserved.</span>
          <FooterStats />
          <button onClick={scrollToTop} className="btn !px-3 !py-2" aria-label="Scroll to top">
            Top <ArrowUp size={14} />
          </button>
          <span>Built with React & Tailwind</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer