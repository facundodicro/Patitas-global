/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F766E',
          dark: '#0B5B56',
          light: '#0D9488',
          soft: '#CCFBF1',
          faint: '#F0FDFA',
        },
        accent: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          soft: '#FFEDD5',
        },
        status: {
          perdido: '#DC2626',
          encontrado: '#16A34A',
          encasa: '#78716C',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgb(0 0 0 / 0.08), 0 4px 12px rgb(0 0 0 / 0.06)',
        pop: '0 8px 30px rgb(0 0 0 / 0.16)',
      },
    },
  },
  plugins: [],
}
