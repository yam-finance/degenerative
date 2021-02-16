module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
