/**
 * Centralized Constants
 * Single source of truth for all enum-like values across the OBS Toolkit.
 * Types (brand.types.ts), schemas (schemas.ts), and UI option arrays all derive from these.
 */

import { Square, Type, Hash, Megaphone, Users, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// === HELPER TYPE ===
type Option<T extends string> = { readonly value: T; readonly label: string }

// === OVERLAY NAVIGATION ===

export interface OverlayMeta {
  name: string
  description: string
  icon: LucideIcon
  configurePath: string
  color: string
  features: string[]
}

export const OVERLAYS: OverlayMeta[] = [
  {
    name: 'Border',
    description: 'Animated borders with shapes, styles, and effects',
    icon: Square,
    configurePath: '/configure/border',
    color: '#6366f1',
    features: ['27 Parameters', '5 Animations', 'Color Shift', 'Glow Effects'],
  },
  {
    name: 'Text',
    description: 'Name plates, lower thirds, and stream screens',
    icon: Type,
    configurePath: '/configure/text',
    color: '#8b5cf6',
    features: ['52 Parameters', '25 Animations', '8 Line Styles', 'Custom Fonts'],
  },
  {
    name: 'Counter',
    description: 'Live counters with API polling and animations',
    icon: Hash,
    configurePath: '/configure/counter',
    color: '#ec4899',
    features: ['35 Parameters', 'API Integration', 'Trend Arrows', '3 Notations'],
  },
  {
    name: 'CTA',
    description: 'Call-to-action overlays with animated icons',
    icon: Megaphone,
    configurePath: '/configure/cta',
    color: '#f59e0b',
    features: ['30 Parameters', '7 Icon Anims', '4 Positions', 'Decorations'],
  },
  {
    name: 'Socials',
    description: 'Social media links with flexible display modes',
    icon: Users,
    configurePath: '/configure/socials',
    color: '#10b981',
    features: ['35 Parameters', '9 Platforms', 'One-by-One', 'Brand Colors'],
  },
  {
    name: 'Mesh',
    description: 'Animated mesh gradient backgrounds with color palettes',
    icon: Layers,
    configurePath: '/configure/mesh',
    color: '#a855f7',
    features: ['11 Parameters', '5 Animations', '18 Palettes', 'Light/Dark Mode'],
  },
]

// === ANIMATION CONSTANTS ===

export const ENTRANCE_ANIMATIONS = [
  'fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight',
  'scale', 'bounce', 'typewriter', 'flipIn', 'zoomBounce',
  'rotateIn', 'zoomIn', 'stagger', 'none',
] as const

export const ENTRANCE_ANIMATION_OPTIONS: Option<typeof ENTRANCE_ANIMATIONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slideUp', label: 'Slide Up' },
  { value: 'slideDown', label: 'Slide Down' },
  { value: 'slideLeft', label: 'Slide Left' },
  { value: 'slideRight', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'typewriter', label: 'Typewriter' },
  { value: 'flipIn', label: 'Flip In' },
  { value: 'zoomBounce', label: 'Zoom Bounce' },
  { value: 'rotateIn', label: 'Rotate In' },
  { value: 'zoomIn', label: 'Zoom In' },
  { value: 'stagger', label: 'Stagger' },
]

export const EXIT_ANIMATIONS = [
  'none', 'fade', 'slideDown', 'slideUp', 'slideLeft', 'slideRight',
  'scale', 'fadeLeft', 'zoomOut', 'rotateOut', 'flipOut',
] as const

export const EXIT_ANIMATION_OPTIONS: Option<typeof EXIT_ANIMATIONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slideDown', label: 'Slide Down' },
  { value: 'slideUp', label: 'Slide Up' },
  { value: 'slideLeft', label: 'Slide Left' },
  { value: 'slideRight', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
  { value: 'fadeLeft', label: 'Fade Left' },
  { value: 'zoomOut', label: 'Zoom Out' },
  { value: 'rotateOut', label: 'Rotate Out' },
  { value: 'flipOut', label: 'Flip Out' },
]

export const ICON_ANIMATIONS = [
  'bounce', 'shake', 'pulse', 'spin', 'wiggle', 'flip', 'heartbeat', 'none',
] as const

