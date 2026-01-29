import React from 'react'
import { Github, Linkedin, Mail, Twitter, ArrowUp, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' }
  ]

  const socialLinks = [
    { icon: Github, link: 'https://github.com/yourusername', label: 'GitHub', color: 'neo-cyan' },
    { icon: Linkedin, link: 'https://linkedin.com/in/yourusername', label: 'LinkedIn', color: 'neo-pink' },
    { icon: Twitter, link: 'https://twitter.com/yourusername', label: 'Twitter', color: 'neo-yellow' },
    { icon: Mail, link: 'mailto:your.email@example.com', label: 'Email', color: 'neo-green' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-neo-light-card dark:bg-neo-dark-card border-t-4 border-neo-light-border dark:border-neo-dark-border">
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 p-4 bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg transition-all duration-200"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} strokeWidth={3} />
      </button>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-4xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4">
                ARIS
              </h3>
              <div className="w-20 h-2 bg-neo-yellow dark:bg-neo-green border-2 border-neo-light-border dark:border-neo-dark-border mb-4"></div>
              <p className="text-neo-light-text dark:text-neo-dark-text font-neo font-bold leading-relaxed">
                Full Stack Developer passionate about creating bold digital experiences.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-${social.color} border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo-sm hover:shadow-neo-sm-hover hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-all duration-200`}
                  aria-label={social.label}
                >
                  <social.icon size={20} strokeWidth={3} className="text-neo-light-border dark:text-neo-dark-bg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="inline-block text-neo-light-text dark:text-neo-dark-text font-neo font-bold hover:text-neo-yellow dark:hover:text-neo-green transition-colors duration-200 hover:translate-x-2 transform"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-6">
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div className="bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border p-4">
                <p className="text-xs font-bold text-neo-light-text dark:text-neo-dark-text opacity-60 mb-1 font-neo uppercase">
                  Email
                </p>
                <a 
                  href="mailto:your.email@example.com"
                  className="text-neo-light-text dark:text-neo-dark-text font-neo font-bold hover:text-neo-cyan dark:hover:text-neo-pink transition-colors duration-200"
                >
                  your.email@example.com
                </a>
              </div>
              <div className="bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border p-4">
                <p className="text-xs font-bold text-neo-light-text dark:text-neo-dark-text opacity-60 mb-1 font-neo uppercase">
                  Phone
                </p>
                <a 
                  href="tel:+6281234567890"
                  className="text-neo-light-text dark:text-neo-dark-text font-neo font-bold hover:text-neo-cyan dark:hover:text-neo-pink transition-colors duration-200"
                >
                  +62 812-3456-7890
                </a>
              </div>
              <div className="bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border p-4">
                <p className="text-xs font-bold text-neo-light-text dark:text-neo-dark-text opacity-60 mb-1 font-neo uppercase">
                  Location
                </p>
                <p className="text-neo-light-text dark:text-neo-dark-text font-neo font-bold">
                  Bandung, Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-4 border-neo-light-border dark:border-neo-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-3">
              <p className="text-neo-light-text dark:text-neo-dark-text text-sm font-bold font-neo uppercase">
                © {currentYear} ARIS. ALL RIGHTS RESERVED.
              </p>
            </div>

            {/* Made With */}
            <div className="flex items-center gap-2">
              <div className="bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-3">
                <p className="text-neo-light-bg dark:text-neo-dark-bg text-sm font-bold font-neo uppercase flex items-center gap-2">
                  Made with 
                  React & Tailwind
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer