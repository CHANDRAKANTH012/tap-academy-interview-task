export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fbfafb",
          100: "#f6f6f7",
          300: "#eaeaea",
          500: "#0b1220",
          700: "#0a0f18",
        },
        accent: "#ff6a00",
        muted: {
          100: "#f7f8f9",
          200: "#eef0f2"
        }
      },
      boxShadow: {
        'soft-lg': '0 14px 30px rgba(15, 23, 42, 0.06)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: [],
}