export const ICON_ANIMATION_OPTIONS: Option<typeof ICON_ANIMATIONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'shake', label: 'Shake' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'spin', label: 'Spin' },
  { value: 'wiggle', label: 'Wiggle' },
  { value: 'flip', label: 'Flip' },
  { value: 'heartbeat', label: 'Heartbeat' },
]

export const BORDER_ANIMATIONS = ['dash', 'rotate', 'pulse', 'breathe', 'none'] as const

export const BORDER_ANIMATION_OPTIONS: Option<typeof BORDER_ANIMATIONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'dash', label: 'Dash' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'breathe', label: 'Breathe' },
]

export const LINE_ANIMATIONS = ['slide', 'grow', 'pulse', 'none'] as const

export const LINE_ANIMATION_OPTIONS: Option<typeof LINE_ANIMATIONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'slide', label: 'Slide' },
  { value: 'grow', label: 'Grow' },
  { value: 'pulse', label: 'Pulse' },
]

// === LOOP STATE CONSTANTS (internal animation state machine) ===

export const LOOP_STATES = ['entering', 'visible', 'exiting', 'hidden'] as const

// === SHAPE & STYLE CONSTANTS ===

export const SHAPES = ['rect', 'circle'] as const

export const SHAPE_OPTIONS: Option<typeof SHAPES[number]>[] = [
  { value: 'rect', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
]

export const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'neon'] as const

export const BORDER_STYLE_OPTIONS: Option<typeof BORDER_STYLES[number]>[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'neon', label: 'Neon' },
]

export const LINE_STYLES = [
  'solid', 'dashed', 'dotted', 'gradient', 'slant', 'wave', 'swirl', 'bracket',
] as const

export const LINE_STYLE_OPTIONS: Option<typeof LINE_STYLES[number]>[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'slant', label: 'Slant' },
  { value: 'wave', label: 'Wave' },
  { value: 'swirl', label: 'Swirl' },
  { value: 'bracket', label: 'Bracket' },
]

export const DECORATION_STYLES = ['line', 'slant', 'swirl', 'none'] as const

export const DECORATION_STYLE_OPTIONS: Option<typeof DECORATION_STYLES[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'line', label: 'Line' },
  { value: 'slant', label: 'Slant' },
  { value: 'swirl', label: 'Swirl' },
]

// === LAYOUT CONSTANTS ===

export const HORIZONTAL_ALIGNS = ['left', 'center', 'right'] as const

export const HORIZONTAL_ALIGN_OPTIONS: Option<typeof HORIZONTAL_ALIGNS[number]>[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

export const VERTICAL_ALIGNS = ['top', 'center', 'bottom'] as const

export const VERTICAL_ALIGN_OPTIONS: Option<typeof VERTICAL_ALIGNS[number]>[] = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
]

export const LAYOUTS = ['horizontal', 'vertical'] as const

export const LAYOUT_OPTIONS: Option<typeof LAYOUTS[number]>[] = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
]

export const COUNTER_LAYOUTS = ['stack', 'inline'] as const

export const COUNTER_LAYOUT_OPTIONS: Option<typeof COUNTER_LAYOUTS[number]>[] = [
  { value: 'stack', label: 'Stack (vertical)' },
  { value: 'inline', label: 'Inline (horizontal)' },
]

export const ICON_POSITIONS = ['left', 'right', 'top', 'bottom'] as const

export const ICON_POSITION_OPTIONS: Option<typeof ICON_POSITIONS[number]>[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

export const LINE_POSITIONS = ['top', 'bottom', 'both'] as const

export const LINE_POSITION_OPTIONS: Option<typeof LINE_POSITIONS[number]>[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'both', label: 'Both' },
]

// === SIZE CONSTANTS ===

export const SIZE_PRESETS = ['sm', 'md', 'lg', 'xl'] as const

export const SIZE_PRESET_OPTIONS: Option<typeof SIZE_PRESETS[number]>[] = [
  { value: 'sm', label: 'Small (icon: 20px, text: 13px)' },
  { value: 'md', label: 'Medium (icon: 24px, text: 15px)' },
  { value: 'lg', label: 'Large (icon: 32px, text: 18px)' },
  { value: 'xl', label: 'Extra Large (icon: 40px, text: 22px)' },
]

