/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors: {
      verde:'#00CB6A',
      celeste:'#4DC9FE',
    }
    },
  },
  plugins: [],
}
