/**
 * Brand Configuration Types
 * Complete type definitions for the OBS Overlay Toolkit brand system
 */

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

export type GradientName =
  | 'indigo'
  | 'cyan'
  | 'sunset'
  | 'emerald'
  | 'neon'
  | 'frost'
  | 'fire'
  | 'ocean'
  | 'purple'
  | 'mono'
  | 'rainbow'
  | 'lavender'
  | 'crimson'
  | 'mint'
  | 'amber'
  | 'navy'
  | 'coral'
  | 'slate'
  | 'gold'
  | 'teal'
  | 'magenta'

export type GradientMap = Record<GradientName, string[]>

export interface FontConfig {
  display: string
  body: string
  mono: string
  custom: string[]
}

export interface SocialHandles {
  github?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  instagram?: string
  twitch?: string
  kick?: string
  discord?: string
  website?: string
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

export type EntranceAnimation =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'bounce'
  | 'typewriter'
  | 'flipIn'
  | 'zoomBounce'
  | 'rotateIn'
  | 'zoomIn'
  | 'stagger'
  | 'none'

export type ExitAnimation =
  | 'none'
  | 'fade'
  | 'slideDown'
  | 'slideUp'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'fadeLeft'
  | 'zoomOut'
  | 'rotateOut'
  | 'flipOut'

export type IconAnimation =
  | 'bounce'
  | 'shake'
  | 'pulse'
  | 'spin'
  | 'wiggle'
  | 'flip'
  | 'heartbeat'
  | 'none'

export type BorderAnimation = 'dash' | 'rotate' | 'pulse' | 'breathe' | 'none'

export type LineAnimation = 'slide' | 'grow' | 'pulse' | 'none'

// ===== COMPONENT SHAPE/STYLE TYPES =====

export type Shape = 'rect' | 'circle'

export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'neon'

export type LineStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'gradient'
  | 'slant'
  | 'wave'
  | 'swirl'
  | 'bracket'

export type DecorationStyle = 'line' | 'slant' | 'swirl' | 'none'

// ===== LAYOUT TYPES =====

export type HorizontalAlign = 'left' | 'center' | 'right'

export type VerticalAlign = 'top' | 'center' | 'bottom'

export type Layout = 'horizontal' | 'vertical'

export type CounterLayout = 'stack' | 'inline'

export type IconPosition = 'left' | 'right' | 'top' | 'bottom'

export type LinePosition = 'top' | 'bottom' | 'both'

// ===== SIZE TYPES =====

export type SizePreset = 'sm' | 'md' | 'lg' | 'xl'

// ===== ICON TYPES =====

export type CounterIcon =
  | 'heart'
  | 'star'
  | 'users'
  | 'eye'
  | 'zap'
  | 'fire'
  | 'trophy'
  | 'bell'
  | 'none'

export type CTAIcon =
  | 'like'
  | 'sub'
  | 'bell'
  | 'share'
  | 'heart'
  | 'star'
  | 'follow'
  | 'none'
  | string // Allow any Lucide icon name

export type IconColorMode = 'brand' | 'platform' | 'white' | 'gradient'

// ===== FONT TYPES =====

export type FontFamily =
  | 'display'
  | 'body'
  | 'mono'
  | 'custom1'
  | 'custom2'
  | 'custom3'
  | 'custom4'
  | 'custom5'

// ===== NUMBER NOTATION TYPES =====

export type NumberNotation = 'standard' | 'compact' | 'scientific'

// ===== THEME TYPES =====

export type ThemeName = 'dark' | 'light'

// ===== SOCIAL PLATFORM TYPES =====

export type SocialPlatform =
  | 'github'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'instagram'
  | 'twitch'
  | 'kick'
  | 'discord'
  | 'website'

// ===== API SERVICE TYPES =====

export type APIService = 'custom' | 'youtube' | 'twitch' | 'github'

// ===== PRESET TYPES =====

export type TextPresetName =
  | 'brb'
  | 'chatting'
  | 'starting'
  | 'ending'
  | 'technical'
  | 'custom'

export type CTAPresetName =
  | 'subscribe'
  | 'like'
  | 'follow'
  | 'share'
  | 'notify'
  | 'custom'

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
