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

// Catatan: tautan/tombol tetap memenuhi satu sel (area klik besar), tetapi latar dan kotak kursor
// hanya mengikuti elemen dalam bertanda data-cursor-box, yang lebih kecil dari selnya.

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const isActive = (path) => pathname === path

  const logo = (
    <Link
      to="/"
      aria-label="Home"
      className="group grid h-full w-12 md:w-14 place-items-center border-r hair ink font-display text-lg font-bold"
    >
      <span data-cursor-box className="px-2 py-1 transition-colors group-hover:accent">AS</span>
    </Link>
  )

  const themeButton = (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="group grid h-full w-12 md:w-14 place-items-center border-l hair ink"
    >
      <span data-cursor-box className="grid place-items-center p-2 transition-colors group-hover:accent">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </span>
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
                className="group flex items-center border-r hair px-3"
              >
                <span
                  data-cursor-box
                  className={`${tabBase} px-3 py-2 transition-colors ${
                    isActive(item.path) ? 'tab-on' : 'muted group-hover:surface group-hover:ink'
                  }`}
                >
                  {item.name}
                </span>
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
            className="flex items-center justify-center border-r hair py-2 last:border-r-0"
          >
            <span
              className={`${tabBase} px-3 py-2 ${isActive(item.path) ? 'tab-on' : 'muted'}`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </>
  )
}

export default Navbar