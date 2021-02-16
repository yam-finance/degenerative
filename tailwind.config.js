/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: "var(--primary)",
      back: "var(--back-act)",
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      indigo: colors.indigo,
      red: colors.red,
      green: colors.green,
      blue: "#6799e5",
      yellow: colors.yellow,
    },
    boxShadow: {
      "3": "3px 3px 0 0 rgba(0, 0, 0, 0.06)",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
