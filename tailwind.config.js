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
        // Neo Brutalism Colors - Dark Theme
        'neo-dark': {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#000000',
          text: '#ffffff',
          accent: '#00ff00',
        },
        // Neo Brutalism Colors - Light Theme
        'neo-light': {
          bg: '#f5f5f5',
          card: '#ffffff',
          border: '#000000',
          text: '#000000',
          accent: '#ff3366',
        },
        // Accent colors
        'neo-yellow': '#ffff00',
        'neo-cyan': '#00ffff',
        'neo-pink': '#ff00ff',
        'neo-green': '#00ff00',
        'neo-orange': '#ff6600',
      },
      fontFamily: {
        'neo': ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neo': '8px 8px 0px 0px #000000',
        'neo-hover': '0px 0px 0px 0px #000000',
        'neo-sm': '4px 4px 0px 0px #000000',
        'neo-sm-hover': '0px 0px 0px 0px #000000',
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