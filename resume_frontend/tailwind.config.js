/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui:{
    themes: [
      "light",
    //   "dark",
      // "cupcake",
    //   "bumblebee",
    //   "emerald",
    //   "corporate",
    //   "synthwave",
      // "retro",
      // "cyberpunk",
      // "valentine",
      // "halloween",
    //   "garden",
      // "forest",
      // "aqua",
    //   "lofi",
    //   "pastel",
    //   "fantasy",
    //   "wireframe",
      // "black",
      // "luxury",
    //   "dracula",
    //   "cmyk",
    //   "autumn",
    //   "business",
    //   "acid",
    //   "lemonade",
    //   "night",
    //   "coffee",
      // "winter",
    //   "dim",
    //   "nord",
      // "sunset",
    ],
  }
}
    // daisyui: {
    //   themes: [{
    //     mytheme: {
    //       // "primary": "#6366f1",
    //       // "secondary": "#22d3ee",
    //       // "accent": "#f472b6",
    //       // "neutral": "#1f2937",
    //       // "base-100": "#ffffff",
    //     },
    //   }],
    // }
  // daisyui: {
  //     logs: false, 
  //     themes: false // ✅ Sirf custom theme enable rakhne ke liye
  //   },
    // }
  

