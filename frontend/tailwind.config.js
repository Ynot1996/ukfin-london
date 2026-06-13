/** Sentinel design tokens — derived from the reference dashboard. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core surface palette
        bg: "#f5f7fa",
        card: "#ffffff",
        ink: "#1a2332",
        muted: "#5b6b82",
        line: "#d6dce8",
        // Brand / header slate-blue + cyan accent
        brand: "#3d5a7a",
        "brand-dark": "#2c4763",
        accent: "#4fc3dc",
        "accent-dark": "#1fa8c4",
        // Severity scale
        critical: "#dc2b4b",
        high: "#f0762b",
        medium: "#e0a92e",
        low: "#3fa66a",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
