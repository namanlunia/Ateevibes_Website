/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          green: 'var(--green)',
          cream: 'var(--cream)',
          white: 'var(--white)',
        },
        cream: 'var(--cream)',
        gold: 'var(--gold)',
        tab: {
          'active-bg': 'var(--tab-active-bg)',
          'active-text': 'var(--tab-active-text)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
        },
        border: 'var(--border)',
        surface: {
          DEFAULT: 'var(--surface)',
          tint: 'var(--surface-tint)',
        },
        accent: {
          500: 'var(--accent-500)',
          700: 'var(--accent-700)',
        },
        status: {
          success: 'var(--success)',
          error: 'var(--error)',
          warning: 'var(--warning)',
        },
      },
      backgroundImage: {
        'grad-flow': 'var(--grad-flow)',
        'grad-flow-rev': 'var(--grad-flow-rev)',
        'grad-vertical': 'var(--grad-vertical)',
        'grad-glow': 'var(--grad-glow)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,36,26,.06), 0 8px 24px rgba(28,36,26,.08)',
        'soft-hover': '0 16px 40px rgba(28,36,26,.14)',
        glass: '0 8px 32px 0 rgba(28, 36, 26, 0.08)',
      },
      zIndex: {
        nav: '50',
        drawer: '60',
        modal: '70',
        toast: '80',
        curtain: '90',
        cursor: '100',
        preloader: '110',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        floatSlow1: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(40px, -30px) scale(1.08)' },
        },
        floatSlow2: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-50px, 35px) scale(0.92)' },
        },
        floatSlow3: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, 45px) scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        gradient: 'gradientShift 18s ease-in-out infinite',
        'float-1': 'floatSlow1 22s ease-in-out infinite',
        'float-2': 'floatSlow2 26s ease-in-out infinite',
        'float-3': 'floatSlow3 24s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 1.4s infinite linear',
      },
    },
  },
  plugins: [],
}
