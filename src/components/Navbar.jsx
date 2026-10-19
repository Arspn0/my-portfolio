import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Link, useLocation } from 'react-router-dom'

const tabBase = 'font-mono text-[11px] uppercase tracking-[0.08em]'
const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
]

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const isActive = (path) => pathname === path

  const logo = (
    <Link
      to="/"
      aria-label="Home"
      className="grid h-full w-12 md:w-14 place-items-center border-r hair ink font-display text-lg font-bold hover:accent"
    >
      AS
    </Link>
  )

  const themeButton = (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="grid h-full w-12 md:w-14 place-items-center border-l hair ink transition-colors hover:accent"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )

  return (
    <>
      {/* DESKTOP + MOBILE TOP BAR */}
      <header className="fixed top-0 z-50 h-12 w-full border-b hair bg-neo-light-bg/90 backdrop-blur dark:bg-neo-dark-bg/90 md:h-14">
        <div className="mx-auto flex h-full max-w-7xl border-x hair">
          {logo}

          <nav className="hidden md:flex h-full" aria-label="Main">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`${tabBase} flex items-center border-r hair px-6 transition-colors ${
                  isActive(item.path) ? 'tab-on' : 'muted hover:surface hover:ink'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto h-full">{themeButton}</div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav
        aria-label="Main"
        className="fixed bottom-0 z-50 grid w-full grid-cols-4 border-t hair bg-neo-light-bg dark:bg-neo-dark-bg md:hidden"
      >
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={`${tabBase} py-4 text-center border-r hair last:border-r-0 ${
              isActive(item.path) ? 'tab-on' : 'muted'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </>
  )
}

export default Navbar