/**
 * Brand Configuration Types
 * Complete type definitions for the OBS Overlay Toolkit brand system
 * All union types are derived from the centralized constants file.
 */

import {
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  ICON_ANIMATIONS,
  BORDER_ANIMATIONS,
  LINE_ANIMATIONS,
  SHAPES,
  BORDER_STYLES,
  LINE_STYLES,
  DECORATION_STYLES,
  HORIZONTAL_ALIGNS,
  VERTICAL_ALIGNS,
  LAYOUTS,
  COUNTER_LAYOUTS,
  ICON_POSITIONS,
  LINE_POSITIONS,
  SIZE_PRESETS,
  COUNTER_ICONS,
  CTA_ICONS,
  ICON_COLOR_MODES,
  NUMBER_NOTATIONS,
  API_SERVICES,
  THEMES,
  GRADIENT_NAMES,
  SOCIAL_PLATFORMS,
  TEXT_PRESETS,
  CTA_PRESETS,
  PLATFORM_ORDERS,
  STANDARD_FONT_NAMES,
  LOOP_STATES,
  MESH_ANIMATIONS,
  MESH_PALETTES,
  MESH_BLEND_MODES,
} from '../lib/constants'

// ===== CORE BRAND TYPES =====

export interface AccentColors {
  primary: string
  secondary: string
  tertiary: string
  warm: string
  success: string
  rose: string
}

export interface ThemeColors {
  bg: string
  bgAlt: string
  surface: string
  border: string
  text: string
  textMuted: string
  textDim: string
}

export interface ThemeConfig {
  dark: ThemeColors
  light: ThemeColors
}

export type GradientName = typeof GRADIENT_NAMES[number]

export type GradientMap = Record<GradientName, string[]>

export interface FontConfig {
  display: string
  body: string
  mono: string
  custom: string[]
}

export interface BrandConfig {
  name: string
  accent: AccentColors
  themes: ThemeConfig
  gradients: GradientMap
  fonts: FontConfig
  fontImport: string
  socials: SocialHandles
}

// ===== ANIMATION TYPES =====

export type EntranceAnimation = typeof ENTRANCE_ANIMATIONS[number]

export type ExitAnimation = typeof EXIT_ANIMATIONS[number]

export type IconAnimation = typeof ICON_ANIMATIONS[number]

export type BorderAnimation = typeof BORDER_ANIMATIONS[number]

export type LineAnimation = typeof LINE_ANIMATIONS[number]

export type LoopState = typeof LOOP_STATES[number]

// ===== COMPONENT SHAPE/STYLE TYPES =====

export type Shape = typeof SHAPES[number]

export type BorderStyle = typeof BORDER_STYLES[number]

export type LineStyle = typeof LINE_STYLES[number]

export type DecorationStyle = typeof DECORATION_STYLES[number]

// ===== LAYOUT TYPES =====

export type HorizontalAlign = typeof HORIZONTAL_ALIGNS[number]

export type VerticalAlign = typeof VERTICAL_ALIGNS[number]

export type Layout = typeof LAYOUTS[number]

export type CounterLayout = typeof COUNTER_LAYOUTS[number]

export type IconPosition = typeof ICON_POSITIONS[number]

export type LinePosition = typeof LINE_POSITIONS[number]

// ===== SIZE TYPES =====

export type SizePreset = typeof SIZE_PRESETS[number]

// ===== ICON TYPES =====

export type CounterIcon = typeof COUNTER_ICONS[number]

export type CTAIcon =
  | typeof CTA_ICONS[number]
  | string // Allow any Lucide icon name

export type IconColorMode = typeof ICON_COLOR_MODES[number]

// ===== FONT TYPES =====

export type StandardFontName = typeof STANDARD_FONT_NAMES[number]

export type FontFamily =
  | StandardFontName
  | 'custom1'
  | 'custom2'
  | 'custom3'
  | 'custom4'
  | 'custom5'
  | string // Allow any Google Font family name

// ===== NUMBER NOTATION TYPES =====

export type NumberNotation = typeof NUMBER_NOTATIONS[number]

// ===== THEME TYPES =====

export type ThemeName = typeof THEMES[number]

// ===== SOCIAL PLATFORM TYPES =====

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]

export type SocialHandles = Partial<Record<SocialPlatform, string>>

// ===== API SERVICE TYPES =====

export type APIService = typeof API_SERVICES[number]

// ===== PRESET TYPES =====

export type TextPresetName = typeof TEXT_PRESETS[number]

export type CTAPresetName = typeof CTA_PRESETS[number]

export type PlatformOrder = typeof PLATFORM_ORDERS[number]

// ===== MESH BACKGROUND TYPES =====

export type MeshAnimation = typeof MESH_ANIMATIONS[number]

export type MeshPalette = typeof MESH_PALETTES[number]

export type MeshBlendMode = typeof MESH_BLEND_MODES[number]

// ===== UTILITY TYPES =====

/**
 * Contrast-aware accent colors for light/dark themes
 */
export interface ContrastAccents {
  primary: string
  secondary: string
  tertiary: string
  text: string
}

/**
 * Generic parameter parsing result
 */
export type ParamValue = string | number | boolean | string[]

/**
 * URL parameter parser options
 */
export interface ParserOptions {
  coerceTypes?: boolean
  trimStrings?: boolean
  decodeURIComponents?: boolean
}
