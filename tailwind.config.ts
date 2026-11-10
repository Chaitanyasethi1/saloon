import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.06)",
        ring: "#E6C887",
        background: "#0A0A0B",
        foreground: "#F5F5F7",
        surface: {
          50: "#1A1A20",
          100: "#17171B",
          200: "#141418",
          300: "#111114",
          400: "#0D0D10",
          DEFAULT: "#111114",
        },
        gold: {
          50: "#FCF8ED",
          100: "#F7ECCF",
          200: "#EFD89F",
          300: "#E6C887",
          400: "#D4AC55",
          500: "#B8893B",
          600: "#996C27",
          700: "#7A521D",
          DEFAULT: "#E6C887",
        },
        rose: {
          glow: "#D98B73",
          deep: "#8E4638",
        },
        card: {
          DEFAULT: "#111114",
          subtle: "#17171B",
          foreground: "#F5F5F7",
        },
        muted: {
          DEFAULT: "#1E1E24",
          foreground: "#9E9EA8",
        },
        accent: {
          DEFAULT: "#E6C887",
          foreground: "#0A0A0B",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'Space Grotesk'", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E6C887 0%, #D4AC55 50%, #B8893B 100%)",
        "gold-gradient-subtle": "linear-gradient(135deg, rgba(230, 200, 135, 0.15) 0%, rgba(184, 137, 59, 0.05) 100%)",
        "dark-radial": "radial-gradient(circle at 50% 0%, rgba(230, 200, 135, 0.08) 0%, transparent 70%)",
        "copper-gradient": "linear-gradient(135deg, #D98B73 0%, #B8893B 100%)",
        "card-glass": "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(230, 200, 135, 0.25)",
        "gold-glow-lg": "0 0 45px -5px rgba(230, 200, 135, 0.4)",
        "rose-glow": "0 0 25px -5px rgba(217, 139, 115, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
