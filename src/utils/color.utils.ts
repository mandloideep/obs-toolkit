/**
 * Color Utility Functions
 * RGBA hex conversion, HSL manipulation, and color mode shifting
 */

import { hexToRgb, rgbToHex } from './css.utils'

// === RGBA HEX CONVERSION ===

/**
 * Parse 6 or 8 character hex string to RGBA
 * @param hex - Hex string without # (e.g., 'FF0000' or 'FF000080')
 */
export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const clean = hex.replace('#', '')
  const rgb = hexToRgb(clean.slice(0, 6))
  if (!rgb) return { r: 0, g: 0, b: 0, a: 1 }

  const a = clean.length === 8
    ? parseInt(clean.slice(6, 8), 16) / 255
    : 1

  return { ...rgb, a }
}

/**
 * Convert RGBA values to hex string (without #)
 * Returns 6-char when alpha >= 1, else 8-char
 */
export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const hex = rgbToHex(r, g, b).replace('#', '').toUpperCase()
  if (a >= 1) return hex

  const alphaHex = Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

  return hex + alphaHex
}

/**
 * Convert hex (6 or 8 char, with or without #) to CSS color string
 * Returns rgba() for 8-char hex, #RRGGBB for 6-char
 */
export function hexToCssColor(hex: string): string {
  if (!hex) return ''
  const clean = hex.replace('#', '')

  if (clean.length === 8) {
    const { r, g, b, a } = hexToRgba(clean)
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
  }

  return `#${clean}`
}

/**
 * Extract alpha value from hex string (0-1)
 * Returns 1 for 6-char hex
 */
export function hexAlpha(hex: string): number {
  const clean = hex.replace('#', '')
  if (clean.length !== 8) return 1
  return parseInt(clean.slice(6, 8), 16) / 255
}

// === HSL CONVERSION ===

/**
 * Convert RGB to HSL
 * @returns {h: 0-360, s: 0-100, l: 0-100}
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 }
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    case b: h = ((r - g) / d + 4) / 6; break
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Convert HSL to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
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
 * Convert hex color to HSL
 * @param hex - Hex string (with or without #, 6 or 8 char)
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex.replace('#', '').slice(0, 6))
  if (!rgb) return { h: 0, s: 0, l: 0 }
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

/**
 * Convert HSL to hex string (without #)
 */
export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l)
  return rgbToHex(r, g, b).replace('#', '').toUpperCase()
}

// === COLOR MODE SHIFTING ===

/**
 * Shift lightness of a hex color by HSL amount
 * @param hexColor - Hex color (with or without #)
 * @param shift - Lightness shift (-100 to +100)
 */
export function shiftColorLightness(hexColor: string, shift: number): string {
  if (shift === 0) return hexColor
  const clean = hexColor.replace('#', '')
  const hsl = hexToHsl(clean)

  const newL = Math.max(0, Math.min(100, hsl.l + shift))
  const result = hslToHex(hsl.h, hsl.s, newL)

  // Preserve alpha if present
  if (clean.length === 8) {
    return result + clean.slice(6, 8)
  }
  return result
}

/**
 * Apply color mode shift to an array of CSS hex colors
 * @param colors - Array of hex color strings (with #)
 * @param mode - Color mode name
 */
export function applyColorModeShift(
  colors: string[],
  mode: string
): string[] {
  const shifts: Record<string, number> = {
    darker: -30,
    dark: -15,
    normal: 0,
    light: 15,
    lighter: 30,
  }

  const shift = shifts[mode] ?? 0
  if (shift === 0) return colors

  return colors.map((color) => {
    const clean = color.startsWith('#') ? color.slice(1) : color
    const shifted = shiftColorLightness(clean, shift)
    return color.startsWith('#') ? `#${shifted}` : shifted
  })
}
