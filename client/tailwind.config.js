
import daisyui from 'daisyui'
import tailwindcssMotion from "tailwindcss-motion"; 
import tailwindcssIntersect from "tailwindcss-intersect"
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
 
  plugins: [daisyui,tailwindcssMotion,tailwindcssIntersect],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#030064',
          secondary: '#141175',
          accent: "#373737",
          neutral: '#010506',
          white: '#EEF8F7',
        },
      },
    ],
  },
}

