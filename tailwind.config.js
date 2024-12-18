import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",],

  theme: {
    extend: {
      colors: {
        primaryRed: "#FE0000",
        bChkRed: "#FF0404",
        buttonLog: "#F31260",
        cusPurp: "#CB3CFF",
      },
    },
  },
  plugins: [nextui()],
};
