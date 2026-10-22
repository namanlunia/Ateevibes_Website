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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
