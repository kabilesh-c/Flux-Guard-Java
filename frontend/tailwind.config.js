/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for fraud detection system
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          500: '#06b6d4', // Cyan accent
          600: '#0891b2',
        },
        dark: {
          bg: '#0f172a',
          card: '#0b1220',
          border: 'rgba(255, 255, 255, 0.04)',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
        'gradient-accent': 'linear-gradient(90deg, #06b6d4, #3b82f6)',
        'gradient-card': 'radial-gradient(circle at top right, #1e3a8a 0%, #0f172a 50%, #0f172a 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(2, 6, 23, 0.6)',
        'card-hover': '0 8px 32px rgba(2, 6, 23, 0.8)',
      },
      borderRadius: {
        'card': '24px',
      },
      backdropBlur: {
        'card': '6px',
      },
    },
  },
  plugins: [],
}
