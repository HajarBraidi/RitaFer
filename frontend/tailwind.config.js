// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // ← adapte selon ton projet
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // ← AJOUT ICI
  ],
};
