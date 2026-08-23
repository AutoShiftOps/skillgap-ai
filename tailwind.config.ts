import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf4ec",
          100: "#fbe8d4",
          500: "#c2632a",
          600: "#a3521f",
          700: "#7f3f18"
        },
        ink: {
          900: "#141414"
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
