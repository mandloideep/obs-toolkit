/**
 * OBS Streaming Toolkit — Brand Configuration v2
 * 
 * Edit this file to set your global brand. All overlays import this.
 * If this file fails to load, overlays use embedded defaults.
 */

const BRAND = {
  name: "Deep Mandloi",

  accent: {
    primary:   "#6366f1",
    secondary: "#8b5cf6",
    tertiary:  "#06b6d4",
    warm:      "#f59e0b",
    success:   "#10b981",
    rose:      "#f43f5e",
  },

  themes: {
    dark: {
      bg: "#121216", bgAlt: "#1c1c24", surface: "#26262e",
      border: "#3a3a44", text: "#f0f0f5", textMuted: "#9898a8", textDim: "#5a5a6a",
    },
    light: {
      bg: "#f8f8fc", bgAlt: "#eeeef4", surface: "#ffffff",
      border: "#d0d0da", text: "#121216", textMuted: "#5a5a6a", textDim: "#9898a8",
    },
  },

  gradients: {
    indigo:  ["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#818cf8"],
    cyan:    ["#06b6d4","#22d3ee","#67e8f9","#a5f3fc","#0891b2"],
    sunset:  ["#f43f5e","#f59e0b","#fbbf24","#f97316","#ef4444"],
    emerald: ["#10b981","#34d399","#6ee7b7","#a7f3d0","#059669"],
    neon:    ["#6366f1","#06b6d4","#10b981","#f59e0b","#f43f5e"],
    frost:   ["#818cf8","#93c5fd","#a5b4fc","#c7d2fe","#e0e7ff"],
    fire:    ["#ef4444","#f97316","#f59e0b","#fbbf24","#fde68a"],
    ocean:   ["#0ea5e9","#06b6d4","#14b8a6","#2dd4bf","#5eead4"],
    purple:  ["#7c3aed","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe"],
    mono:    ["#6b7280","#9ca3af","#d1d5db","#9ca3af","#6b7280"],
    rainbow: ["#ef4444","#f59e0b","#10b981","#06b6d4","#6366f1","#8b5cf6"],
  },

  fonts: {
    display: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    body:    "'Inter', 'SF Pro Text', -apple-system, sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  },

  fontImport: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",

  socials: {
    github:    "deepmandloi",
    twitter:   "",
    linkedin:  "deepmandloi",
    youtube:   "",
    instagram: "",
    twitch:    "",
    kick:      "",
    discord:   "",
    website:   "",
  },
};

// Don't override if already loaded via fallback
if (!window._BRAND_READY) window._BRAND_READY = true;
