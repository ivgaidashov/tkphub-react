/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [],
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  theme: {
    colors: {
      "color-primary": "#7380ec",
      "color-danger": "#ff7782",
      "color-success": "#41f1b6",
      "color-warning": "#ffbb55",
      "color-white": "#fff",
      "color-info-dark": "#7d8da1",
      "color-info-light": "#f3fffa",
      "color-dark": "#363949",
      "color-light": "rgba(132, 139, 200, 0.18)",
      "color-primary-variant": "#111e88",
      "color-dark-variant": "#677483",
      "color-background": "#f6f6f9",
      "customPurple": "#9333EA",
      "dusty-white": "#e5eaf5",
      "my-slate": "#CBD5E1",
      "off-white": "#F8F0E3",
      "transparent": "transparent",
      "citrus": "#F7882F",
      "whitish": "#e9eaf5",
      "bg-transparent-black": "rgba(0, 0, 0, 0.2)",
    },
    extend: {
      scale: {
        '102': '1.02',
      }
    }
  },
};
