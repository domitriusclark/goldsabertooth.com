/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        secondary: "var(--secondary-color)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "var(--primary-color)",
            a: {
              color: "var(--primary-color)",
              "&:hover": {
                color: "var(--primary-color)",
                opacity: 0.7,
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
