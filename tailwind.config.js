/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        archify: {
          bg: '#0a0d14',
          panel: '#111726',
          panelBorder: '#1e293b',
          accent: '#38bdf8',
          accentGlow: 'rgba(56, 189, 248, 0.25)',
          signal: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          blueprintBg: '#0b192e',
          blueprintGrid: '#172a46',
          blueprintLine: '#60a5fa',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-signal': 'flowSignal 1.5s linear infinite',
      },
      keyframes: {
        flowSignal: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
