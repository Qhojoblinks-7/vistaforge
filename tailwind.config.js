/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0015AA',
        'brand-orange': '#FBB03B',
        'white': '#FFFFFF',
        'primary': {
          DEFAULT: '#1E40AF', // Blue-800
          light: '#3B82F6',   // Blue-500
          dark: '#1E3A8A',    // Blue-900
        },
        'secondary': {
          DEFAULT: '#10B981', // Emerald-500
        },
        'danger': {
          DEFAULT: '#DC2626', // Red-600
        },
        'background': '#F9FAFB', // Gray-50
        'surface': '#FFFFFF',    // White
      },
    },
  },
  plugins: [],
}