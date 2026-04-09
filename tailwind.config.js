/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ipark-red': '#BA0C2F',
        'ipark-gray': '#6B6B6B',
        'ipark-dark': '#2D2D2D',
        'ipark-light': '#F5F5F0',
        'ipark-beige': '#E8D5B7',
        'ipark-blue': '#4A90D9',
        'ipark-green': '#2E8B57',
        'ipark-orange': '#E67E22',
        'ipark-gold': '#C9A96E',
      }
    },
  },
  plugins: [],
}