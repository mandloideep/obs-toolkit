/**
 * Preset Card Definitions
 * Visual metadata for preset cards across all overlay types.
 */

import type { PresetCardInfo } from '../components/configure/PresetCards'

export const TEXT_PRESET_CARDS: PresetCardInfo[] = [
  {
    value: 'brb',
    label: 'Be Right Back',
    description: 'Warm sunset tones with gradient panel',
    gradient: 'sunset',
  },
  {
    value: 'chatting',
    label: 'Just Chatting',
    description: 'Clean indigo gradient text',
    gradient: 'indigo',
  },
  {
    value: 'starting',
    label: 'Starting Soon',
    description: 'Fresh emerald with forest panel',
    gradient: 'emerald',
  },
  {
    value: 'ending',
    label: 'Thanks for Watching',
    description: 'Purple radial glow',
    gradient: 'purple',
    colormode: 'darker',
  },
  {
    value: 'technical',
    label: 'Technical Difficulties',
    description: 'Monochrome with amber warning',
    gradient: 'mono',
  },
  {
    value: 'gaming',
    label: 'Gaming / Live',
    description: 'Bold neon with pulsing line',
    gradient: 'neon',
  },
  { value: 'podcast', label: 'Podcast', description: 'Clean lower-third style', gradient: 'slate' },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Mesh aurora with gradient text',
    gradient: 'palette:aurora',
  },
  { value: 'custom', label: 'Custom', description: 'Full manual control' },
]

export const CTA_PRESET_CARDS: PresetCardInfo[] = [
  {
    value: 'subscribe',
    label: 'Subscribe',
    description: 'YouTube red accent',
    gradient: 'crimson',
    colormode: 'darker',
  },
  { value: 'like', label: 'Like', description: 'Warm pink accent', gradient: 'sunset' },
  {
    value: 'follow',
    label: 'Follow',
    description: 'Indigo accent',
    gradient: 'indigo',
    colormode: 'darker',
  },
  { value: 'share', label: 'Share', description: 'Teal/cyan accent', gradient: 'cyan' },
  { value: 'notify', label: 'Notifications', description: 'Amber bell accent', gradient: 'amber' },
  {
    value: 'donate',
    label: 'Donate',
    description: 'Emerald accent',
    gradient: 'emerald',
    colormode: 'darker',
  },
  {
    value: 'merch',
    label: 'Merch',
    description: 'Gold accent',
    gradient: 'gold',
    colormode: 'darker',
  },
  {
    value: 'discord',
    label: 'Discord',
    description: 'Purple accent',
    gradient: 'purple',
    colormode: 'darker',
  },
  { value: 'custom', label: 'Custom', description: 'Full manual control' },
]

export const COUNTER_PRESET_CARDS: PresetCardInfo[] = [
  {
    value: 'subscriber',
    label: 'Subscribers',
    description: 'Heart icon, crimson accent',
    gradient: 'crimson',
    colormode: 'darker',
  },
  {
    value: 'follower',
    label: 'Followers',
    description: 'Users icon, indigo accent',
    gradient: 'indigo',
    colormode: 'darker',
  },
  { value: 'viewer', label: 'Viewers', description: 'Eye icon, neon inline', gradient: 'neon' },
  {
    value: 'donation',
    label: 'Donations',
    description: 'Star icon, emerald accent',
    gradient: 'emerald',
    colormode: 'darker',
  },
  { value: 'custom', label: 'Custom', description: 'Full manual control' },
]

export const SOCIALS_PRESET_CARDS: PresetCardInfo[] = [
  { value: 'minimal', label: 'Minimal', description: 'Clean text-forward', gradient: 'slate' },
  {
    value: 'colorful',
    label: 'Colorful',
    description: 'Brand colors with vibrant panel',
    gradient: 'rainbow',
  },
  {
    value: 'branded',
    label: 'Branded',
    description: 'Gradient icons with panel',
    gradient: 'indigo',
    colormode: 'darker',
  },
  {
    value: 'neon',
    label: 'Neon',
    description: 'Neon icons on dark bg',
    gradient: 'neon',
    colormode: 'darker',
  },
  { value: 'custom', label: 'Custom', description: 'Full manual control' },
]

export const BORDER_PRESET_CARDS: PresetCardInfo[] = [
  {
    value: 'neon',
    label: 'Neon Glow',
    description: 'Bright neon with dash animation',
    gradient: 'neon',
  },
  { value: 'rainbow', label: 'Rainbow', description: 'Full rainbow cycling', gradient: 'rainbow' },
  {
    value: 'subtle',
    label: 'Subtle',
    description: 'Minimal border with soft glow',
    gradient: 'slate',
  },
  { value: 'pulse', label: 'Pulse', description: 'Pulsing glow animation', gradient: 'indigo' },
  { value: 'custom', label: 'Custom', description: 'Full manual control' },
]
