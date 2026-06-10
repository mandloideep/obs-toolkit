/**
 * Counter Overlay Presets
 * Quick preset configurations for common counter use cases
 */

import type { CounterPreset } from '../types/counter.types'
import type { CounterPresetName } from '../types/brand.types'

export const COUNTER_PRESETS: Record<CounterPresetName, CounterPreset> = {
  /**
   * Subscriber Preset
   * YouTube-style subscriber counter — crimson accent
   */
  subscriber: {
    label: 'Subscribers',
    icon: 'heart',
    size: 48,
    labelsize: 16,
    font: 'mono',
    layout: 'stack',
    gradient: 'crimson',
    iconcolor: '#ef4444',
    numbercolor: '',
    bg: true,
    bggradient: true,
    bggradientname: 'crimson',
    colormode: 'darker',
  },

  /**
   * Follower Preset
   * Follower count — indigo accent
   */
  follower: {
    label: 'Followers',
    icon: 'users',
    size: 48,
    labelsize: 16,
    font: 'mono',
    layout: 'stack',
    gradient: 'indigo',
    iconcolor: '#818cf8',
    bg: true,
    bggradient: true,
    bggradientname: 'indigo',
    colormode: 'darker',
  },

  /**
   * Viewer Preset
   * Live viewer count — neon accent
   */
  viewer: {
    label: 'Viewers',
    icon: 'eye',
    size: 52,
    labelsize: 14,
    font: 'mono',
    layout: 'inline',
    gradient: 'neon',
    iconcolor: '#22d3ee',
    bg: true,
  },

  /**
   * Donation Preset
   * Donation/goal counter — emerald accent
   */
  donation: {
    label: 'Goal',
    icon: 'star',
    size: 44,
    labelsize: 16,
    font: 'display',
    layout: 'stack',
    gradient: 'emerald',
    iconcolor: '#34d399',
    numbercolor: '',
    bg: true,
    bggradient: true,
    bggradientname: 'emerald',
    colormode: 'darker',
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
