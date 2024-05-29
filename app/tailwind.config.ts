import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  theme: {
    extend: {
      dropShadow: {
        hover: "6px 6px 2px #00000066",
        hoversm: "3px 3px 1px #00000088",
      },
    },
  },
  daisyui: {
    themes: ["autumn"],
  },
};
export default config;
