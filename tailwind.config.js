/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#b78b00',
        accent: '#e6b800',
        bg: '#f5f7f3',
      },
    },
  },
  plugins: [],
}
