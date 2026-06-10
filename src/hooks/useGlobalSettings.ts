/**
 * Global Settings Hook
 * Manages persistent global brand settings (theme, gradient, font, colormode).
 * Stored in localStorage, applied as defaults to all configurators.
 */

import { useState, useCallback, useMemo } from 'react'
import type { GradientName, GradientType, ColorMode, ThemeName } from '../types/brand.types'

const STORAGE_KEY = 'obs-toolkit-global'

export interface GlobalSettings {
  theme: ThemeName
  gradient: GradientName
  gradienttype: GradientType
  font: string
  colormode: ColorMode
  setupComplete: boolean
}

const GLOBAL_DEFAULTS: GlobalSettings = {
  theme: 'dark',
  gradient: 'indigo',
  gradienttype: 'linear',
  font: 'display',
  colormode: 'normal',
  setupComplete: false,
}

function loadSettings(): GlobalSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...GLOBAL_DEFAULTS, ...JSON.parse(stored) }
    }
  } catch {
    // Ignore parse errors
  }
  return GLOBAL_DEFAULTS
}

function saveSettings(settings: GlobalSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore storage errors
  }
}

export function useGlobalSettings() {
  const [settings, setSettingsState] = useState<GlobalSettings>(loadSettings)

  const updateSettings = useCallback((partial: Partial<GlobalSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    setSettingsState(GLOBAL_DEFAULTS)
    saveSettings(GLOBAL_DEFAULTS)
  }, [])

  const isSetupComplete = settings.setupComplete

  return useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      isSetupComplete,
    }),
    [settings, updateSettings, resetSettings, isSetupComplete]
  )
}

/**
 * Apply global settings to overlay defaults.
 * Only overrides keys that exist in both the defaults and global settings.
 */
export function applyGlobalDefaults<T extends Record<string, unknown>>(
  defaults: T,
  globalSettings: GlobalSettings
): T {
  if (!globalSettings.setupComplete) return defaults

  const overrides: Record<string, unknown> = {}

  if ('theme' in defaults) overrides.theme = globalSettings.theme
  if ('gradient' in defaults) overrides.gradient = globalSettings.gradient
  if ('gradienttype' in defaults) overrides.gradienttype = globalSettings.gradienttype
  if ('font' in defaults) overrides.font = globalSettings.font
  if ('colormode' in defaults) overrides.colormode = globalSettings.colormode

  return { ...defaults, ...overrides }
}
