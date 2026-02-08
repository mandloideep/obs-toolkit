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
          indigo: '#6366f1',
          purple: '#8b5cf6',
          pink: '#ec4899',
          amber: '#f59e0b',
          emerald: '#10b981',
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#1a1a28',
          border: 'rgba(99, 102, 241, 0.2)',
          text: '#ffffff',
          muted: '#9ca3af',
        }
      },
    },
  },
  plugins: [],
}
