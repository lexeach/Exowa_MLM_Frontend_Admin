/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        grayCustom: '#586174',
        blueCustom: "#6540b2",
        whiteCustom: "#FFFFFF",
        backgroundCustom: "#F8FAFB",
        textColor: "#6540b2",
        grayColor:'#e5e5e599',
        customBorderColor:'#ffedfd',
        customVoilet:'#6540b2'
      },
    },
  },
  plugins: [],
}