/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neo Brutalism Colors - Dark Theme (soft deep slate, not pitch black)
        'neo-dark': {
          bg: '#1e1e2e',
          card: '#2a2a3e',
          border: '#3d3d5c',
          text: '#e8e8f0',
          accent: '#a78bfa',
        },
        // Neo Brutalism Colors - Light Theme (pastel cream)
        'neo-light': {
          bg: '#fdf6ec',
          card: '#fff8f0',
          border: '#3d2e1e',
          text: '#2d1f0e',
          accent: '#e05c8a',
        },
        // Accent colors - pastel/muted variants
        'neo-yellow': '#f9e04b',
        'neo-cyan': '#67e8d4',
        'neo-pink': '#f0a0c8',
        'neo-green': '#7dd9a0',
        'neo-orange': '#f4956a',
        'neo-purple': '#c4a8f5',
        'neo-lavender': '#b8c5f5',
      },
      fontFamily: {
        'neo': ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #3d2e1e',
        'neo-hover': '0px 0px 0px 0px #3d2e1e',
        'neo-sm': '2px 2px 0px 0px #3d2e1e',
        'neo-sm-hover': '0px 0px 0px 0px #3d2e1e',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}