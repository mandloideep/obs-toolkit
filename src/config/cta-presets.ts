/**
 * CTA Overlay Presets
 * Quick preset configurations for common call-to-action use cases
 * Enhanced with gradient types, bg panels, and per-element colors
 */

import type { CTAPreset } from '../types/cta.types'
import type { CTAPresetName } from '../types/brand.types'

export const CTA_PRESETS: Record<CTAPresetName, CTAPreset> = {
  /**
   * Subscribe Preset
   * Encourage viewers to subscribe — YouTube red accent
   */
  subscribe: {
    text: 'Subscribe',
    sub: "Don't miss out!",
    icon: 'sub',
    iconanim: 'bounce',
    iconcolor: '#ef4444',
    gradient: 'crimson',
    decorationcolor: '#ef4444',
    bg: true,
    bggradient: true,
    bggradientname: 'crimson',
    colormode: 'darker',
  },

  /**
   * Like Preset
   * Ask viewers to like — warm pink accent
   */
  like: {
    text: 'Like this stream',
    sub: 'It helps a lot!',
    icon: 'like',
    iconanim: 'shake',
    iconcolor: '#f472b6',
    gradient: 'sunset',
    decorationcolor: '#f472b6',
    bg: true,
  },

  /**
   * Follow Preset
   * Encourage follows — indigo accent
   */
  follow: {
    text: 'Follow',
    sub: 'Stay connected',
    icon: 'follow',
    iconanim: 'bounce',
    iconcolor: '#818cf8',
    gradient: 'indigo',
    decorationcolor: '#818cf8',
    bg: true,
    bggradient: true,
    bggradientname: 'indigo',
    colormode: 'darker',
  },

  /**
   * Share Preset
   * Ask viewers to share — teal/cyan accent
   */
  share: {
    text: 'Share with a friend',
    sub: '',
    icon: 'share',
    iconanim: 'spin',
    iconcolor: '#2dd4bf',
    gradient: 'cyan',
    decorationcolor: '#2dd4bf',
    bg: true,
  },

  /**
   * Notify Preset
   * Turn on notifications — amber bell accent
   */
  notify: {
    text: 'Turn on notifications',
    sub: 'Never miss a stream',
    icon: 'bell',
    iconanim: 'shake',
    iconcolor: '#fbbf24',
    gradient: 'amber',
    decorationcolor: '#fbbf24',
    bg: true,
  },

  /**
   * Donate Preset
   * Support/donation CTA — emerald accent
   */
  donate: {
    text: 'Support the Stream',
    sub: 'Every bit helps!',
    icon: 'heart',
    iconanim: 'bounce',
    iconcolor: '#34d399',
    gradient: 'emerald',
    decorationcolor: '#34d399',
    bg: true,
    bggradient: true,
    bggradientname: 'emerald',
    colormode: 'darker',
  },

  /**
   * Merch Preset
   * Merchandise promotion — gold accent
   */
  merch: {
    text: 'Check out the merch!',
    sub: 'Link in description',
    icon: 'star',
    iconanim: 'spin',
    iconcolor: '#f59e0b',
    gradient: 'gold',
    decorationcolor: '#f59e0b',
    bg: true,
    bggradient: true,
    bggradientname: 'amber',
    colormode: 'darker',
  },

  /**
   * Discord Preset
   * Discord community invite — purple accent
   */
  discord: {
    text: 'Join the Discord',
    sub: 'Be part of the community',
    icon: 'follow',
    iconanim: 'bounce',
    iconcolor: '#a78bfa',
    gradient: 'purple',
    decorationcolor: '#a78bfa',
    bg: true,
    bggradient: true,
    bggradientname: 'lavender',
    colormode: 'darker',
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
