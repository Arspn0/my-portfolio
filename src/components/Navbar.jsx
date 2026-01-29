import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 pt-4`}
    >
      <div className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' 
          : 'bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      }`}>
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link 
              to="/"
              className="text-2xl sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase tracking-tight hover:text-neo-yellow dark:hover:text-neo-green transition-colors duration-200"
            >
              AS
            </Link>
          </div>
          
          {/* Desktop Menu - Center */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-5 py-2 font-black text-sm font-neo uppercase transition-all duration-200 border-2 ${
                    isActive(item.path)
                      ? 'bg-neo-yellow dark:bg-neo-green text-neo-light-border dark:text-neo-dark-bg border-neo-light-border dark:border-neo-dark-border shadow-neo-sm'
                      : 'bg-transparent text-neo-light-text dark:text-neo-dark-text border-transparent hover:border-neo-light-border dark:hover:border-neo-dark-border hover:bg-neo-light-card dark:hover:bg-neo-dark-card'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-3 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg shadow-neo-sm hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg shadow-neo-sm hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-4 py-3 font-black text-base font-neo uppercase transition-all duration-200 border-2 ${
                  isActive(item.path)
                    ? 'bg-neo-yellow dark:bg-neo-green text-neo-light-border dark:text-neo-dark-bg border-neo-light-border dark:border-neo-dark-border shadow-neo-sm'
                    : 'bg-transparent text-neo-light-text dark:text-neo-dark-text border-transparent hover:border-neo-light-border dark:hover:border-neo-dark-border hover:bg-neo-light-bg dark:hover:bg-neo-dark-bg'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar