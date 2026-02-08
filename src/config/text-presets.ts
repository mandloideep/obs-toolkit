/**
 * Text Overlay Presets
 * Quick preset configurations for common use cases
 */

import type { TextPreset } from '../types/text.types'
import type { TextPresetName } from '../types/brand.types'

export const TEXT_PRESETS: Record<TextPresetName, TextPreset> = {
  /**
   * BRB Preset
   * "Be Right Back" break screen
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
    textcolor: '#ef4444',
    bg: true,
  },

  /**
   * Chatting Preset
   * "Just Chatting" screen
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
    bg: false,
  },

  /**
   * Starting Soon Preset
   * Pre-stream screen
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
    textcolor: '#10b981',
    bg: true,
  },

  /**
   * Ending Preset
   * "Thanks for Watching" post-stream screen
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
    bg: true,
  },

  /**
   * Technical Difficulties Preset
   * Issue notification screen
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
    gradient: 'mono',
    textcolor: '#f59e0b',
    bg: true,
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
