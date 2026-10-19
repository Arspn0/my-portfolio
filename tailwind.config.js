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
      // Slate & clay - dark
      'neo-dark': {
        bg: '#101216',
        card: '#181B21',
        border: '#272B33',
        text: '#ECEAE6',
        muted: '#8B8F98',
        accent: '#D17A5A',
      },
      // Slate & clay - light
      'neo-light': {
        bg: '#F2EFEA',
        card: '#FAF8F5',
        border: '#DDD8D0',
        text: '#15171C',
        muted: '#666A73',
        accent: '#B5532F',
      },
      // Aksen pastel lama
      'neo-yellow': '#D8B26E',
      'neo-cyan': '#7FB5B0',
      'neo-pink': '#D49AA0',
      'neo-green': '#8DB596',
      'neo-orange': '#D17A5A',
      'neo-purple': '#A79BC9',
      'neo-lavender': '#9FB0CC',
    },
    fontFamily: {
      neo: ['"DM Sans"', 'sans-serif'],
      display: ['Sora', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    boxShadow: {
      'neo': '0 1px 2px rgb(0 0 0 / 0.08)',
      'neo-hover': '0 0 0 0 transparent',
      'neo-sm': '0 1px 2px rgb(0 0 0 / 0.06)',
      'neo-sm-hover': '0 0 0 0 transparent',
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