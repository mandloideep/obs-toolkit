/**
 * Text Overlay Parameter Types
 * Complete type definitions for the text overlay component
 */

import type {
  EntranceAnimation,
  ExitAnimation,
  LineStyle,
  LineAnimation,
  LinePosition,
  HorizontalAlign,
  VerticalAlign,
  FontFamily,
  GradientName,
  ThemeName,
  TextPresetName,
} from './brand.types'

/**
 * Text Overlay Parameters
 * All 52+ parameters for the text overlay
 */
export interface TextOverlayParams {
  // Preset
  preset: TextPresetName

  // Content
  text: string
  sub: string
  size: number
  subsize: number
  weight: number
  font: FontFamily

  // Layout
  align: HorizontalAlign
  valign: VerticalAlign
  maxwidth: string
  pad: number
  padx: number
  pady: number
  marginx: number
  marginy: number
  offsetx: number
  offsety: number
  bg: boolean

  // Text Colors
  textcolor: string
  subcolor: string
  textgradient: boolean

  // Line Decoration
  line: boolean
  linestyle: LineStyle
  lineanim: LineAnimation
  linepos: LinePosition
  linelength: number
  linewidth: number
  linespeed: number

  // Entrance Animation
  entrance: EntranceAnimation
  entrancespeed: number
  delay: number

  // Exit Animation
  exit: ExitAnimation
  exitafter: number
  exitspeed: number

  // Loop Mode
  loop: boolean
  hold: number
  pause: number

  // Global
  theme: ThemeName
  gradient: GradientName
  colors: string[]
}

/**
 * Text Preset Configuration
 * Defines default values for preset modes
 */
export interface TextPreset {
  text?: string
  sub?: string
  size?: number
  subsize?: number
  weight?: number
  font?: FontFamily
  align?: HorizontalAlign
  valign?: VerticalAlign
  entrance?: EntranceAnimation
  entrancespeed?: number
  exit?: ExitAnimation
  line?: boolean
  linestyle?: LineStyle
  lineanim?: LineAnimation
  gradient?: GradientName
  textcolor?: string
  bg?: boolean
}

/**
 * Default values for text overlay parameters
 */
export const TEXT_DEFAULTS: TextOverlayParams = {
  preset: 'custom',
  text: '',
  sub: '',
  size: 32,
  subsize: 18,
  weight: 600,
  font: 'display',
  align: 'left',
  valign: 'bottom',
  maxwidth: 'auto',
  pad: 28,
  padx: 0,
  pady: 0,
  marginx: 0,
  marginy: 0,
  offsetx: 0,
  offsety: 0,
  bg: false,
  textcolor: '',
  subcolor: '',
  textgradient: false,
  line: true,
  linestyle: 'gradient',
  lineanim: 'slide',
  linepos: 'bottom',
  linelength: 100,
  linewidth: 2,
  linespeed: 2,
  entrance: 'fade',
  entrancespeed: 0.8,
  delay: 0.3,
  exit: 'none',
  exitafter: 0,
  exitspeed: 0.6,
  loop: false,
  hold: 4,
  pause: 2,
  theme: 'dark',
  gradient: 'indigo',
  colors: [],
}
