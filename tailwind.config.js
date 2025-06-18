// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // NEW: Semantic Colors for Light Theme
        border: 'hsl(214.3 31.8% 91.4%)', // A light, neutral border
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: '#85c20b', // Lime Green for focus rings
        background: '#ffffff', // Primary White
        foreground: '#000b37', // Primary Navy Blue for text
        
        primary: {
          DEFAULT: '#85c20b', // Lime Green
          foreground: '#000b37', // Text on primary buttons
        },
        secondary: {
          DEFAULT: '#8289ec', // Soft Blue
          foreground: '#ffffff', // Text on secondary buttons
        },
        destructive: {
          DEFAULT: '#ff9a5a', // Coral Orange for errors/alerts
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'hsl(215 20.2% 95%)',    // A very light gray for subtle backgrounds
          foreground: '#474747', // Dark Gray for secondary text
        },
        accent: {
          DEFAULT: '#c3fb54', // Light Lime
          foreground: '#000b37',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#000b37',
        },

        // Supervity Brand Colors (for direct use if needed)
        navy: {
          900: '#000b37', // Primary navy
        },
        lime: {
          300: '#bef264',
          400: '#a3e635',
          500: '#85c20b', // Primary lime green
          600: '#65a30d',
          700: '#4d7c0f',
        },
        blue: {
          soft: '#8289ec', // Soft blue accent
        },
        cyan: {
          bright: '#31b8e1', // Bright cyan accent
        },
        coral: '#ff9a5a', // Coral orange for alerts
        gray: {
          light: '#c7c7c7',
          dark: '#474747',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-lime': 'pulseLime 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLime: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(133, 194, 11, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(133, 194, 11, 0)' },
        },
        glow: {
          'from': { boxShadow: '0 0 5px -5px #85c20b' },
          'to': { boxShadow: '0 0 5px 5px #85c20b' }
        },
      },
    },
  },
  plugins: [],
};