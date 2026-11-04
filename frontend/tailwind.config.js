/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7', // Sky 600
          dark: '#0369a1',    // Sky 700
        },
        secondary: '#0ea5e9', // Sky 500
        accent: '#38bdf8',    // Sky 400
        dark: {
          DEFAULT: '#1e293b',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'hero-bg': "url('/src/assets/hero_bg.jpg')",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
