import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", 
              "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", 
              "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
            ],

  theme: {
    extend: {
      colors: {
        primaryRed: "#FE0000",
        bChkRed: "#FF0404",
        buttonLog: "#F31260",
        cusPurp: "#CB3CFF",
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        iconPop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        }
      },
      animation: {
        bounceSubtle: 'bounceSubtle 1.8s ease-in-out infinite',
        iconPop: 'iconPop 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [nextui()],
};
