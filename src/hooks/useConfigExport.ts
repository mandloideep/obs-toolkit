/**
 * useConfigExport Hook
 * Handles exporting and importing overlay configurations as JSON files
 */

interface ConfigMetadata {
  version: string
  overlayType: string
  timestamp: number
  presetName?: string
  author?: string
  description?: string
}

interface ConfigExport<T> {
  version: string
  overlayType: string
  timestamp: number
  params: T
  metadata?: Omit<ConfigMetadata, 'version' | 'overlayType' | 'timestamp'>
}

interface UseConfigExportReturn<T> {
  exportConfig: (params: T, overlayType: string, metadata?: Partial<ConfigMetadata>) => void
  importConfig: (file: File) => Promise<T>
  validateConfig: (json: unknown, defaults: T, overlayType: string) => { valid: boolean; params?: T; error?: string }
}

const CURRENT_VERSION = '1.0'

/**
 * Custom hook for exporting and importing overlay configurations
 */
export function useConfigExport<T extends Record<string, unknown>>(): UseConfigExportReturn<T> {
  /**
   * Export current configuration as JSON file
   */
  const exportConfig = (params: T, overlayType: string, metadata?: Partial<ConfigMetadata>) => {
    const exportData: ConfigExport<T> = {
      version: CURRENT_VERSION,
      overlayType,
      timestamp: Date.now(),
      params,
      metadata: {
        presetName: metadata?.presetName,
        author: metadata?.author,
        description: metadata?.description,
      },
    }

    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `obs-${overlayType}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Import configuration from JSON file
   */
  const importConfig = (file: File): Promise<T> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          resolve(json as T)
        } catch (error) {
          reject(new Error('Invalid JSON file'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * Validate imported configuration
   */
  const validateConfig = (
    json: unknown,
    defaults: T,
    overlayType: string
  ): { valid: boolean; params?: T; error?: string } => {
    // Check if json is an object
    if (!json || typeof json !== 'object') {
      return { valid: false, error: 'Invalid configuration format' }
    }

    const config = json as ConfigExport<T>

    // Check required fields
    if (!config.version || !config.overlayType || !config.params) {
      return { valid: false, error: 'Missing required fields (version, overlayType, or params)' }
    }

    // Check overlay type matches
    if (config.overlayType !== overlayType) {
      return {
        valid: false,
        error: `Configuration is for ${config.overlayType} overlay, but current overlay is ${overlayType}`,
      }
    }

    // Check version compatibility
    if (config.version !== CURRENT_VERSION) {
      console.warn(`Config version ${config.version} may not be fully compatible with current version ${CURRENT_VERSION}`)
    }

    // Validate param types against defaults
    const validatedParams: Partial<T> = {}
    const defaultKeys = Object.keys(defaults) as (keyof T)[]

    for (const key of defaultKeys) {
      if (key in config.params) {
        const defaultValue = defaults[key]
        const importedValue = config.params[key]

        // Type checking
        if (typeof importedValue === typeof defaultValue) {
          // Additional validation for arrays
          if (Array.isArray(defaultValue) && Array.isArray(importedValue)) {
            validatedParams[key] = importedValue
          } else {
            validatedParams[key] = importedValue
          }
        } else {
          console.warn(`Type mismatch for param "${String(key)}": expected ${typeof defaultValue}, got ${typeof importedValue}. Using default.`)
          validatedParams[key] = defaultValue
        }
      } else {
        // Use default if param not in imported config
        validatedParams[key] = defaults[key]
      }
    }

    return { valid: true, params: validatedParams as T }
  }

  return {
    exportConfig,
    importConfig,
    validateConfig,
  }
}
