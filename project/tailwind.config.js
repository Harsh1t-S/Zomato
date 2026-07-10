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
        'zomato-red': '#E23744',
        'zomato-red-dark': '#CB202D',
      }
    },
  },
  plugins: [],
}