import type { Config } from "tailwindcss";

const config: Config = {
  content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./utils/**/*.{js,ts,jsx,tsx,mdx}", // Add this just in case
],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;