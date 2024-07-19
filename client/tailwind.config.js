/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        beige:'#EBECD0',
        green:'#739552',
        darkgrey: '#262522',
        highlight:'#f5f682'
      }
    },
  },
  plugins: [],
}

