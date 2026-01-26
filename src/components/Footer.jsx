import React from 'react'
import { Heart, Github, Linkedin, Mail, Twitter, ArrowUp } from 'lucide-react'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' }
  ]

  const socialLinks = [
    { icon: Github, link: 'https://github.com/yourusername', label: 'GitHub' },
    { icon: Linkedin, link: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
    { icon: Twitter, link: 'https://twitter.com/yourusername', label: 'Twitter' },
    { icon: Mail, link: 'mailto:your.email@example.com', label: 'Email' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-dark-card border-t border-dark-border">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 p-4 bg-primary text-dark-bg rounded-full hover:bg-accent transition-all duration-300 hover:scale-110 shadow-lg shadow-primary/30"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">YourName</h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Full Stack Developer passionate about creating beautiful and functional web applications.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-dark-bg rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-slate-200 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-slate-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="text-slate-200 font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a 
                  href="mailto:your.email@example.com"
                  className="hover:text-primary transition-colors duration-300"
                >
                  your.email@example.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+6281234567890"
                  className="hover:text-primary transition-colors duration-300"
                >
                  +62 812-3456-7890
                </a>
              </li>
              <li className="text-sm">
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} YourName. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              Made with <Heart size={16} className="text-primary animate-pulse" /> using React & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer