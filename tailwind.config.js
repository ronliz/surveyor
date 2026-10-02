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
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
        },
        survey: {
          cctv: '#3b82f6',
          access: '#10b981',
          intrusion: '#f59e0b',
          fire: '#ef4444',
          network: '#8b5cf6',
          cable: '#6366f1',
          audio: '#ec4899',
        }
      }
    },
  },
  plugins: [],
}
