/**
 * Text Overlay Presets
 * Quick preset configurations for common use cases
 * Enhanced with gradient types, bg panels, and per-element colors
 */

import type { TextPreset } from '../types/text.types'
import type { TextPresetName } from '../types/brand.types'

export const TEXT_PRESETS: Record<TextPresetName, TextPreset> = {
  /**
   * BRB Preset
   * "Be Right Back" — warm sunset tones with gradient bg panel
   */
  brb: {
    text: 'Be Right Back',
    sub: 'Stream will resume shortly',
    size: 48,
    subsize: 20,
    weight: 700,
    font: 'display',
    align: 'center',
    valign: 'center',
    entrance: 'scale',
    entrancespeed: 1,
    line: true,
    linestyle: 'gradient',
    lineanim: 'grow',
    gradient: 'sunset',
    gradienttype: 'linear',
    textcolor: '#fbbf24',
    subcolor: '#fdba74',
    bg: true,
    bggradient: true,
    bggradientname: 'fire',
    colormode: 'darker',
  },

  /**
   * Chatting Preset
   * "Just Chatting" — clean indigo with gradient text
   */
  chatting: {
    text: 'Just Chatting',
    sub: '',
    size: 36,
    subsize: 18,
    weight: 600,
    font: 'display',
    align: 'center',
    valign: 'center',
    entrance: 'fade',
    entrancespeed: 0.8,
    line: true,
    linestyle: 'gradient',
    lineanim: 'slide',
    gradient: 'indigo',
    gradienttype: 'linear',
    textgradient: true,
    bg: false,
  },

  /**
   * Starting Soon Preset
   * "Starting Soon" — fresh emerald with gradient text and bg panel
   */
  starting: {
    text: 'Starting Soon',
    sub: 'Stream begins in a moment...',
    size: 52,
    subsize: 22,
    weight: 700,
    font: 'display',
    align: 'center',
    valign: 'center',
    entrance: 'slideUp',
    entrancespeed: 1,
    line: true,
    linestyle: 'gradient',
    lineanim: 'slide',
    gradient: 'emerald',
    gradienttype: 'linear',
    textgradient: true,
    subcolor: '#6ee7b7',
    bg: true,
    bggradient: true,
    bggradientname: 'palette:forest',
    colormode: 'darker',
  },

  /**
   * Ending Preset
   * "Thanks for Watching" — purple radial glow with panel
   */
  ending: {
    text: 'Thanks for Watching!',
    sub: 'See you next time',
    size: 44,
    subsize: 20,
    weight: 700,
    font: 'display',
    align: 'center',
    valign: 'center',
    entrance: 'fade',
    entrancespeed: 1,
    line: true,
    linestyle: 'gradient',
    lineanim: 'pulse',
    gradient: 'purple',
    gradienttype: 'radial',
    textgradient: true,
    subcolor: '#c4b5fd',
    bg: true,
    bggradient: true,
    bggradientname: 'lavender',
    colormode: 'darker',
  },

  /**
   * Technical Difficulties Preset
   * "Technical Difficulties" — monochrome with amber warning
   */
  technical: {
    text: 'Technical Difficulties',
    sub: 'Please stand by...',
    size: 40,
    subsize: 18,
    weight: 600,
    font: 'mono',
    align: 'center',
    valign: 'center',
    entrance: 'fade',
    entrancespeed: 0.6,
    line: true,
    linestyle: 'dashed',
    lineanim: 'none',
    linecolor: '#f59e0b',
    gradient: 'mono',
    textcolor: '#f59e0b',
    subcolor: '#fbbf24',
    bg: true,
  },

  /**
   * Gaming Preset
   * Bold neon gradient text with dark panel and pulsing line
   */
  gaming: {
    text: 'LIVE',
    sub: '',
    size: 64,
    weight: 900,
    font: 'display',
    align: 'center',
    valign: 'center',
    entrance: 'scale',
    entrancespeed: 0.6,
    line: true,
    linestyle: 'gradient',
    lineanim: 'pulse',
    gradient: 'neon',
    gradienttype: 'linear',
    textgradient: true,
    bg: true,
    bggradient: true,
    bggradientname: 'palette:neon',
    colormode: 'darker',
  },

  /**
   * Podcast Preset
   * Clean minimal with solid line — lower third style
   */
  podcast: {
    text: 'Episode Title',
    sub: 'Podcast Name',
    size: 36,
    subsize: 16,
    weight: 500,
    font: 'body',
    align: 'left',
    valign: 'bottom',
    entrance: 'slideRight',
    entrancespeed: 0.8,
    line: true,
    linestyle: 'solid',
    lineanim: 'grow',
    linecolor: '#94a3b8',
    gradient: 'slate',
    textcolor: '#f1f5f9',
    subcolor: '#94a3b8',
    bg: true,
  },

  /**
   * Creative Preset
   * Mesh palette bg with gradient text — artistic feel
   */
  creative: {
    text: 'Creative Mode',
    sub: '',
    size: 44,
    weight: 700,
    font: 'display',
    align: 'center',
    valign: 'center',
    entrance: 'fade',
    entrancespeed: 1.2,
    line: true,
    linestyle: 'gradient',
    lineanim: 'slide',
    gradient: 'palette:aurora',
    gradienttype: 'mesh',
    textgradient: true,
    bg: true,
    bggradient: true,
    bggradientname: 'palette:twilight',
    colormode: 'darker',
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
