module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "821px",
      // => @media (min-width: 768px) { ... }

      lg: "1366px",
      // => @media (min-width: 1025px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serifAR: ["Cairo"],
      serifEN: ["Roboto"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ["Almarai"],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#FEFEFE",
          gray: "#ACACAC1A",
        },
        primary: {
          DEFAULT: "#821A4D",
          dark: "#62143A",
          // light: "#67C6B980",
        },
        secondary: {
          DEFAULT: "#00134F",
        },
        gray: {
          DEFAULT: "#6F6F6F",
          dark: "#707070",
          med: "#ACACAC",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
