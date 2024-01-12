/** @type {import('tailwindcss').Config} */
import palette19 from './src/assets/palette-19.json'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontsize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px",
      "6xl": "64px",
      "7xl": "72px",
    },
    colors: {
      ...palette19,
      transparent: "transparent",
      current: "currentColor",
    },
    extend: {},
  },
  plugins: ["prettier-plugin-tailwindcss"],
}

