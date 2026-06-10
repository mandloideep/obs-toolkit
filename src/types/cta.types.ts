/**
 * CTA Overlay Parameter Types
 * Complete type definitions for the call-to-action overlay component
 */

import type {
  CTAPresetName,
  CTAIcon,
  IconAnimation,
  EntranceAnimation,
  ExitAnimation,
  FontFamily,
  HorizontalAlign,
  VerticalAlign,
  ThemeName,
  GradientName,
  GradientType,
  IconPosition,
  DecorationStyle,
  BgShadow,
  ColorMode,
} from './brand.types'
import { BG_PANEL_DEFAULTS } from '../lib/constants'

/**
 * CTA Overlay Parameters
 * All 30+ parameters for the call-to-action overlay
 */
export interface CTAOverlayParams {
  // Preset
  preset: CTAPresetName

  // Content
  text: string
  sub: string
  size: number

  // Icon
  icon: CTAIcon
  iconanim: IconAnimation
  iconpos: IconPosition
  iconcolor: string
  iconsize: number
  customicon: string

  // Text Styling
  font: FontFamily
  textcolor: string
  subcolor: string
  textpadx: number
  textpady: number
  letterspacing: number
  lineheight: number

  // Decoration
  decoration: DecorationStyle
  decorationcolor: string

  // Layout
  align: HorizontalAlign
  valign: VerticalAlign
  bg: boolean

  // Background Panel
  bgcolor: string
  bgopacity: number
  bgshadow: BgShadow
  bgblur: number
  bgradius: number

  // Animation
  entrance: EntranceAnimation
  exit: ExitAnimation
  delay: number
  entrancespeed: number
  exitspeed: number

  // Loop Mode
  loop: boolean
  hold: number
  pause: number

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
 * CTA Preset Configuration
 * Preset values that can be overridden by URL parameters
 */
export interface CTAPreset {
  text?: string
  sub?: string
  size?: number
  icon?: CTAIcon
  iconanim?: IconAnimation
  iconcolor?: string
  font?: FontFamily
  textcolor?: string
  subcolor?: string
  decoration?: DecorationStyle
  decorationcolor?: string
  gradient?: GradientName
  gradienttype?: GradientType
  entrance?: EntranceAnimation
  exit?: ExitAnimation
  bg?: boolean
  bggradient?: boolean
  bggradientname?: string
  colormode?: ColorMode
  theme?: ThemeName
}

/**
 * Default values for CTA overlay parameters
 */
export const CTA_DEFAULTS: CTAOverlayParams = {
  preset: 'subscribe',
  text: 'Subscribe',
  sub: '',
  size: 28,
  icon: 'sub',
  iconanim: 'bounce',
  iconpos: 'left',
  iconcolor: '',
  iconsize: 0,
  customicon: '',
  font: 'display',
  textcolor: '',
  subcolor: '',
  textpadx: 0,
  textpady: 0,
  letterspacing: 0,
  lineheight: 1.2,
  decoration: 'line',
  decorationcolor: '',
  align: 'center',
  valign: 'bottom',
  bg: true,
  ...BG_PANEL_DEFAULTS,
  entrance: 'bounce',
  exit: 'fade',
  delay: 0.5,
  entrancespeed: 0.5,
  exitspeed: 0.4,
  loop: true,
  hold: 6,
  pause: 20,
  theme: 'dark',
  gradient: 'indigo',
  gradienttype: 'linear',
  colors: [],
  colormode: 'normal',
  bggradient: false,
  bggradientname: '',
}
