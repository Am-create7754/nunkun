/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1F4ED8',
          terracotta: '#C96B4B',
          clay: '#D08A63',
          cream: '#F7F3EA',
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Lora', 'serif'],
        body: ['Poppins', 'Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
