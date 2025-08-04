/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#00BFFF',
        'electric-blue-dark': '#1E90FF',
        'neon-orange': '#FF6B35',
        'neon-orange-dark': '#FF8C42',
        'neon-lime': '#32CD32',
        'neon-lime-dark': '#ADFF2F',
        'psychedelic-purple': '#8A2BE2',
        'psychedelic-purple-dark': '#9932CC',
        'ink': '#0a0a0a',
        'paper': '#f8f7f2',
      },
      fontFamily: {
        'display': ['Bangers', 'Impact', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '-1': '-1deg',
        '-2': '-2deg',
        '-3': '-3deg',
      },
      dropShadow: {
        'comic': '4px 4px 0px #0a0a0a',
        'comic-sm': '2px 2px 0px #0a0a0a',
      },
      backgroundImage: {
        'halftone': "url('/textures/halftone.png')",
        'swirl': "url('/textures/swirl.png')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}