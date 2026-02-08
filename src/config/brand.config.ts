/**
 * OBS Streaming Toolkit — Brand Configuration
 *
 * Global brand settings used by all overlays.
 * Migrated from brand.js to TypeScript with full type safety.
 */

import type { BrandConfig } from '../types/brand.types'

export const BRAND_CONFIG: BrandConfig = {
  name: 'Deep Mandloi',

  accent: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    warm: '#f59e0b',
    success: '#10b981',
    rose: '#f43f5e',
  },

  themes: {
    dark: {
      bg: '#121216',
      bgAlt: '#1c1c24',
      surface: '#26262e',
      border: '#3a3a44',
      text: '#f0f0f5',
      textMuted: '#9898a8',
      textDim: '#5a5a6a',
    },
    light: {
      bg: '#f8f8fc',
      bgAlt: '#eeeef4',
      surface: '#ffffff',
      border: '#d0d0da',
      text: '#121216',
      textMuted: '#5a5a6a',
      textDim: '#9898a8',
    },
  },

  gradients: {
    indigo: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8'],
    cyan: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#0891b2'],
    sunset: ['#f43f5e', '#f59e0b', '#fbbf24', '#f97316', '#ef4444'],
    emerald: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669'],
    neon: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'],
    frost: ['#818cf8', '#93c5fd', '#a5b4fc', '#c7d2fe', '#e0e7ff'],
    fire: ['#ef4444', '#f97316', '#f59e0b', '#fbbf24', '#fde68a'],
    ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#2dd4bf', '#5eead4'],
    purple: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    mono: ['#6b7280', '#9ca3af', '#d1d5db', '#9ca3af', '#6b7280'],
    rainbow: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6'],
    lavender: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#e9d5ff'],
    crimson: ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af'],
    mint: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    amber: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
    navy: ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa'],
    coral: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
    slate: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'],
    gold: ['#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a'],
    teal: ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
    magenta: ['#a21caf', '#c026d3', '#d946ef', '#e879f9', '#f0abfc'],
  },

  fonts: {
    display: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    body: "'Inter', 'SF Pro Text', -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    custom: [],
  },

  fontImport:
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',

  socials: {
    github: 'deepmandloi',
    twitter: '',
    linkedin: 'deepmandloi',
    youtube: '',
    instagram: '',
    twitch: '',
    kick: '',
    discord: '',
    website: '',
  },
}

/**
 * Deep merge utility for combining brand config with defaults
 * Preserves nested objects while allowing partial overrides
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  fallback: T
): T {
  const result = { ...target }

  for (const key of Object.keys(fallback) as (keyof T)[]) {
    if (!(key in result)) {
      result[key] = fallback[key]
    } else if (
      typeof fallback[key] === 'object' &&
      !Array.isArray(fallback[key]) &&
      fallback[key] !== null &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      result[key] !== null
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, any>,
        fallback[key] as Record<string, any>
      ) as T[keyof T]
    }
  }

  return result
}
