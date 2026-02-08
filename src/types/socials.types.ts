/**
 * Socials Overlay Parameter Types
 * Complete type definitions for the social media links overlay component
 */

import type {
  SocialPlatform,
  SizePreset,
  IconColorMode,
  Layout,
  EntranceAnimation,
  ExitAnimation,
  ThemeName,
  GradientName,
} from './brand.types'

/**
 * Socials Overlay Parameters
 * All 35+ parameters for the social media overlay
 */
export interface SocialsOverlayParams {
  // Platforms & Handles
  show: string // Comma-separated platforms
  handles: string // Override handles (github:user,youtube:@chan)

  // Layout
  layout: Layout
  size: SizePreset
  showtext: boolean
  bg: boolean
  gap: number
  spacing: number
  borderradius: number

  // Icon Styling
  iconcolor: IconColorMode
  iconsize: number
  iconpadding: number

  // Text Styling
  fontsize: number
  fontweight: number
  letterspacing: number

  // Entrance Animation
  entrance: EntranceAnimation | 'stagger'
  speed: number
  delay: number

  // Exit Animation
  exit: ExitAnimation
  exitafter: number
  exitspeed: number

  // Loop Mode (all appear → hold → all disappear → pause → repeat)
  loop: boolean
  hold: number
  pause: number

  // One-by-One Mode (show each social one at a time)
  onebyone: boolean
  each: number
  eachpause: number

  // Platform Ordering
  order: 'default' | 'priority'
  priority: string // 'youtube:1,twitch:2,github:3'

  // Icon Customization
  icons: string // 'github:github,youtube:video,twitch:zap'

  // Global Theme
  theme: ThemeName
  gradient: GradientName
  colors: string[]
}

/**
 * Platform Configuration
 * Icon, color, and handle prefix for each social platform
 */
export interface PlatformConfig {
  name: string
  icon: string // SVG string
  color: string // Brand color
  prefix: string // Handle prefix (e.g., '@' for Twitter)
}

/**
 * Default values for socials overlay parameters
 */
export const SOCIALS_DEFAULTS: SocialsOverlayParams = {
  show: '',
  handles: '',
  layout: 'horizontal',
  size: 'md',
  showtext: true,
  bg: true,
  gap: 16,
  spacing: 0,
  borderradius: 8,
  iconcolor: 'brand',
  iconsize: 0,
  iconpadding: 0,
  fontsize: 0,
  fontweight: 500,
  letterspacing: 0,
  entrance: 'stagger',
  speed: 0.5,
  delay: 0.3,
  exit: 'none',
  exitafter: 0,
  exitspeed: 0.5,
  loop: false,
  hold: 5,
  pause: 3,
  onebyone: false,
  each: 3,
  eachpause: 0.5,
  order: 'default',
  priority: '',
  icons: '',
  theme: 'dark',
  gradient: 'indigo',
  colors: [],
}

/**
 * Size preset mappings
 */
export const SIZE_MAP: Record<SizePreset, { icon: number; handle: number }> = {
  sm: { icon: 20, handle: 13 },
  md: { icon: 24, handle: 15 },
  lg: { icon: 32, handle: 18 },
  xl: { icon: 40, handle: 22 },
}
