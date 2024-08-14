/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "rgb(17, 148, 190)",
        light: "rgb(17, 148, 190, 0.5)"
      },
      accent: "#2e2e2e"
    },
    extend: {},
  },
  plugins: [],
}

