import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrolledMore, setScrolledMore] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 50)
      setScrolledMore(scrollY > 100)
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
    <>
      {/* DESKTOP NAVBAR - Top Floating */}
      <nav className="hidden md:block fixed top-0 w-full z-50 transition-all duration-300 pt-4">
        <div 
          className={`transition-all duration-500 ease-in-out rounded-full bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border mx-auto px-4 sm:px-6 lg:px-8 ${
            scrolledMore 
              ? 'max-w-2xl' 
              : scrolled 
              ? 'max-w-4xl' 
              : 'max-w-7xl'
          }`}
        >
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
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`rounded-full px-5 py-2 font-black text-sm font-neo uppercase transition-all duration-200 border-2 ${
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

            {/* Theme Switcher - Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="rounded-full p-3 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg shadow-neo-sm hover:shadow-neo-sm-hover hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE - Top Bar (Logo & Theme Toggle) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 pt-4 px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Top Left */}
          <Link 
            to="/"
            className="bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border rounded-full px-6 py-3"
          >
            <span className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase tracking-tight">
              AS
            </span>
          </Link>

          {/* Theme Toggle - Top Right */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-3 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg shadow-neo hover:shadow-neo-sm-hover hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* MOBILE - Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-4 px-4">
        <div className="bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border rounded-full px-2 py-2">
          <div className="flex items-center justify-around gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex-1 text-center rounded-full px-3 py-3 font-black text-xs font-neo uppercase transition-all duration-200 border-2 ${
                  isActive(item.path)
                    ? 'bg-neo-yellow dark:bg-neo-green text-neo-light-border dark:text-neo-dark-bg border-neo-light-border dark:border-neo-dark-border shadow-neo-sm'
                    : 'bg-transparent text-neo-light-text dark:text-neo-dark-text border-transparent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar