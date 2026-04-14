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
        'brand-black': '#1a1a1a',
        'brand-red': '#d32f2f',
        'brand-red-dark': '#b71c1c',
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
            a: { color: '#d32f2f', '&:hover': { color: '#b71c1c' } },
            'h2, h3': { color: '#1a1a1a' },
            blockquote: {
              borderLeftColor: '#d32f2f',
              fontStyle: 'normal',
              color: '#555',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
