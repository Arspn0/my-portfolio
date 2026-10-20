import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// warna garis = aksen tema tujuan
const LINE_COLOR = { dark: '#D17A5A', light: '#B5532F' }

// Dua garis aksen 2px. Masing-masing diberi view-transition-name sehingga menjadi
// lapisan tersendiri di atas halaman (tidak ikut terpotong), lalu browser menggerakkannya
// dari posisi lama (tengah layar) ke posisi baru (tepi atas dan bawah).
// Durasi dan easing-nya diatur lewat CSS (lihat index.css).
function createLines(next) {
  const H = window.innerHeight
  const mid = Math.round(H / 2)
  const make = (name, top) => {
    const el = document.createElement('div')
    el.setAttribute('aria-hidden', 'true')
    Object.assign(el.style, {
      position: 'fixed',
      left: '0',
      right: '0',
      top: `${top}px`,
      height: '2px',
      background: LINE_COLOR[next],
      zIndex: '2147483647',
      pointerEvents: 'none',
      viewTransitionName: name,
    })
    document.body.appendChild(el)
    return el
  }
  return { a: make('shutter-a', mid), b: make('shutter-b', mid - 2), H }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Cek localStorage untuk saved theme
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'dark'
  })
  const busy = useRef(false)

  useEffect(() => {
    // Save theme ke localStorage
    localStorage.setItem('theme', theme)

    // Update root class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    if (busy.current) return
    const next = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement

    // 1) Reduced motion: ganti langsung
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next)
      return
    }

    // 2) Tanpa dukungan View Transitions: crossfade warna sederhana
    if (!document.startViewTransition) {
      root.classList.add('theme-fade')
      setTheme(next)
      setTimeout(() => root.classList.remove('theme-fade'), 350)
      return
    }

    // 3) Shutter tengah
    busy.current = true
    const lines = createLines(next) // ada di keadaan lama (tengah layar)

    const transition = document.startViewTransition(() => {
      // keadaan baru: tema berganti, garis pindah ke tepi atas dan bawah
      root.classList.toggle('dark', next === 'dark')
      flushSync(() => setTheme(next))
      lines.a.style.top = '0px'
      lines.b.style.top = `${lines.H - 2}px`
    })

    transition.finished.finally(() => {
      lines.a.remove()
      lines.b.remove()
      busy.current = false
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}