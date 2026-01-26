import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      // Navbar menjadi floating setelah scroll 100px
      setScrolled(window.scrollY > 100)
      
      const sections = ['home', 'about', 'projects', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const menuItems = ['home', 'about', 'projects', 'contact']

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'pt-4' // Padding top saat floating
          : 'pt-0'
      }`}
    >
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        scrolled 
          ? 'bg-dark-card/80 backdrop-blur-md rounded-2xl shadow-lg shadow-primary/10 border border-dark-border' 
          : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-300"
            >
              YourName
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === item
                      ? 'text-primary bg-primary/10 shadow-sm shadow-primary/20'
                      : 'text-slate-300 hover:text-primary hover:bg-dark-bg/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-primary p-2 rounded-md transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 px-2 pt-2 pb-3 space-y-1 bg-dark-card/95 backdrop-blur-md rounded-2xl border border-dark-border">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`capitalize block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                activeSection === item
                  ? 'text-primary bg-primary/10'
                  : 'text-slate-300 hover:text-primary hover:bg-dark-bg/50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar