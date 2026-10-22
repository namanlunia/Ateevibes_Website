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
        obsidian: '#111111',
        champagne: '#c9a45c',
        gold: {
          DEFAULT: '#c9a45c',
          light: '#dfca95',
          dark: '#9e7b35',
        },
        ivory: {
          DEFAULT: '#f7f4ee',
          light: '#fcfaf7',
          dark: '#ede7dc',
        },
        graphite: '#292925',
        sandstone: '#e7e0d3',
        brand: {
          black: '#111111',
          gold: '#c9a45c',
          ivory: '#f7f4ee',
          graphite: '#292925',
          sandstone: '#e7e0d3',
          green: 'var(--green)',
          cream: 'var(--cream)',
          white: 'var(--white)',
        },
        cream: 'var(--cream)',
        tab: {
          'active-bg': 'var(--tab-active-bg)',
          'active-text': 'var(--tab-active-text)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
          dark: 'var(--border-dark)',
          gold: 'var(--border-gold)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          ivory: 'var(--surface-ivory)',
          tint: 'var(--surface-tint)',
          dark: 'var(--surface-dark)',
          graphite: 'var(--surface-graphite)',
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
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '18px',
        '2xl': '24px',
        pill: '999px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(17,17,17,.04), 0 4px 12px rgba(17,17,17,.03)',
        soft: '0 1px 3px rgba(17,17,17,.05), 0 8px 24px rgba(17,17,17,.06)',
        'soft-hover': '0 4px 8px rgba(17,17,17,.04), 0 16px 36px rgba(17,17,17,.08)',
        luxury: '0 20px 48px -12px rgba(17,17,17,.12)',
        glass: '0 8px 32px 0 rgba(17,17,17,0.06)',
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
