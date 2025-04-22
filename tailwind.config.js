/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
}

