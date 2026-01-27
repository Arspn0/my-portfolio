/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode dengan class strategy
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        primary: '#00d9ff',
        secondary: '#0066ff',
        accent: '#00ffaa',
        dark: {
          bg: '#0a0e27',
          card: '#1a1f3a',
          border: '#2a3454',
        },
        // Light theme colors
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#1e293b',
          textSecondary: '#475569',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
      },
    },
  },
  plugins: [],
}