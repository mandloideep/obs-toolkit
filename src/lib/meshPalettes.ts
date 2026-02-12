/**
 * Mesh Background Color Palettes
 * Each palette defines HSL ranges for generating harmonious colors.
 * Returns RGB values for direct canvas pixel manipulation.
 */

import { seededFloat } from './seededRandom'

export interface PaletteRange {
  hue: [number, number]
  saturation: [number, number]
  lightness: [number, number]
  hueSpread?: number
}

export interface RGBColor {
  r: number
  g: number
  b: number
}

export const MESH_PALETTE_DEFINITIONS: Record<string, PaletteRange> = {
  pastel: {
    hue: [0, 360],
    saturation: [40, 65],
    lightness: [75, 90],
    hueSpread: 120,
  },
  vibrant: {
    hue: [0, 360],
    saturation: [80, 100],
    lightness: [45, 65],
    hueSpread: 90,
  },
  earth: {
    hue: [15, 55],
    saturation: [30, 60],
    lightness: [30, 55],
  },
  ocean: {
    hue: [180, 240],
    saturation: [50, 85],
    lightness: [35, 65],
  },
  neon: {
    hue: [0, 360],
    saturation: [90, 100],
    lightness: [50, 70],
    hueSpread: 60,
  },
  warm: {
    hue: [0, 60],
    saturation: [60, 90],
    lightness: [45, 70],
  },
  cool: {
    hue: [180, 300],
    saturation: [50, 80],
    lightness: [40, 65],
  },
  monochrome: {
    hue: [0, 0],
    saturation: [0, 5],
    lightness: [20, 85],
  },
  sunset: {
    hue: [330, 60],
    saturation: [70, 95],
    lightness: [45, 65],
  },
  forest: {
    hue: [80, 160],
    saturation: [35, 70],
    lightness: [25, 50],
  },
  candy: {
    hue: [280, 360],
    saturation: [60, 90],
    lightness: [60, 80],
    hueSpread: 40,
  },
  aurora: {
    hue: [100, 280],
    saturation: [50, 85],
    lightness: [40, 65],
    hueSpread: 80,
  },
}

/**
 * Convert HSL (h: 0-360, s: 0-100, l: 0-100) to RGB (0-255)
 */
function hslToRgb(h: number, s: number, l: number): RGBColor {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  }
}

/**
 * Generate N colors from a palette using seeded RNG.
 * Colors are evenly distributed across the hue range with small jitter,
 * ensuring each control point is a distinctly different color.
 * Returns RGB color objects for canvas pixel manipulation.
 */
export function generatePaletteColors(
  palette: PaletteRange,
  count: number,
  rng: () => number
): RGBColor[] {
  const colors: RGBColor[] = []

  // Calculate the total hue range
  let totalRange: number
  let startHue: number
  if (palette.hue[0] <= palette.hue[1]) {
    totalRange = palette.hue[1] - palette.hue[0]
    startHue = palette.hue[0]
  } else {
    // Wrapping hue range (e.g., sunset: 330 -> 60 wraps through 0)
    totalRange = 360 - palette.hue[0] + palette.hue[1]
    startHue = palette.hue[0]
  }

  // Use hueSpread to limit total range if specified
  const effectiveRange = palette.hueSpread
    ? Math.min(palette.hueSpread, totalRange)
    : totalRange

  // Pick a random starting point within the available range
  const rangeStart = startHue + rng() * Math.max(0, totalRange - effectiveRange)

  for (let i = 0; i < count; i++) {
    // Evenly space hues across the effective range, with small random jitter
    const evenSpacing = (effectiveRange / count) * (i + 0.5)
    const jitter = (rng() - 0.5) * (effectiveRange / count) * 0.4
    const h = ((rangeStart + evenSpacing + jitter) % 360 + 360) % 360

    const s = seededFloat(rng, palette.saturation[0], palette.saturation[1])
    const l = seededFloat(rng, palette.lightness[0], palette.lightness[1])

    colors.push(hslToRgb(h, s, l))
  }

  return colors
}
