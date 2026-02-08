/**
 * Zod Validation Schemas
 * Type-safe validation schemas for all overlay configurators
 */

import { z } from 'zod'
import type { BorderOverlayParams } from '@/types/border.types'
import type { TextOverlayParams } from '@/types/text.types'
import type { CounterOverlayParams } from '@/types/counter.types'
import type { CTAOverlayParams } from '@/types/cta.types'
import type { SocialsOverlayParams } from '@/types/socials.types'
import {
  hexColorValidator,
  cssValueValidator,
  rangeValidator,
  opacityValidator,
  colorArrayValidator,
  apiKeyValidators,
} from './validators'

// ===== BORDER OVERLAY SCHEMA =====

export const borderOverlaySchema = z.object({
  // Shape & Style
  shape: z.enum(['rect', 'circle']),
  style: z.enum(['solid', 'dashed', 'dotted', 'double', 'neon']),
  animation: z.enum(['none', 'dash', 'rotate', 'pulse', 'breathe']),

  // Geometry
  r: rangeValidator(0, 50, 'px'),
  thickness: rangeValidator(1, 50, 'px'),
  dash: rangeValidator(0, 1),

  // Colors
  gradient: z.string(), // GradientName enum
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
  theme: z.string(), // ThemeName enum
}) satisfies z.ZodType<BorderOverlayParams>

// ===== TEXT OVERLAY SCHEMA =====

export const textOverlaySchema = z.object({
  // Preset
  preset: z.string(), // TextPresetName enum

  // Content
  text: z.string(),
  sub: z.string(),
  size: rangeValidator(12, 200, 'px'),
  subsize: rangeValidator(8, 100, 'px'),
  weight: z.number().min(100).max(900).multipleOf(100),
  font: z.string(), // FontFamily

  // Layout
  align: z.enum(['left', 'center', 'right']),
  valign: z.enum(['top', 'center', 'bottom']),
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
  linestyle: z.enum(['solid', 'dashed', 'dotted', 'gradient']),
  lineanim: z.enum(['none', 'expand', 'slide', 'fade']),
  linepos: z.enum(['top', 'bottom', 'both']),
  linelength: rangeValidator(0, 100, '%'),
  linewidth: rangeValidator(1, 20, 'px'),
  linespeed: rangeValidator(0.1, 5, 's'),

  // Entrance Animation
  entrance: z.enum([
    'fade',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scale',
    'bounce',
    'typewriter',
    'flipIn',
    'zoomBounce',
    'rotateIn',
    'zoomIn',
    'none',
  ]),
  entrancespeed: rangeValidator(0.1, 5, 's'),
  delay: rangeValidator(0, 10, 's'),

  // Exit Animation
  exit: z.enum([
    'fade',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scale',
    'none',
  ]),
  exitafter: rangeValidator(0, 60, 's'),
  exitspeed: rangeValidator(0.1, 5, 's'),

  // Loop Mode
  loop: z.boolean(),
  hold: rangeValidator(0, 60, 's'),
  pause: rangeValidator(0, 60, 's'),

  // Global
  theme: z.string(), // ThemeName
  gradient: z.string(), // GradientName
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
    icon: z.string(), // CounterIcon
    size: rangeValidator(12, 200, 'px'),
    labelsize: rangeValidator(8, 100, 'px'),
    font: z.string(), // FontFamily
    layout: z.enum(['horizontal', 'vertical', 'stacked']),
    align: z.enum(['left', 'center', 'right']),

    // Number Formatting
    separator: z.boolean(),
    decimals: rangeValidator(0, 4),
    notation: z.enum(['standard', 'compact', 'scientific', 'engineering']),
    abbreviate: z.boolean(),

    // Animation
    animate: z.boolean(),
    duration: rangeValidator(0.5, 5, 's'),
    trend: z.boolean(),
    trendcolor: hexColorValidator,

    // API Integration
    service: z.enum(['youtube', 'twitch', 'github', 'custom']),
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
    theme: z.string(), // ThemeName
    gradient: z.string(), // GradientName
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
  preset: z.string(), // CTAPresetName

  // Content
  text: z.string(),
  sub: z.string(),
  size: rangeValidator(12, 200, 'px'),

  // Icon
  icon: z.string(), // CTAIcon
  iconanim: z.enum([
    'none',
    'bounce',
    'pulse',
    'spin',
    'shake',
    'tada',
    'wobble',
    'float',
  ]),
  iconpos: z.enum(['left', 'right', 'top', 'bottom']),
  iconcolor: hexColorValidator,
  iconsize: rangeValidator(16, 200, 'px'),
  customicon: z.string(),

  // Text Styling
  font: z.string(), // FontFamily
  textpadx: rangeValidator(0, 100, 'px'),
  textpady: rangeValidator(0, 100, 'px'),
  letterspacing: rangeValidator(-5, 20, 'px'),
  lineheight: rangeValidator(0.8, 3),

  // Decoration
  decoration: z.enum(['none', 'underline', 'overline', 'line-through', 'arrows']),
  decorationcolor: hexColorValidator,

  // Layout
  align: z.enum(['left', 'center', 'right']),
  valign: z.enum(['top', 'center', 'bottom']),
  bg: z.boolean(),

  // Animation
  entrance: z.enum([
    'fade',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scale',
    'bounce',
    'typewriter',
    'flipIn',
    'zoomBounce',
    'rotateIn',
    'zoomIn',
    'none',
  ]),
  exit: z.enum([
    'fade',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scale',
    'none',
  ]),
  delay: rangeValidator(0, 10, 's'),
  entrancespeed: rangeValidator(0.1, 5, 's'),
  exitspeed: rangeValidator(0.1, 5, 's'),

  // Loop Mode
  loop: z.boolean(),
  hold: rangeValidator(0, 60, 's'),
  pause: rangeValidator(0, 60, 's'),

  // Global Theme
  theme: z.string(), // ThemeName
  gradient: z.string(), // GradientName
  colors: colorArrayValidator(5),
}) satisfies z.ZodType<CTAOverlayParams>

