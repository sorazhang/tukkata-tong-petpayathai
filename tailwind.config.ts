import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // legacy aliases — kept so existing classes keep working
        'brand-black':    '#14110F',  // → Void
        'brand-red':      '#A63A2E',  // → Clay
        'brand-red-dark': '#8A7038',  // → Gold Dim

        // full palette
        'brand-void':      '#14110F',
        'brand-card':      '#211C17',
        'brand-card-edge': '#2E271F',
        'brand-gold':      '#C79A48',
        'brand-gold-dim':  '#8A7038',
        'brand-clay':      '#A63A2E',
        'brand-bone':      '#EDE6D9',
        'brand-bone-dim':  '#B8AF9E',
        'brand-muted':     '#8C8175',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        thai: ['"Noto Sans Thai"', '"TH Sarabun New"', '"Leelawadee UI"', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: { color: '#C79A48', '&:hover': { color: '#8A7038' } },
            'h2, h3': { color: '#EDE6D9' },
            blockquote: {
              borderLeftColor: '#A63A2E',
              fontStyle: 'normal',
              color: '#B8AF9E',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
