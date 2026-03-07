module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "1060px",
      // => @media (min-width: 768px) { ... }
      l: "1150px",
      // => @media (min-width: 768px) { ... }
      lg: "1460px",
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
          DEFAULT: "var(--color-bg)",
          gray: "var(--color-bg-gray)",
          profile: "var(--color-bg-profile)",
        },
        primary: {
          // DEFAULT: "#344664",
          DEFAULT: "var(--color-primary)",
          // dark: "#5b0c1f",
          dark: "var(--color-primary-dark)",
          // light: "#9CA3AF",
          light: "var(--color-primary-light)",
          veryLight: "var(--color-primary-veryLight)",
          lightDark: "var(--color-primary-light-dark)",
        },
        secondary: {
          // DEFAULT: "#000000",
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
          veryLight: "var(--color-secondary-veryLight)",
        },
        gray: {
          DEFAULT: "var(--color-gray)",
          verydark: "var(--color-gray-verydark)",
          dark: "var(--color-gray-dark)",
          med: "var(--color-gray-med)",
          light: "var(--color-gray-light)",
          veryLight: "var(--color-gray-veryLight)",
        },
        red: {
          DEFAULT: "var(--color-red)",
          dark: "var(--color-red-dark)",
          light: "var(--color-red-light)",
        },
        green: {
          DEFAULT: "var(--color-green)",
          light: "var(--color-green-light)",
        },
        cyan: {
          DEFAULT: "var(--color-cyan)",
        },
        yellow: {
          DEFAULT: "var(--color-yellow)",
          light: "var(--color-yellow-light)",
          dark: "var(--color-yellow-dark)",
          veryLight: "var(--color-yellow-veryLight)",
        },
        orang: {
          DEFAULT: "var(--color-orang)",
        },
      },
      dropShadow: {
        "home-img": "0px 3px 16px #E9E9E980",
        "3xl": "0px 1px 4px #E9E9E9B3",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
