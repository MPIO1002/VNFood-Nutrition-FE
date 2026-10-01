/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 preset
  presets: [require('nativewind/preset')],

  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        // Montserrat weights mapped to font family names
        'montserrat': ['Montserrat_400Regular'],
        'montserrat-medium': ['Montserrat_500Medium'],
        'montserrat-semibold': ['Montserrat_600SemiBold'],
        'montserrat-bold': ['Montserrat_700Bold'],
      },
      colors: {
        // App Brand Palette (from Stitch AI design tokens)
        charcoal: {
          pure: '#18181B',
          surface: '#27272A',
        },
        surface: {
          DEFAULT: '#FBF8FC', // root background
          container: '#F0EDF1',
        },
        canvas: {
          white: '#FFFFFF',
        },
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
        },
        border: {
          hairline: '#E4E4E7',
          subtle: '#F4F4F5',
        },
        macro: {
          protein: '#475569',
          carbs: '#D97706',
          fat: '#E11D48',
          burned: '#059669', // burned green
        }
      },
    },
  },
  plugins: [],
};
