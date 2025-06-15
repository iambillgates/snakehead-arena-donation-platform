/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonPurple: '#9b59b6',
        neonBlue: '#2980b9',
        neonPink: '#e91e63',
        neonGreen: '#2ecc71',
        neonYellow: '#f1c40f',
        backgroundBlack: '#0a0a0a',
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
