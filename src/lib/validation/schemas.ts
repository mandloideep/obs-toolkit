/**
 * Zod Validation Schemas
 * Type-safe validation schemas for all overlay configurators.
 * All enum values are derived from the centralized constants file.
 */

import { z } from 'zod'
import type { BorderOverlayParams } from '@/types/border.types'
import type { TextOverlayParams } from '@/types/text.types'
import type { CounterOverlayParams } from '@/types/counter.types'
import type { CTAOverlayParams } from '@/types/cta.types'
import type { SocialsOverlayParams } from '@/types/socials.types'
import type { MeshOverlayParams } from '@/types/mesh.types'
import {
  hexColorValidator,
  cssValueValidator,
  rangeValidator,
  opacityValidator,
  colorArrayValidator,
  apiKeyValidators,
} from './validators'
import {
  SHAPES,
  BORDER_STYLES,
  BORDER_ANIMATIONS,
  LINE_STYLES,
  LINE_ANIMATIONS,
  LINE_POSITIONS,
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  ICON_ANIMATIONS,
  ICON_POSITIONS,
  HORIZONTAL_ALIGNS,
  VERTICAL_ALIGNS,
  LAYOUTS,
  COUNTER_LAYOUTS,
  COUNTER_ICONS,
  SIZE_PRESETS,
  ICON_COLOR_MODES,
  DECORATION_STYLES,
  NUMBER_NOTATIONS,
  API_SERVICES,
  GRADIENT_NAMES,
  THEMES,
  TEXT_PRESETS,
  CTA_PRESETS,
  PLATFORM_ORDERS,
  MESH_ANIMATIONS,
  MESH_PALETTES,
  MESH_BLEND_MODES,
} from '../constants'

// ===== BORDER OVERLAY SCHEMA =====

export const borderOverlaySchema = z.object({
  // Shape & Style
  shape: z.enum(SHAPES),
  style: z.enum(BORDER_STYLES),
  animation: z.enum(BORDER_ANIMATIONS),

  // Geometry
  r: rangeValidator(0, 50, 'px'),
  thickness: rangeValidator(1, 50, 'px'),
  dash: rangeValidator(0, 1),

  // Colors
  gradient: z.enum(GRADIENT_NAMES),
  colors: colorArrayValidator(5),
  random: z.boolean(),

  // Appearance
  glow: z.boolean(),
  glowsize: rangeValidator(0, 20, 'px'),
  opacity: opacityValidator,

  // Animation
  speed: rangeValidator(0.1, 10, 's'),

  // Advanced Color Features
  multicolor: z.boolean(),
  colorshift: z.boolean(),
  shiftspeed: rangeValidator(1, 30, 's'),

  // Global
  theme: z.enum(THEMES),
}) satisfies z.ZodType<BorderOverlayParams>

// ===== TEXT OVERLAY SCHEMA =====

export const textOverlaySchema = z.object({
  // Preset
  preset: z.enum(TEXT_PRESETS),

  // Content
  text: z.string(),
  sub: z.string(),
  size: rangeValidator(12, 200, 'px'),
  subsize: rangeValidator(8, 100, 'px'),
  weight: z.number().min(100).max(900).multipleOf(100),
  font: z.string(), // FontFamily (includes Google Fonts)

  // Layout
  align: z.enum(HORIZONTAL_ALIGNS),
  valign: z.enum(VERTICAL_ALIGNS),
  maxwidth: cssValueValidator,
  pad: rangeValidator(0, 100, 'px'),
  padx: rangeValidator(0, 100, 'px'),
  pady: rangeValidator(0, 100, 'px'),
  marginx: rangeValidator(0, 100, 'px'),
  marginy: rangeValidator(0, 100, 'px'),
  offsetx: rangeValidator(-500, 500, 'px'),
  offsety: rangeValidator(-500, 500, 'px'),
  bg: z.boolean(),

  // Text Colors
  textcolor: hexColorValidator,
  subcolor: hexColorValidator,
  textgradient: z.boolean(),

  // Line Decoration
  line: z.boolean(),
  linestyle: z.enum(LINE_STYLES),
  lineanim: z.enum(LINE_ANIMATIONS),
  linepos: z.enum(LINE_POSITIONS),
  linelength: rangeValidator(0, 100, '%'),
  linewidth: rangeValidator(1, 20, 'px'),
  linespeed: rangeValidator(0.1, 5, 's'),

  // Entrance Animation
  entrance: z.enum(ENTRANCE_ANIMATIONS),
  entrancespeed: rangeValidator(0.1, 5, 's'),
  delay: rangeValidator(0, 10, 's'),

  // Exit Animation
  exit: z.enum(EXIT_ANIMATIONS),
  exitafter: rangeValidator(0, 60, 's'),
  exitspeed: rangeValidator(0.1, 5, 's'),

  // Loop Mode
  loop: z.boolean(),
  hold: rangeValidator(0, 60, 's'),
  pause: rangeValidator(0, 60, 's'),

  // Global
  theme: z.enum(THEMES),
  gradient: z.enum(GRADIENT_NAMES),
  colors: colorArrayValidator(5),
}).refine(
  (data) => {
    // Exit speed only relevant if exit animation is not 'none'
    return data.exit === 'none' || data.exitspeed > 0
  },
  {
    message: 'Exit speed required when exit animation is enabled',
    path: ['exitspeed'],
  }
) satisfies z.ZodType<TextOverlayParams>

