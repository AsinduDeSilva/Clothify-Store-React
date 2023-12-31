/** @type {import('tailwindcss').Config} */

module.exports = ({
  content: [
    "./index.html", "./src/**/*.{js,jsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs':'350px',
      'sm': '600px',
      'md': '900px',
      'lg': '1024px',
      'xl': '1200px',
      '2xl': '1536px',
    }
  },
  plugins: [],
})

