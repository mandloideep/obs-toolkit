/**
 * Socials Overlay Parameter Types
 * Complete type definitions for the social media links overlay component
 */

import type {
  SocialPlatform,
  SocialsPresetName,
  SizePreset,
  IconColorMode,
  Layout,
  EntranceAnimation,
  ExitAnimation,
  ThemeName,
  GradientName,
  GradientType,
  FontFamily,
  PlatformOrder,
  BgShadow,
  ColorMode,
} from './brand.types'
import { BG_PANEL_DEFAULTS } from '../lib/constants'

/**
 * Socials Overlay Parameters
 * All 35+ parameters for the social media overlay
 */
export interface SocialsOverlayParams {
  // Preset
  preset: SocialsPresetName

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
  font: FontFamily
  fontsize: number
  fontweight: number
  letterspacing: number
  handlecolor: string

  // Entrance Animation
  entrance: EntranceAnimation
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
  order: PlatformOrder
  priority: string // 'youtube:1,twitch:2,github:3'

  // Icon Customization
  icons: string // 'github:github,youtube:video,twitch:zap'

  // Background Panel
  bgcolor: string
  bgopacity: number
  bgshadow: BgShadow
  bgblur: number
  bgradius: number

  // Global Theme
  theme: ThemeName
  gradient: GradientName
  gradienttype: GradientType
  colors: string[]
  colormode: ColorMode
  bggradient: boolean
  bggradientname: string
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
/**
 * Socials Preset Configuration
 * Preset values that can be overridden by URL parameters
 */
export interface SocialsPreset {
  layout?: Layout
  size?: SizePreset
  showtext?: boolean
  bg?: boolean
  iconcolor?: IconColorMode
  font?: FontFamily
  handlecolor?: string
  entrance?: EntranceAnimation
  gradient?: GradientName
  gradienttype?: GradientType
  bggradient?: boolean
  bggradientname?: string
  colormode?: ColorMode
  theme?: ThemeName
}

export const SOCIALS_DEFAULTS: SocialsOverlayParams = {
  preset: 'custom',
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
  font: 'body',
  fontsize: 0,
  fontweight: 500,
  letterspacing: 0,
  handlecolor: '',
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
  ...BG_PANEL_DEFAULTS,
  theme: 'dark',
  gradient: 'indigo',
  gradienttype: 'linear',
  colors: [],
  colormode: 'normal',
  bggradient: false,
  bggradientname: '',
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
