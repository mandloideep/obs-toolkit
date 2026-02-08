/**
 * Border Overlay Parameter Types
 * Complete type definitions for the border overlay component
 */

import type {
  Shape,
  BorderStyle,
  BorderAnimation,
  GradientName,
  ThemeName,
} from './brand.types'

/**
 * Border Overlay Parameters
 * All 27 parameters for the border overlay
 */
export interface BorderOverlayParams {
  // Shape & Style
  shape: Shape
  style: BorderStyle
  animation: BorderAnimation

  // Geometry
  r: number // Corner radius (for rect only)
  thickness: number // Border width in pixels
  dash: number // Dash visible portion ratio (0-1)

  // Colors
  gradient: GradientName
  colors: string[] // Custom gradient colors (hex without #)
  random: boolean // Randomize gradient on load

  // Appearance
  glow: boolean // Enable glow effect
  glowsize: number // Glow blur radius in pixels
  opacity: number // Overall opacity (0-1)

  // Animation
  speed: number // Animation cycle duration in seconds

  // Advanced Color Features
  multicolor: boolean // Cycle through all gradients
  colorshift: boolean // Smooth color transitions
  shiftspeed: number // Color cycle duration in seconds

  // Global
  theme: ThemeName
}

/**
 * Default values for border overlay parameters
 */
export const BORDER_DEFAULTS: BorderOverlayParams = {
  shape: 'rect',
  style: 'solid',
  animation: 'dash',
  r: 16,
  thickness: 2,
  dash: 0.3,
  gradient: 'indigo',
  colors: [],
  random: false,
  glow: true,
  glowsize: 8,
  opacity: 0.85,
  speed: 4,
  multicolor: false,
  colorshift: false,
  shiftspeed: 10,
  theme: 'dark',
}
