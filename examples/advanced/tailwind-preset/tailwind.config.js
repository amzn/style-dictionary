/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./build/tailwind/preset")],
  content: ["./demo/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