// ===== COUNTER OVERLAY SCHEMA =====

export const counterOverlaySchema = z
  .object({
    // Display
    value: z.number(),
    label: z.string(),
    prefix: z.string(),
    suffix: z.string(),
    icon: z.enum(COUNTER_ICONS),
    size: rangeValidator(12, 200, 'px'),
    labelsize: rangeValidator(8, 100, 'px'),
    font: z.string(), // FontFamily (includes Google Fonts)
    layout: z.enum(COUNTER_LAYOUTS),
    align: z.enum(HORIZONTAL_ALIGNS),

    // Number Formatting
    separator: z.boolean(),
    decimals: rangeValidator(0, 4),
    notation: z.enum(NUMBER_NOTATIONS),
    abbreviate: z.boolean(),

    // Animation
    animate: z.boolean(),
    duration: rangeValidator(0.5, 5, 's'),
    trend: z.boolean(),
    trendcolor: hexColorValidator,

    // API Integration
    service: z.enum(API_SERVICES),
    apikey: z.string(),
    userid: z.string(),
    metric: z.string(),
    poll: z.string(),
    pollkey: z.string(),
    pollrate: rangeValidator(5, 300, 's'),

    // Layout
    counterpadx: rangeValidator(0, 100, 'px'),
    counterpady: rangeValidator(0, 100, 'px'),
    width: cssValueValidator,
    height: cssValueValidator,
    iconcolor: hexColorValidator,
    numbercolor: hexColorValidator,

    // Style
    bg: z.boolean(),
    theme: z.enum(THEMES),
    gradient: z.enum(GRADIENT_NAMES),
    colors: colorArrayValidator(5),
  })
  .refine(
    (data) => {
      // Service-specific API key validation
      if (data.service === 'youtube' && data.apikey) {
        return apiKeyValidators.youtube.safeParse(data.apikey).success || data.apikey === ''
      }
      if (data.service === 'github' && data.apikey) {
        return apiKeyValidators.github.safeParse(data.apikey).success || data.apikey === ''
      }
      if (data.service === 'twitch' && data.apikey) {
        return apiKeyValidators.twitch.safeParse(data.apikey).success || data.apikey === ''
      }
      return true
    },
    {
      message: 'Invalid API key format for selected service',
      path: ['apikey'],
    }
  )
  .refine(
    (data) => {
      // Poll rate validation based on service
      if (data.service === 'youtube') {
        return data.pollrate >= 60 // YouTube requires 60s minimum
      }
      return true
    },
    {
      message: 'YouTube API requires minimum 60 second poll rate',
      path: ['pollrate'],
    }
  ) satisfies z.ZodType<CounterOverlayParams>

// ===== CTA OVERLAY SCHEMA =====

