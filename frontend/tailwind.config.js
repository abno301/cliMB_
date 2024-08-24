/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#673AB7",
          light: "#c1ade5"
        },
        accent: {
          DEFAULT: "#FFC107",
          light: "#ffebad"
        }
      },
    },
  },
  plugins: [],
}