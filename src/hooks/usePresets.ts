/**
 * usePresets Hook
 * Manages saving, loading, and managing custom configuration presets
 */

import { useState, useEffect, useCallback } from 'react'

interface Preset<T> {
  name: string
  params: T
  createdAt: number
  updatedAt: number
}

interface UsePresetsReturn<T> {
  presets: Preset<T>[]
  currentPresetName: string | null
  loadPreset: (name: string) => T | null
  savePreset: (name: string, params: T) => void
  deletePreset: (name: string) => void
  renamePreset: (oldName: string, newName: string) => boolean
  exportPreset: (name: string) => void
  importPreset: (file: File) => Promise<void>
}

/**
 * Custom hook for managing presets for a specific overlay type
 */
export function usePresets<T extends Record<string, unknown>>(
  overlayType: string,
  defaults: T
): UsePresetsReturn<T> {
  const storageKey = `obs-presets-${overlayType}`

  // Load presets from localStorage
  const [presets, setPresets] = useState<Preset<T>[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load presets:', error)
    }
    return []
  })

  const [currentPresetName, setCurrentPresetName] = useState<string | null>(null)

  // Save presets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(presets))
    } catch (error) {
      console.error('Failed to save presets:', error)
    }
  }, [presets, storageKey])

  // Load a preset by name
  const loadPreset = useCallback(
    (name: string): T | null => {
      const preset = presets.find((p) => p.name === name)
      if (preset) {
        setCurrentPresetName(name)
        return preset.params
      }
      return null
    },
    [presets]
  )

  // Save a preset (create new or update existing)
  const savePreset = useCallback(
    (name: string, params: T) => {
      const existingIndex = presets.findIndex((p) => p.name === name)
      const now = Date.now()

      if (existingIndex >= 0) {
        // Update existing preset
        const updated = [...presets]
        updated[existingIndex] = {
          ...updated[existingIndex],
          params,
          updatedAt: now,
        }
        setPresets(updated)
      } else {
        // Create new preset
        const newPreset: Preset<T> = {
          name,
          params,
          createdAt: now,
          updatedAt: now,
        }
        setPresets([...presets, newPreset])
      }
      setCurrentPresetName(name)
    },
    [presets]
  )

  // Delete a preset
  const deletePreset = useCallback(
    (name: string) => {
      setPresets(presets.filter((p) => p.name !== name))
      if (currentPresetName === name) {
        setCurrentPresetName(null)
      }
    },
    [presets, currentPresetName]
  )

  // Rename a preset
  const renamePreset = useCallback(
    (oldName: string, newName: string): boolean => {
      // Check if new name already exists
      if (presets.some((p) => p.name === newName)) {
        return false
      }

      const index = presets.findIndex((p) => p.name === oldName)
      if (index >= 0) {
        const updated = [...presets]
        updated[index] = {
          ...updated[index],
          name: newName,
          updatedAt: Date.now(),
        }
        setPresets(updated)

        if (currentPresetName === oldName) {
          setCurrentPresetName(newName)
        }
        return true
      }
      return false
    },
    [presets, currentPresetName]
  )

  // Export a preset as JSON file
  const exportPreset = useCallback(
    (name: string) => {
      const preset = presets.find((p) => p.name === name)
      if (!preset) return

      const exportData = {
        version: '1.0',
        overlayType,
        preset: preset,
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${overlayType}-preset-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [presets, overlayType]
  )

  // Import a preset from JSON file
  const importPreset = useCallback(
    async (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string)

            // Validate structure
            if (!json.preset || !json.preset.name || !json.preset.params) {
              throw new Error('Invalid preset file format')
            }

            // Check overlay type matches
            if (json.overlayType !== overlayType) {
              throw new Error(`Preset is for ${json.overlayType} overlay, but current overlay is ${overlayType}`)
            }

            // Validate params against defaults
            const defaultKeys = Object.keys(defaults)
            for (const key of defaultKeys) {
              if (!(key in json.preset.params)) {
                console.warn(`Missing param "${key}" in imported preset, using default`)
                json.preset.params[key] = defaults[key]
              }
            }

            // Check if preset name already exists
            let importName = json.preset.name
            let counter = 1
            while (presets.some((p) => p.name === importName)) {
              importName = `${json.preset.name} (${counter})`
              counter++
            }

            // Create preset
            const now = Date.now()
            const newPreset: Preset<T> = {
              name: importName,
              params: json.preset.params,
              createdAt: now,
              updatedAt: now,
            }

            setPresets([...presets, newPreset])
            resolve()
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = () => {
          reject(new Error('Failed to read file'))
        }

        reader.readAsText(file)
      })
    },
    [presets, overlayType, defaults]
  )

  return {
    presets,
    currentPresetName,
    loadPreset,
    savePreset,
    deletePreset,
    renamePreset,
    exportPreset,
    importPreset,
  }
}
