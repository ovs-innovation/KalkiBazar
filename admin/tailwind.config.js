const defaultTheme = require("tailwindcss/defaultTheme");

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        serif: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        store: {
          50: "var(--store-color-50)",
          100: "var(--store-color-100)",
          200: "var(--store-color-200)",
          300: "var(--store-color-300)",
          400: "var(--store-color-400)",
          500: "var(--store-color-500)",
          600: "var(--store-color-600)",
          700: "var(--store-color-700)",
          800: "var(--store-color-800)",
          900: "var(--store-color-900)",
        },
        gray: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#3f3f46",
          700: "#18181b",
          800: "#09090b",
          900: "#020204",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#334155",
          700: "#18181b",
          800: "#09090b",
          900: "#020204",
        },
        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#3f3f46",
          700: "#18181b",
          800: "#09090b",
          900: "#020204",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#404040",
          700: "#18181b",
          800: "#09090b",
          900: "#020204",
          950: "#020204",
        },
      },
      // Modern shadow system
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Colored shadows for modern UI
        'store': '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
        'store-lg': '0 10px 30px 0 rgba(139, 92, 246, 0.3)',
        // Preserve existing custom shadow
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      // Modern border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      height: {
        28: "100px",
        sm: "350px",
        md: "400px",
        330: "330px",
        440: "440px",
        lg: "500px",
        xl: "600px",
      },
      width: {
        80: "80px",
        100: "100px",
        200: "200px",
        300: "300px",
        400: "400px",
      },
      padding: {
        2.5: "10px",
      },
      screens: {
        "2xl": "1440px",
        xl: "1280px",
        lg: "1024px",
        ipad: { min: "960px", max: "1023px" },
        md: "768px",
        sm: "640px",
        xs: "420px",
        xss: "320px",
      },
      inset: {
        "-1": "-1rem",
        "-2": "-2rem",
        "-3": "-3rem",
        "-4": "-4rem",
        "-5": "-5rem",
        "-6": "-6rem",
        "-7": "-7rem",
        "-8": "-8rem",
        "-9": "-9rem",
        "-10": "-10rem",
        1: "1rem",
        2: "2rem",
        3: "3rem",
        4: "4rem",
        5: "5rem",
        6: "6rem",
        7: "7rem",
        8: "8rem",
        9: "9rem",
        10: "10rem",
      },
      // Modern animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Modern backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  variants: {
    display: ["group-hover"],
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    //require('tailwind-scrollbar')
  ],
};

module.exports = {
  ...config,
};
