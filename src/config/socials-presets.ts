/**
 * Socials Overlay Presets
 * Quick preset configurations for social media display styles
 */

import type { SocialsPreset } from '../types/socials.types'
import type { SocialsPresetName } from '../types/brand.types'

export const SOCIALS_PRESETS: Record<SocialsPresetName, SocialsPreset> = {
  /**
   * Minimal Preset
   * Clean, text-forward with subtle styling
   */
  minimal: {
    layout: 'horizontal',
    size: 'md',
    showtext: true,
    bg: false,
    iconcolor: 'white',
    font: 'body',
    entrance: 'fade',
    gradient: 'slate',
  },

  /**
   * Colorful Preset
   * Brand-colored icons with gradient bg panel
   */
  colorful: {
    layout: 'horizontal',
    size: 'lg',
    showtext: true,
    bg: true,
    iconcolor: 'brand',
    font: 'display',
    entrance: 'stagger',
    gradient: 'rainbow',
    bggradient: true,
    bggradientname: 'palette:vibrant',
    colormode: 'darker',
  },

  /**
   * Branded Preset
   * Gradient-colored icons with bg panel
   */
  branded: {
    layout: 'horizontal',
    size: 'md',
    showtext: true,
    bg: true,
    iconcolor: 'gradient',
    font: 'display',
    entrance: 'stagger',
    gradient: 'indigo',
    bggradient: true,
    bggradientname: 'indigo',
    colormode: 'darker',
  },

  /**
   * Neon Preset
   * Neon-colored icons on dark background
   */
  neon: {
    layout: 'vertical',
    size: 'lg',
    showtext: true,
    bg: true,
    iconcolor: 'gradient',
    font: 'mono',
    entrance: 'stagger',
    gradient: 'neon',
    bggradient: true,
    bggradientname: 'palette:neon',
    colormode: 'darker',
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
