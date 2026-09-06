/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          700: '#047857',
        },
        peach: {
          50: '#FFF7ED',
          200: '#FED7AA',
          600: '#EA580C',
        }
      },
      fontFamily: {
        outfit: ['Outfit_400Regular', 'Outfit_700Bold'],
        jakarta: ['PlusJakartaSans_400Regular', 'PlusJakartaSans_500Medium', 'PlusJakartaSans_600SemiBold', 'PlusJakartaSans_700Bold'],
      }
    },
  },
  plugins: [],
}

