/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',  // For Next.js `pages` directory
    './components/**/*.{js,ts,jsx,tsx}',  // If you have a `components` directory
    './app/**/*.{js,ts,jsx,tsx}',  // For Next.js 13+ `app` directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