// === ICON CONSTANTS ===

export const COUNTER_ICONS = [
  'heart', 'star', 'users', 'eye', 'zap', 'fire', 'trophy', 'bell', 'trending', 'none',
] as const

export const COUNTER_ICON_OPTIONS: Option<typeof COUNTER_ICONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'fire', label: 'Fire' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'users', label: 'Users' },
  { value: 'eye', label: 'Eye' },
  { value: 'bell', label: 'Bell' },
  { value: 'trending', label: 'Trending Up' },
  { value: 'zap', label: 'Zap / Lightning' },
]

export const CTA_ICONS = [
  'like', 'sub', 'bell', 'share', 'heart', 'star', 'follow', 'none',
] as const

export const CTA_ICON_OPTIONS: Option<typeof CTA_ICONS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'like', label: 'Thumbs Up (Like)' },
  { value: 'sub', label: 'YouTube Subscribe' },
  { value: 'bell', label: 'Bell (Notifications)' },
  { value: 'share', label: 'Share' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'follow', label: 'Follow' },
]

export const ICON_COLOR_MODES = ['brand', 'platform', 'white', 'gradient'] as const

export const ICON_COLOR_MODE_OPTIONS: Option<typeof ICON_COLOR_MODES[number]>[] = [
  { value: 'brand', label: "Brand Colors (each platform's color)" },
  { value: 'platform', label: 'Platform Colors' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'white', label: 'White' },
]

// === NUMBER NOTATION CONSTANTS ===

export const NUMBER_NOTATIONS = ['standard', 'compact', 'scientific'] as const

export const NUMBER_NOTATION_OPTIONS: Option<typeof NUMBER_NOTATIONS[number]>[] = [
  { value: 'standard', label: 'Standard (1,234,567)' },
  { value: 'compact', label: 'Compact (1.2M)' },
  { value: 'scientific', label: 'Scientific (1.23e6)' },
]

// === API SERVICE CONSTANTS ===

export const API_SERVICES = ['custom', 'youtube', 'twitch', 'github', 'poll'] as const