// ===== SOCIALS OVERLAY SCHEMA =====

export const socialsOverlaySchema = z.object({
  // Platforms & Handles
  show: z.string(), // Comma-separated platforms
  handles: z.string(), // Override handles (github:user,youtube:@chan)

  // Layout
  layout: z.enum(['horizontal', 'vertical', 'grid']),
  size: z.enum(['sm', 'md', 'lg', 'xl']),
  showtext: z.boolean(),
  bg: z.boolean(),
  gap: rangeValidator(0, 100, 'px'),
  spacing: rangeValidator(0, 100, 'px'),
  borderradius: rangeValidator(0, 50, 'px'),

  // Icon Styling
  iconcolor: z.enum(['brand', 'mono', 'gradient']),
  iconsize: rangeValidator(16, 200, 'px'),
  iconpadding: rangeValidator(0, 50, 'px'),

  // Text Styling
  font: z.string(), // FontFamily
  fontsize: rangeValidator(8, 100, 'px'),
  fontweight: z.number().min(100).max(900).multipleOf(100),
  letterspacing: rangeValidator(-5, 20, 'px'),

  // Entrance Animation
  entrance: z.enum([
    'fade',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scale',
    'bounce',
    'flipIn',
    'zoomBounce',
    'rotateIn',
    'zoomIn',
    'stagger',
    'none',
  ]),
  speed: rangeValidator(0.1, 5, 's'),
  delay: rangeValidator(0, 10, 's'),

  // Exit Animation
  exit: z.enum([
    'fade',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scale',
    'none',
  ]),
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
  order: z.enum(['default', 'priority']),
  priority: z.string(), // 'youtube:1,twitch:2,github:3'

  // Icon Customization
  icons: z.string(), // 'github:github,youtube:video,twitch:zap'

  // Global Theme
  theme: z.string(), // ThemeName
  gradient: z.string(), // GradientName
  colors: colorArrayValidator(5),
}) satisfies z.ZodType<SocialsOverlayParams>

// ===== SCHEMA EXPORT MAP =====

export const overlaySchemas = {
  border: borderOverlaySchema,
  text: textOverlaySchema,
  counter: counterOverlaySchema,
  cta: ctaOverlaySchema,
  socials: socialsOverlaySchema,
} as const

export type OverlayType = keyof typeof overlaySchemas
