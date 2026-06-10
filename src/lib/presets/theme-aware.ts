/**
 * Theme-Aware Preset Utility
 * Adapts preset colors based on the current theme selection.
 * Ensures text/element colors have proper contrast against the bg.
 */

/**
 * Calculate relative luminance of a hex color (with or without #)
 * Uses the sRGB formula from WCAG 2.0
 */
function getLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Check if a color is "light" (luminance > 0.5)
 */
function isLightColor(hex: string): boolean {
  if (!hex || hex.length < 6) return false
  return getLuminance(hex) > 0.5
}

/**
 * Invert a hex color's lightness while preserving hue.
 * Light colors become dark, dark colors become light.
 */
function invertLightness(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)

  // Invert: map 0-255 to 255-0
  const ir = 255 - r
  const ig = 255 - g
  const ib = 255 - b

  // Blend toward the inverse (70%) to keep some color identity
  const blend = 0.7
  const fr = Math.round(r + (ir - r) * blend)
  const fg = Math.round(g + (ig - g) * blend)
  const fb = Math.round(b + (ib - b) * blend)

  return `#${fr.toString(16).padStart(2, '0')}${fg.toString(16).padStart(2, '0')}${fb.toString(16).padStart(2, '0')}`
}

/**
 * Color keys that should be adapted for theme contrast.
 * These are text/element colors that need to be readable.
 */
const CONTRAST_COLOR_KEYS = [
  'textcolor',
  'subcolor',
  'linecolor',
  'labelcolor',
  'handlecolor',
  'iconcolor',
  'numbercolor',
  'decorationcolor',
] as const

/**
 * Adapt a preset's colors for the given theme.
 *
 * Strategy:
 * - Dark theme → text colors should be light (luminance > 0.3)
 * - Light theme → text colors should be dark (luminance < 0.7)
 * - Colors that already have good contrast are left unchanged
 * - Empty string colors are left unchanged (they use theme defaults)
 *
 * @param preset - The preset object (Partial of overlay params)
 * @param theme - The target theme ('dark' or 'light')
 * @returns A new preset object with adapted colors
 */
export function getThemedPreset<T extends Record<string, unknown>>(
  preset: Partial<T>,
  theme: 'dark' | 'light'
): Partial<T> {
  const adapted = { ...preset }

  for (const key of CONTRAST_COLOR_KEYS) {
    const value = (adapted as Record<string, unknown>)[key]
    if (typeof value !== 'string' || !value || value.length < 6) continue

    const luminance = getLuminance(value)

    if (theme === 'light') {
      // Light theme: text should be dark (luminance < 0.6)
      if (luminance > 0.6) {
        ;(adapted as Record<string, string>)[key] = invertLightness(value)
      }
    } else {
      // Dark theme: text should be light (luminance > 0.3)
      if (luminance < 0.3) {
        ;(adapted as Record<string, string>)[key] = invertLightness(value)
      }
    }
  }

  return adapted
}

/**
 * Check if a preset has explicit color overrides that might need theme adaptation.
 */
export function presetHasColorOverrides<T extends Record<string, unknown>>(
  preset: Partial<T>
): boolean {
  return CONTRAST_COLOR_KEYS.some((key) => {
    const value = (preset as Record<string, unknown>)[key]
    return typeof value === 'string' && value.length >= 6
  })
}

export { isLightColor, getLuminance }
