/**
 * brand-helpers.js — Shared utilities + embedded fallback defaults
 * 
 * Every overlay includes: <script src="brand.js"></script>
 *                         <script src="brand-helpers.js"></script>
 * 
 * If brand.js fails to load, BRAND_DEFAULTS kicks in automatically.
 */

// Fallback defaults (mirrors brand.js structure)
const BRAND_DEFAULTS = {
  name: "Streamer",
  accent: { primary: "#6366f1", secondary: "#8b5cf6", tertiary: "#06b6d4" },
  themes: {
    dark: { bg:"#121216", bgAlt:"#1c1c24", surface:"#26262e", border:"#3a3a44", text:"#f0f0f5", textMuted:"#9898a8", textDim:"#5a5a6a" },
    light: { bg:"#f8f8fc", bgAlt:"#eeeef4", surface:"#ffffff", border:"#d0d0da", text:"#121216", textMuted:"#5a5a6a", textDim:"#9898a8" },
  },
  gradients: {
    indigo:["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#818cf8"],
    cyan:["#06b6d4","#22d3ee","#67e8f9","#a5f3fc","#0891b2"],
    sunset:["#f43f5e","#f59e0b","#fbbf24","#f97316","#ef4444"],
    emerald:["#10b981","#34d399","#6ee7b7","#a7f3d0","#059669"],
    neon:["#6366f1","#06b6d4","#10b981","#f59e0b","#f43f5e"],
    frost:["#818cf8","#93c5fd","#a5b4fc","#c7d2fe","#e0e7ff"],
    fire:["#ef4444","#f97316","#f59e0b","#fbbf24","#fde68a"],
    ocean:["#0ea5e9","#06b6d4","#14b8a6","#2dd4bf","#5eead4"],
    purple:["#7c3aed","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe"],
    mono:["#6b7280","#9ca3af","#d1d5db","#9ca3af","#6b7280"],
    rainbow:["#ef4444","#f59e0b","#10b981","#06b6d4","#6366f1","#8b5cf6"],
  },
  fonts: {
    display: "'Inter', -apple-system, sans-serif",
    body: "'Inter', -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontImport: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
  socials: {},
};

// Merge: use BRAND if loaded, else defaults
const B = (typeof BRAND !== 'undefined') ? BRAND : BRAND_DEFAULTS;

// Ensure all keys exist via deep merge
function deepMerge(target, fallback) {
  for (const key of Object.keys(fallback)) {
    if (!(key in target)) {
      target[key] = fallback[key];
    } else if (typeof fallback[key] === 'object' && !Array.isArray(fallback[key]) && fallback[key] !== null) {
      deepMerge(target[key], fallback[key]);
    }
  }
  return target;
}
deepMerge(B, BRAND_DEFAULTS);

// ===== HELPER FUNCTIONS =====

const _params = new URLSearchParams(window.location.search);

const $ = {
  /** Get string param */
  str(name, fallback) {
    const v = _params.get(name);
    return v !== null ? v : fallback;
  },
  /** Get number param */
  num(name, fallback) {
    const v = parseFloat(_params.get(name));
    return isNaN(v) ? fallback : v;
  },
  /** Get boolean param */
  bool(name, fallback) {
    const v = _params.get(name);
    if (v === null) return fallback;
    return v !== 'false' && v !== '0';
  },
  /** Get theme object */
  theme() {
    const name = $.str('theme', 'dark');
    return B.themes[name] || B.themes.dark;
  },
  /** Get gradient array */
  gradient() {
    const custom = _params.get('colors');
    if (custom) return custom.split(',').map(c => c.startsWith('#') ? c : '#' + c);
    const name = $.str('gradient', 'indigo');
    if ($.bool('random', false)) {
      const keys = Object.keys(B.gradients);
      return B.gradients[keys[Math.floor(Math.random() * keys.length)]];
    }
    return B.gradients[name] || B.gradients.indigo;
  },
  /** Contrast-aware accent colors */
  accents() {
    const t = $.str('theme', 'dark');
    if (t === 'light') return { primary:"#4f46e5", secondary:"#7c3aed", tertiary:"#0891b2", text:"#121216" };
    return { primary:"#818cf8", secondary:"#a78bfa", tertiary:"#22d3ee", text:"#f0f0f5" };
  },
  /** Inject Google Fonts */
  fonts() {
    if (!document.querySelector('link[data-bf]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = B.fontImport; l.setAttribute('data-bf','1');
      document.head.appendChild(l);
    }
  },
  /** Set CSS variable */
  css(name, val) { document.documentElement.style.setProperty(name, val); },
  /** Set multiple CSS vars from object */
  cssAll(obj) { Object.entries(obj).forEach(([k,v]) => $.css('--'+k, v)); },
};

// Auto-inject fonts
$.fonts();
