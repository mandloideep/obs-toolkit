/**
 * CSS Utility Functions
 * Helpers for CSS manipulation, color interpolation, and dynamic styling
 */

/**
 * Set a CSS custom property on the document root
 *
 * @param name - CSS variable name (with or without --)
 * @param value - CSS variable value
 */
export function setCSSVar(name: string, value: string): void {
  const varName = name.startsWith('--') ? name : `--${name}`
  document.documentElement.style.setProperty(varName, value)
}

/**
 * Set multiple CSS custom properties at once
 *
 * @param vars - Object mapping CSS variable names to values
 *
 * @example
 * ```ts
 * setCSSVars({
 *   'primary-color': '#6366f1',
 *   'text-color': '#f0f0f5'
 * })
 * ```
 */
export function setCSSVars(vars: Record<string, string>): void {
  Object.entries(vars).forEach(([name, value]) => {
    setCSSVar(name, value)
  })
}

/**
 * Get a CSS custom property value from the document root
 *
 * @param name - CSS variable name (with or without --)
 * @returns The CSS variable value or empty string if not found
 */
export function getCSSVar(name: string): string {
  const varName = name.startsWith('--') ? name : `--${name}`
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

/**
 * Convert hex color to RGB values
 *
 * @param hex - Hex color string (with or without #)
 * @returns RGB object { r, g, b } or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '')

  // Support both 3-digit and 6-digit hex
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB values to hex color
 *
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns Hex color string with #
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Linear interpolation between two colors
 *
 * @param color1 - Start color (hex string)
 * @param color2 - End color (hex string)
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated color (hex string)
 *
 * @example
 * ```ts
 * interpolateColor('#ff0000', '#0000ff', 0.5)
 * // Returns '#7f007f' (middle between red and blue)
 * ```
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    console.warn('Invalid color format for interpolation')
    return color1
  }

  // Clamp factor between 0 and 1
  const t = Math.max(0, Math.min(1, factor))

  const r = rgb1.r + (rgb2.r - rgb1.r) * t
  const g = rgb1.g + (rgb2.g - rgb1.g) * t
  const b = rgb1.b + (rgb2.b - rgb1.b) * t

  return rgbToHex(r, g, b)
}

/**
 * Interpolate between multiple colors in a gradient
 *
 * @param colors - Array of hex color strings
 * @param factor - Position in gradient (0-1)
 * @returns Interpolated color (hex string)
 *
 * @example
 * ```ts
 * interpolateGradient(['#ff0000', '#00ff00', '#0000ff'], 0.5)
 * // Returns color at 50% through the gradient
 * ```
 */
export function interpolateGradient(colors: string[], factor: number): string {
  if (colors.length === 0) return '#000000'
  if (colors.length === 1) return colors[0]

  // Clamp factor
  const t = Math.max(0, Math.min(1, factor))

  // Find which two colors to interpolate between
  const segmentSize = 1 / (colors.length - 1)
  const segmentIndex = Math.min(Math.floor(t / segmentSize), colors.length - 2)

  const localFactor = (t - segmentIndex * segmentSize) / segmentSize

  return interpolateColor(colors[segmentIndex], colors[segmentIndex + 1], localFactor)
}

/**
 * Lighten a hex color by a percentage
 *
 * @param color - Hex color string
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened color (hex string)
 */
export function lighten(color: string, percent: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const amount = (255 * percent) / 100

  return rgbToHex(rgb.r + amount, rgb.g + amount, rgb.b + amount)
}

/**
 * Darken a hex color by a percentage
 *
 * @param color - Hex color string
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened color (hex string)
 */
export function darken(color: string, percent: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const amount = (255 * percent) / 100

  return rgbToHex(rgb.r - amount, rgb.g - amount, rgb.b - amount)
}

/**
 * Convert color to RGBA string with opacity
 *
 * @param color - Hex color string
 * @param opacity - Opacity (0-1)
 * @returns RGBA string
 */
export function withOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const alpha = Math.max(0, Math.min(1, opacity))
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

/**
 * Get contrast ratio between two colors (WCAG)
 *
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      const sRGB = val / 255
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if a color is light or dark
 *
 * @param color - Hex color string
 * @returns true if light, false if dark
 */
export function isLightColor(color: string): boolean {
  const rgb = hexToRgb(color)
  if (!rgb) return false

  // Calculate perceived brightness (YIQ formula)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 155
}

/**
 * Generate CSS linear gradient string
 *
 * @param colors - Array of color stops
 * @param angle - Gradient angle in degrees (default: 90)
 * @returns CSS linear-gradient string
 */
export function createLinearGradient(colors: string[], angle: number = 90): string {
  const stops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 100
      return `${color} ${position}%`
    })
    .join(', ')

  return `linear-gradient(${angle}deg, ${stops})`
}

/**
 * Generate CSS radial gradient from center
 *
 * @param colors - Array of color stops
 * @returns CSS radial-gradient string
 */
export function createRadialGradient(colors: string[]): string {
  const stops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 100
      return `${color} ${position}%`
    })
    .join(', ')
  return `radial-gradient(circle, ${stops})`
}

/**
 * Generate CSS conic gradient
 *
 * @param colors - Array of color stops
 * @param angle - Starting angle in degrees (default: 0)
 * @returns CSS conic-gradient string
 */
export function createConicGradient(colors: string[], angle: number = 0): string {
  const stops = colors
    .map((color, index) => {
      const position = (index / (colors.length - 1)) * 100
      return `${color} ${position}%`
    })
    .join(', ')
  return `conic-gradient(from ${angle}deg, ${stops})`
}

/**
 * Generate CSS mesh-style gradient using stacked radial-gradients.
 * Each color is positioned at a different location with soft falloff.
 * Pure CSS, GPU-rendered, zero CPU overhead.
 *
 * @param colors - Array of color stops
 * @returns CSS background string with stacked radial-gradients
 */
export function createMeshGradient(colors: string[]): string {
  // Predefined positions for up to 8 color blobs
  const positions = [
    '25% 25%',
    '75% 25%',
    '50% 50%',
    '25% 75%',
    '75% 75%',
    '10% 50%',
    '90% 50%',
    '50% 10%',
  ]

  const layers = colors.map((color, i) => {
    const pos = positions[i % positions.length]
    const rgb = hexToRgb(color)
    if (!rgb) return `radial-gradient(ellipse at ${pos}, ${color} 0%, transparent 70%)`
    return `radial-gradient(ellipse at ${pos}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 0%, transparent 60%)`
  })

  return layers.join(', ')
}

/**
 * Generate CSS gradient string based on type
 *
 * @param colors - Array of color stops
 * @param type - Gradient type ('linear' | 'radial' | 'conic' | 'mesh')
 * @param angle - Gradient angle in degrees (default: 90, used for linear/conic)
 * @returns CSS gradient string
 */
export function createGradient(colors: string[], type: string, angle: number = 90): string {
  switch (type) {
    case 'radial':
      return createRadialGradient(colors)
    case 'conic':
      return createConicGradient(colors, angle)
    case 'mesh':
      return createMeshGradient(colors)
    default:
      return createLinearGradient(colors, angle)
  }
}

/**
 * Apply theme colors to CSS variables
 *
 * @param theme - Theme colors object
 */
export function applyTheme(theme: Record<string, string>): void {
  Object.entries(theme).forEach(([key, value]) => {
    setCSSVar(key, value)
  })
}