export const API_SERVICE_OPTIONS: Option<typeof API_SERVICES[number]>[] = [
  { value: 'custom', label: 'Custom (manual value)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'github', label: 'GitHub' },
  { value: 'poll', label: 'Custom API (polling)' },
]

// === FONT CONSTANTS ===

export const STANDARD_FONT_NAMES = ['display', 'body', 'mono'] as const

// === THEME CONSTANTS ===

export const THEMES = ['dark', 'light'] as const

export const THEME_OPTIONS: Option<typeof THEMES[number]>[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
]

// === GRADIENT CONSTANTS ===

export const GRADIENT_NAMES = [
  'indigo', 'cyan', 'sunset', 'emerald', 'neon', 'frost', 'fire', 'ocean',
  'purple', 'mono', 'rainbow', 'lavender', 'crimson', 'mint', 'amber',
  'navy', 'coral', 'slate', 'gold', 'teal', 'magenta',
] as const

// === SOCIAL PLATFORM CONSTANTS ===

export const SOCIAL_PLATFORMS = [
  'github', 'twitter', 'linkedin', 'youtube', 'instagram',
  'twitch', 'kick', 'discord', 'website',
] as const

// === PRESET CONSTANTS ===

export const TEXT_PRESETS = [
  'brb', 'chatting', 'starting', 'ending', 'technical', 'custom',
] as const

export const TEXT_PRESET_OPTIONS: Option<typeof TEXT_PRESETS[number]>[] = [
  { value: 'custom', label: 'Custom' },
  { value: 'brb', label: 'Be Right Back' },
  { value: 'chatting', label: 'Just Chatting' },
  { value: 'starting', label: 'Starting Soon' },
  { value: 'ending', label: 'Thanks for Watching' },
  { value: 'technical', label: 'Technical Difficulties' },
]

export const CTA_PRESETS = [
  'subscribe', 'like', 'follow', 'share', 'notify', 'custom',
] as const

export const CTA_PRESET_OPTIONS: Option<typeof CTA_PRESETS[number]>[] = [
  { value: 'custom', label: 'Custom' },
  { value: 'subscribe', label: 'Subscribe' },
  { value: 'like', label: 'Like & Subscribe' },
  { value: 'follow', label: 'Follow' },
  { value: 'share', label: 'Share' },
  { value: 'notify', label: 'Turn on Notifications' },
]

// === PLATFORM ORDER CONSTANTS ===

export const PLATFORM_ORDERS = ['default', 'priority'] as const

export const PLATFORM_ORDER_OPTIONS: Option<typeof PLATFORM_ORDERS[number]>[] = [
  { value: 'default', label: 'Default Order' },
  { value: 'priority', label: 'Priority Order' },
]

// === MESH BACKGROUND CONSTANTS ===

export const MESH_ANIMATIONS = ['drift', 'orbit', 'breathe', 'wave', 'none'] as const

export const MESH_ANIMATION_OPTIONS: Option<typeof MESH_ANIMATIONS[number]>[] = [
  { value: 'drift', label: 'Drift' },
  { value: 'orbit', label: 'Orbit' },
  { value: 'breathe', label: 'Breathe' },
  { value: 'wave', label: 'Wave' },
  { value: 'none', label: 'None (Static)' },
]

export const MESH_PALETTES = [
  'pastel', 'vibrant', 'earth', 'ocean', 'neon',
  'warm', 'cool', 'monochrome', 'sunset', 'forest',
  'candy', 'aurora', 'twilight', 'tropical', 'lavender',
  'slate', 'ember', 'sakura',
] as const

export const MESH_PALETTE_OPTIONS: Option<typeof MESH_PALETTES[number]>[] = [
  { value: 'pastel', label: 'Pastel' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'earth', label: 'Earth Tones' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'neon', label: 'Neon' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'forest', label: 'Forest' },
  { value: 'candy', label: 'Candy' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'twilight', label: 'Twilight' },
  { value: 'tropical', label: 'Tropical' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'slate', label: 'Slate' },
  { value: 'ember', label: 'Ember' },
  { value: 'sakura', label: 'Sakura' },
]

export const MESH_POINTS = [2, 3, 4, 5, 6, 7, 8] as const

export const MESH_POINT_OPTIONS: Option<string>[] = [
  { value: '2', label: '2 Blobs' },
  { value: '3', label: '3 Blobs' },
  { value: '4', label: '4 Blobs' },
  { value: '5', label: '5 Blobs' },
  { value: '6', label: '6 Blobs' },
  { value: '7', label: '7 Blobs' },
  { value: '8', label: '8 Blobs' },
]

export const MESH_BLEND_MODES = ['normal', 'screen', 'multiply', 'overlay'] as const

export const MESH_BLEND_MODE_OPTIONS: Option<typeof MESH_BLEND_MODES[number]>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'screen', label: 'Screen (Lighter)' },
  { value: 'multiply', label: 'Multiply (Darker)' },
  { value: 'overlay', label: 'Overlay (Contrast)' },
]

export const MESH_MODES = ['normal', 'light', 'dark'] as const

export const MESH_MODE_OPTIONS: Option<typeof MESH_MODES[number]>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

// === BACKGROUND PANEL CONSTANTS ===

export const BG_SHADOWS = ['none', 'sm', 'md', 'lg', 'xl'] as const

export const BG_SHADOW_OPTIONS: Option<typeof BG_SHADOWS[number]>[] = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
]

export const BG_SHADOW_CSS: Record<typeof BG_SHADOWS[number], string> = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
}

export const BG_PANEL_DEFAULTS = {
  bgcolor: '',
  bgopacity: 0.9,
  bgshadow: 'md' as const,
  bgblur: 12,
  bgradius: 14,
}

// === COLOR MODE CONSTANTS ===

export const COLOR_MODES = ['darker', 'dark', 'normal', 'light', 'lighter'] as const

export const COLOR_MODE_OPTIONS: Option<typeof COLOR_MODES[number]>[] = [
  { value: 'darker', label: 'Darker' },
  { value: 'dark', label: 'Dark' },
  { value: 'normal', label: 'Normal' },
  { value: 'light', label: 'Light' },
  { value: 'lighter', label: 'Lighter' },
]
