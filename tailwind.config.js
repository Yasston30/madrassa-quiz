/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        madrassa: {
          50: '#eaf5f1',
          100: '#cfe8de',
          200: '#9fd1bd',
          300: '#6bb89a',
          400: '#3d9c7a',
          500: '#1f7f5e',
          600: '#146349',
          700: '#0f4f3b',
          800: '#0b4a3f',
          900: '#073128',
          950: '#04201a',
        },
        gold: {
          200: '#f8e6b8',
          300: '#f3d27a',
          400: '#e6bb4f',
          500: '#c9941f',
          600: '#a8780f',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(243,210,122,0.25), 0 8px 30px -8px rgba(7,49,40,0.6)',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.25s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
