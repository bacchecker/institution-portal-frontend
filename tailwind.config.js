import defaultTheme from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      // Inter
      colors: {
        primaryRed: "#FE0000",
        bChkRed: "#FD0D0E",
        buttonLog: "#F31260",
        deepBlue: "#232263",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
