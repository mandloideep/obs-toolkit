/**
 * Counter Overlay Parameter Types
 * Complete type definitions for the counter overlay component
 */

import type {
  CounterLayout,
  CounterIcon,
  CounterPresetName,
  FontFamily,
  HorizontalAlign,
  NumberNotation,
  APIService,
  GradientName,
  GradientType,
  ThemeName,
  BgShadow,
  ColorMode,
} from './brand.types'
import { BG_PANEL_DEFAULTS } from '../lib/constants'

/**
 * Counter Overlay Parameters
 * All 35+ parameters for the counter overlay
 */
export interface CounterOverlayParams {
  // Preset
  preset: CounterPresetName

  // Display
  value: number
  label: string
  prefix: string
  suffix: string
  icon: CounterIcon
  size: number
  labelsize: number
  font: FontFamily
  layout: CounterLayout
  align: HorizontalAlign

  // Number Formatting
  separator: boolean
  decimals: number
  notation: NumberNotation
  abbreviate: boolean

  // Animation
  animate: boolean
  duration: number
  trend: boolean
  trendcolor: string

  // API Integration
  service: APIService
  apikey: string
  userid: string
  metric: string
  poll: string
  pollkey: string
  pollrate: number

  // Layout
  counterpadx: number
  counterpady: number
  width: string
  height: string
  iconcolor: string
  numbercolor: string
  labelcolor: string

  // Style
  bg: boolean

  // Background Panel
  bgcolor: string
  bgopacity: number
  bgshadow: BgShadow
  bgblur: number
  bgradius: number

  // Global
  theme: ThemeName
  gradient: GradientName
  gradienttype: GradientType
  colors: string[]
  colormode: ColorMode
  bggradient: boolean
  bggradientname: string
}

/**
 * API Service Configuration
 * Service-specific endpoint and data extraction
 */
export interface APIServiceConfig {
  url: (userId: string, apiKey?: string) => string
  path: string
  headers?: Record<string, string>
}

/**
 * API service configurations for built-in services
 */
export const API_SERVICE_CONFIGS: Record<string, APIServiceConfig> = {
  youtube: {
    url: (channelId, apiKey) =>
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
    path: 'items.0.statistics.subscriberCount',
  },
  twitch: {
    url: (username) => `https://api.twitch.tv/helix/users/follows?to_id=${username}`,
    path: 'total',
    headers: {
      'Client-ID': '', // Will be set from apiKey
    },
  },
  github: {
    url: (username) => `https://api.github.com/users/${username}`,
    path: 'followers',
  },
}

/**
 * Default values for counter overlay parameters
 */
/**
 * Counter Preset Configuration
 * Preset values that can be overridden by URL parameters
 */
export interface CounterPreset {
  label?: string
  icon?: CounterIcon
  size?: number
  labelsize?: number
  font?: FontFamily
  layout?: CounterLayout
  gradient?: GradientName
  gradienttype?: GradientType
  iconcolor?: string
  numbercolor?: string
  labelcolor?: string
  bg?: boolean
  bggradient?: boolean
  bggradientname?: string
  colormode?: ColorMode
  theme?: ThemeName
}

export const COUNTER_DEFAULTS: CounterOverlayParams = {
  preset: 'custom',
  value: 0,
  label: 'Subscribers',
  prefix: '',
  suffix: '',
  icon: 'none',
  size: 48,
  labelsize: 16,
  font: 'mono',
  layout: 'stack',
  align: 'center',
  separator: true,
  decimals: 0,
  notation: 'standard',
  abbreviate: false,
  animate: true,
  duration: 2,
  trend: false,
  trendcolor: '#10b981',
  service: 'custom',
  apikey: '',
  userid: '',
  metric: 'followers',
  poll: '',
  pollkey: 'value',
  pollrate: 30,
  counterpadx: 24,
  counterpady: 24,
  width: 'auto',
  height: 'auto',
  iconcolor: '',
  numbercolor: '',
  labelcolor: '',
  bg: false,
  ...BG_PANEL_DEFAULTS,
  theme: 'dark',
  gradient: 'indigo',
  gradienttype: 'linear',
  colors: [],
  colormode: 'normal',
  bggradient: false,
  bggradientname: '',
}
