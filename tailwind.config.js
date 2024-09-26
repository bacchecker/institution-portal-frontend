/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    
    extend: {
      colors: {
        'primaryRed': "#FE0000",
        'buttonLog': "#F31260",
      },
    },
  },
  plugins: [],
}

