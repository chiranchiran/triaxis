// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'hover:bg-gray',
    'hover:text-white',
    'bg-black-light', // 激活状态的类名也可加入，确保万无一失
    'text-white',
  ],
  theme: {
    extend: {
      colors: {
        // 使用小清新配色
        primary: '#a5ccf6',
        'accent-green': '#a7f3d0',
        'accent-orange': '#fde68a',

      },
    },
  },
  plugins: [],
}