export const ctaOverlaySchema = z.object({
  // Preset
  preset: z.enum(CTA_PRESETS),

  // Content
  text: z.string(),
  sub: z.string(),
  size: rangeValidator(12, 200, 'px'),

  // Icon
  icon: z.string(), // CTAIcon (includes | string for custom Lucide icons)
  iconanim: z.enum(ICON_ANIMATIONS),
  iconpos: z.enum(ICON_POSITIONS),
  iconcolor: hexColorValidator,
  iconsize: z.number().min(0).max(200),
  customicon: z.string(),

  // Text Styling
  font: z.string(), // FontFamily (includes Google Fonts)
  textpadx: rangeValidator(0, 100, 'px'),
  textpady: rangeValidator(0, 100, 'px'),
  letterspacing: rangeValidator(-5, 20, 'px'),
  lineheight: rangeValidator(0.8, 3),

  // Decoration
  decoration: z.enum(DECORATION_STYLES),
  decorationcolor: hexColorValidator,

  // Layout
  align: z.enum(HORIZONTAL_ALIGNS),
  valign: z.enum(VERTICAL_ALIGNS),
  bg: z.boolean(),

  // Animation
  entrance: z.enum(ENTRANCE_ANIMATIONS),
  exit: z.enum(EXIT_ANIMATIONS),
  delay: rangeValidator(0, 10, 's'),
  entrancespeed: rangeValidator(0.1, 5, 's'),
  exitspeed: rangeValidator(0.1, 5, 's'),

  // Loop Mode
  loop: z.boolean(),
  hold: rangeValidator(0, 60, 's'),
  pause: rangeValidator(0, 60, 's'),

  // Global Theme
  theme: z.enum(THEMES),
  gradient: z.enum(GRADIENT_NAMES),
  colors: colorArrayValidator(5),
}) satisfies z.ZodType<CTAOverlayParams>

// ===== SOCIALS OVERLAY SCHEMA =====

export const socialsOverlaySchema = z.object({
  // Platforms & Handles
  show: z.string(), // Comma-separated platforms
  handles: z.string(), // Override handles (github:user,youtube:@chan)

  // Layout
  layout: z.enum(LAYOUTS),
  size: z.enum(SIZE_PRESETS),
  showtext: z.boolean(),
  bg: z.boolean(),
  gap: rangeValidator(0, 100, 'px'),
  spacing: rangeValidator(0, 100, 'px'),
  borderradius: rangeValidator(0, 50, 'px'),

  // Icon Styling
  iconcolor: z.enum(ICON_COLOR_MODES),
  iconsize: z.number().min(0).max(200),
  iconpadding: rangeValidator(0, 50, 'px'),

  // Text Styling
  font: z.string(), // FontFamily (includes Google Fonts)
  fontsize: z.number().min(0).max(100),
  fontweight: z.number().min(100).max(900).multipleOf(100),
  letterspacing: rangeValidator(-5, 20, 'px'),

  // Entrance Animation
  entrance: z.enum(ENTRANCE_ANIMATIONS),
  speed: rangeValidator(0.1, 5, 's'),
  delay: rangeValidator(0, 10, 's'),

  // Exit Animation
  exit: z.enum(EXIT_ANIMATIONS),
  exitafter: rangeValidator(0, 60, 's'),
  exitspeed: rangeValidator(0.1, 5, 's'),

  // Loop Mode
  loop: z.boolean(),
  hold: rangeValidator(0, 60, 's'),
  pause: rangeValidator(0, 60, 's'),

  // One-by-One Mode
  onebyone: z.boolean(),
  each: rangeValidator(1, 60, 's'),
  eachpause: rangeValidator(0, 60, 's'),

  // Platform Ordering
  order: z.enum(PLATFORM_ORDERS),
  priority: z.string(), // 'youtube:1,twitch:2,github:3'

  // Icon Customization
  icons: z.string(), // 'github:github,youtube:video,twitch:zap'

  // Global Theme
  theme: z.enum(THEMES),
  gradient: z.enum(GRADIENT_NAMES),
  colors: colorArrayValidator(5),
}) satisfies z.ZodType<SocialsOverlayParams>

// ===== MESH OVERLAY SCHEMA =====

export const meshOverlaySchema = z.object({
  seed: rangeValidator(1, 999999),
  points: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  palette: z.enum(MESH_PALETTES),
  animation: z.enum(MESH_ANIMATIONS),
  speed: rangeValidator(0.1, 3),
  blur: rangeValidator(20, 200, 'px'),
  scale: rangeValidator(0.5, 2),
  opacity: opacityValidator,
  blend: z.enum(MESH_BLEND_MODES),
  bg: hexColorValidator,
}) satisfies z.ZodType<MeshOverlayParams>

// ===== SCHEMA EXPORT MAP =====

export const overlaySchemas = {
  border: borderOverlaySchema,
  text: textOverlaySchema,
  counter: counterOverlaySchema,
  cta: ctaOverlaySchema,
  socials: socialsOverlaySchema,
  mesh: meshOverlaySchema,
} as const

export type OverlayType = keyof typeof overlaySchemas
