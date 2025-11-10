/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'primary-black': '#1a1a1a',
        'primary-white': '#ffffff',
        'accent-red': '#c41e3a',
        'gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          600: '#525252',
          800: '#262626',
        },
        'success': '#16a34a',
        'warning': '#d97706',
        'error': '#dc2626',
      },
      maxWidth: {
        'container': '1200px',
        'content': '800px',
      },
      width: {
        'sidebar': '300px',
      },
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
        'large-desktop': '1440px',
      },
    },
  },
  plugins: [],
}