/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    
    extend: {
      fontFamily: {
        "lato": ['Lato', 'sans-serif']
      },

      colors: {
        'primaryRed': "#FE0000",
        'buttonLog': "#F31260",
        'deepBlue': "#232263",
      },
    },
  },
  plugins: [],
}

