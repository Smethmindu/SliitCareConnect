/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        wellness: {
          50: '#f5f6fa',
          100: '#ebeef5',
          200: '#d3d8e8',
          300: '#b0b8d6',
          400: '#8b96c0',
          500: '#6b76a8',
          600: '#555e8a',
          700: '#454c70',
          800: '#3a405c',
          900: '#32364e',
        },
        sage: {
          50: '#f4f7f6',
          100: '#e4ebe8',
          200: '#cbdad4',
          300: '#a7c1b8',
          400: '#82a098',
          500: '#64857c',
          600: '#4f6962',
        },
        lavender: {
          50: '#f9f8fc',
          100: '#f2eff8',
          200: '#e2dcf0',
          300: '#cbbfe3',
          400: '#b09ed2',
          500: '#947cbd',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f8f4e9',
          200: '#efe6d1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(107, 118, 168, 0.08)',
        'soft-lg': '0 10px 30px -3px rgba(107, 118, 168, 0.12)',
      }
    },
  },
  plugins: [],
}
