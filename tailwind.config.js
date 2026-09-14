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
        sans: ['Poppins', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        secondary: ['Prompt', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
        display: ['Prompt', 'Outfit', 'Space Grotesk', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        canon: ['"IM Fell French Canon"', 'serif'],
        imperial: ['"Imperial Script"', 'cursive'],
        quintessential: ['Quintessential', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
        handwriting: ['"Imperial Script"', 'Caveat', 'Kalam', 'cursive'],
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
