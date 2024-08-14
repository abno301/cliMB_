/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(17, 148, 190)",
          light: "rgba(17, 148, 190, 0.5)"
        },
        accent: "#2e2e2e"
      },
    },
  },
  plugins: [],
}