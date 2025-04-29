/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fe5602',
        accent: '#f4e6e4',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        manrope: ['var(--font-manrope)'],
      },
    },
  },
  plugins: [],
} 