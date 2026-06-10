/**
 * Border Overlay Presets
 * Quick preset configurations for border/frame styles
 */

import type { BorderPreset } from '../types/border.types'
import type { BorderPresetName } from '../types/brand.types'

export const BORDER_PRESETS: Record<BorderPresetName, BorderPreset> = {
  /**
   * Neon Preset
   * Bright neon glow with dash animation
   */
  neon: {
    style: 'solid',
    animation: 'dash',
    thickness: 3,
    gradient: 'neon',
    gradienttype: 'linear',
    glow: true,
    glowsize: 12,
    opacity: 0.95,
    speed: 3,
  },

  /**
   * Rainbow Preset
   * Full rainbow cycling with multicolor
   */
  rainbow: {
    style: 'solid',
    animation: 'dash',
    thickness: 3,
    gradient: 'rainbow',
    gradienttype: 'linear',
    glow: true,
    glowsize: 8,
    opacity: 0.9,
    speed: 4,
    multicolor: true,
    colorshift: true,
    shiftspeed: 8,
  },

  /**
   * Subtle Preset
   * Minimal border with soft glow
   */
  subtle: {
    style: 'solid',
    animation: 'none',
    thickness: 1,
    gradient: 'slate',
    gradienttype: 'linear',
    glow: true,
    glowsize: 4,
    opacity: 0.5,
    speed: 6,
  },

  /**
   * Pulse Preset
   * Pulsing glow animation
   */
  pulse: {
    style: 'solid',
    animation: 'glow',
    thickness: 2,
    gradient: 'indigo',
    gradienttype: 'linear',
    glow: true,
    glowsize: 10,
    opacity: 0.85,
    speed: 2,
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
