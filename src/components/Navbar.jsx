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
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'projects', path: '/projects' },
    { name: 'contact', path: '/contact' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'pt-4' 
          : 'pt-0'
      }`}
    >
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        scrolled 
          ? 'bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-md rounded-2xl shadow-lg shadow-primary/10 border border-light-border dark:border-dark-border' 
          : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link 
              to="/"
              className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-300"
            >
              YourName
            </Link>
          </div>
          
          {/* Desktop Menu - Center */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-baseline space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10 shadow-sm shadow-primary/20'
                      : 'text-light-textSecondary dark:text-slate-300 hover:text-primary hover:bg-light-border/50 dark:hover:bg-dark-bg/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-border/50 dark:bg-dark-bg text-light-text dark:text-slate-300 hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-light-text dark:text-slate-300 hover:text-primary p-2 rounded-md transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 px-2 pt-2 pb-3 space-y-1 bg-light-card/95 dark:bg-dark-card/95 backdrop-blur-md rounded-2xl border border-light-border dark:border-dark-border">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`capitalize block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-light-textSecondary dark:text-slate-300 hover:text-primary hover:bg-light-border/50 dark:hover:bg-dark-bg/50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar