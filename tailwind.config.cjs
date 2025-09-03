/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0015AA',
        'brand-orange': '#FBB03B',
        'white': '#FFFFFF', // It's good practice to define core colors
      },
    },
  },
  plugins: [],
}