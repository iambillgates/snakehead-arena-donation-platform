/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundBlack: '#000000',
        neonPurple: '#9b59b6',
        neonPink: '#e056fd',
      },
      animation: {
        'neon-pulse': 'neon-pulse 1.5s infinite alternate',
      },
      keyframes: {
        'neon-pulse': {
          '0%': {
            textShadow: `
              0 0 7px #9b59b6,
              0 0 10px #9b59b6,
              0 0 21px #9b59b6,
              0 0 42px #9b59b6
            `
          },
          '100%': {
            textShadow: `
              0 0 4px #9b59b6,
              0 0 7px #9b59b6,
              0 0 15px #9b59b6,
              0 0 30px #9b59b6
            `
          }
        }
      }
    },
  },
  plugins: [],
}
