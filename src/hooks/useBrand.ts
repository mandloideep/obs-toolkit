/**
 * Brand Hooks
 * Convenient hooks for accessing brand configuration
 */

import { useMemo } from 'react'
import { useBrandContext } from '../contexts/BrandContext'
import type {
  BrandConfig,
  ThemeColors,
  GradientName,
  ContrastAccents,
  FontFamily,
} from '../types/brand.types'

/**
 * Get the full brand configuration
 */
export function useBrand(): BrandConfig {
  const { brand } = useBrandContext()
  return brand
}

/**
 * Get the current theme colors based on URL parameter
 * Defaults to dark theme
 *
 * @param themeName - Optional theme name override (from URL param)
 */
export function useTheme(themeName?: 'dark' | 'light'): ThemeColors {
  const { brand } = useBrandContext()

  return useMemo(() => {
    const theme = themeName || 'dark'
    return brand.themes[theme] || brand.themes.dark
  }, [brand, themeName])
}

/**
 * Get gradient colors with support for custom colors and random selection
 *
 * @param gradientName - Named gradient preset
 * @param customColors - Custom color array (hex strings with or without #)
 * @param random - Select a random gradient from presets
 */
export function useGradient(
  gradientName?: GradientName,
  customColors?: string[],
  random?: boolean
): string[] {
  const { brand } = useBrandContext()

  return useMemo(() => {
    // Custom colors take precedence
    if (customColors && customColors.length > 0) {
      return customColors.map((c) => (c.startsWith('#') ? c : `#${c}`))
    }

    // Random gradient selection
    if (random) {
      const keys = Object.keys(brand.gradients) as GradientName[]
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      return brand.gradients[randomKey]
    }

    // Named gradient or default to indigo
    const name = gradientName || 'indigo'
    return brand.gradients[name] || brand.gradients.indigo
  }, [brand, gradientName, customColors, random])
}

/**
 * Get contrast-aware accent colors optimized for light/dark themes
 *
 * @param themeName - Current theme name
 */
export function useAccents(
  themeName?: 'dark' | 'light'
): ContrastAccents {
  return useMemo(() => {
    const theme = themeName || 'dark'

    if (theme === 'light') {
      return {
        primary: '#4f46e5',
        secondary: '#7c3aed',
        tertiary: '#0891b2',
        text: '#121216',
      }
    }

    return {
      primary: '#818cf8',
      secondary: '#a78bfa',
      tertiary: '#22d3ee',
      text: '#f0f0f5',
    }
  }, [themeName])
}

/**
 * Get font family string by name with custom font support
 *
 * @param fontName - Font family name or custom font index
 * @param customFonts - Array of custom font names from URL param
 */
export function useFontFamily(
  fontName?: FontFamily,
  customFonts?: string[]
): string {
  const { brand } = useBrandContext()

  return useMemo(() => {
    const name = fontName || 'display'

    // Handle custom fonts (custom1, custom2, etc.)
    if (name.startsWith('custom')) {
      const index = parseInt(name.replace('custom', '')) - 1

      // Check URL parameter custom fonts first
      if (customFonts && customFonts[index]) {
        return `'${customFonts[index]}', -apple-system, sans-serif`
      }

      // Check brand.js custom fonts
      if (brand.fonts.custom && brand.fonts.custom[index]) {
        return `'${brand.fonts.custom[index]}', -apple-system, sans-serif`
      }

      // Fallback to display font if custom font not found
      return brand.fonts.display
    }

    // Standard fonts
    return brand.fonts[name as 'display' | 'body' | 'mono'] || brand.fonts.display
  }, [brand, fontName, customFonts])
}

/**
 * Load Google Fonts dynamically
 * Returns cleanup function to remove font link
 *
 * @param customFonts - Array of custom Google Font names
 */
export function useLoadCustomFonts(customFonts?: string[]): void {
  const { brand } = useBrandContext()

  useMemo(() => {
    // Load default brand fonts
    if (!document.querySelector('link[data-brand-fonts]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = brand.fontImport
      link.setAttribute('data-brand-fonts', '1')
      document.head.appendChild(link)
    }

    // Load custom fonts if provided
    if (customFonts && customFonts.length > 0) {
      const fontParams = customFonts
        .map((font) => {
          const fontName = font.replace(/\s+/g, '+')
          return `family=${fontName}:wght@300;400;500;600;700;800`
        })
        .join('&')

      const customFontUrl = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`

      if (!document.querySelector(`link[href="${customFontUrl}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = customFontUrl
        link.setAttribute('data-custom-fonts', '1')
        document.head.appendChild(link)
      }
    }
  }, [brand, customFonts])
}
