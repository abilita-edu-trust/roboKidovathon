import { type Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      // The smallest text size is 13px, so labels stay readable.
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.125rem' }],
      },
      colors: {
        'robo-navy': '#0A1930',
        'robo-navy-light': '#0F2A4D',
        'robo-blue': '#006AA7',
        'robo-blue-hover': '#013A63',
        'robo-volt': '#FFCD00',
        'robo-volt-light': '#FFE066',
        'robo-gray': '#F2F6FA',
        'robo-slate': '#55677C',
      },
      fontFamily: {
        sans: "var(--font-body)",
        display: "var(--font-heading)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
