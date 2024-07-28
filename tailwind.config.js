module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mui-blue': {
          DEFAULT: '#111d2b',
          light: '#0b1721',
          dark: '#0a111a',
          darkest: '#070b10',
          alpha: 'rgba(10,17,26,0.60)',
        },
        'mui-gold': {
          DEFAULT: 'hsla(300, 57%, 50%, 0.76)',
          light: 'hsla(300, 57%, 50%, 0.76)',
          dark: 'hsla(300, 57%, 50%, 0.76)',
          darkest: 'hsla(300, 57%, 50%, 0.76)',
          alpha: 'hsla(299, 86%, 42%, 1)',
        },
      },
      transformOrigin: {
        'bottom-center': 'bottom center',
      },
    },
  },
  plugins: [],
  variants: {},
  corePlugins: {
    preflight: true,
  },
}
