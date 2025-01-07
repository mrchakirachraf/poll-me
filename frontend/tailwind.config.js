/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors : {
        "DeepTale" : "#0A6464",
        "SoftCoral" : "#FA9684",
        "MutedCyan":"#0A8C8C",
        "MutedCyan0.1":"rgb(230, 239, 239)"
      }
    },
  },
  plugins: [],
}

