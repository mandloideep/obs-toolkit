/**
 * URL Parameter Parsing Hook
 * Generic typed hook for parsing URL parameters with fallback defaults
 */

import { useMemo } from 'react'
import type { ParamValue } from '../types/brand.types'

/**
 * Parse URL parameters with type coercion and fallback defaults
 *
 * @template T - Type of the defaults object (determines return type)
 * @param defaults - Default values with proper types
 * @returns Typed object with URL params merged with defaults
 *
 * @example
 * ```tsx
 * const params = useOverlayParams({
 *   text: 'Hello',
 *   size: 32,
 *   enabled: true,
 *   colors: [] as string[]
 * })
 * // params.text: string
 * // params.size: number
 * // params.enabled: boolean
 * // params.colors: string[]
 * ```
 */
export function useOverlayParams<T extends Record<string, any>>(defaults: T): T {
  const params = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const result: Record<string, ParamValue> = {}

    // Iterate through default keys to maintain type structure
    for (const key in defaults) {
      const defaultValue = defaults[key]
      const urlValue = urlParams.get(key)

      // No URL param provided, use default
      if (urlValue === null) {
        result[key] = defaultValue
        continue
      }

      // Type coercion based on default value type
      if (typeof defaultValue === 'number') {
        const parsed = parseFloat(urlValue)
        result[key] = isNaN(parsed) ? defaultValue : parsed
      } else if (typeof defaultValue === 'boolean') {
        // Boolean: 'false' or '0' are false, everything else is true
        result[key] = urlValue !== 'false' && urlValue !== '0'
      } else if (Array.isArray(defaultValue)) {
        // Array: split by comma
        result[key] = urlValue ? urlValue.split(',').map((s) => s.trim()) : defaultValue
      } else {
        // String: decode URI component
        result[key] = decodeURIComponent(urlValue)
      }
    }

    return result as T
  }, [defaults])

  return params
}

/**
 * Same coercion as `useOverlayParams` but returns only the keys that were
 * actually present in the URL. Useful when a preset layer needs to override
 * defaults but URL params (when set) need to override the preset:
 *
 *   const explicit = useExplicitOverlayParams(DEFAULTS)
 *   const params = { ...DEFAULTS, ...preset, ...explicit }
 *
 * With the regular hook, missing URL params get default values that then
 * overwrite the preset.
 */
export function useExplicitOverlayParams<T extends Record<string, any>>(defaults: T): Partial<T> {
  return useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const result: Record<string, ParamValue> = {}

    for (const key in defaults) {
      const urlValue = urlParams.get(key)
      if (urlValue === null) continue

      const defaultValue = defaults[key]
      if (typeof defaultValue === 'number') {
        const parsed = parseFloat(urlValue)
        if (!isNaN(parsed)) result[key] = parsed
      } else if (typeof defaultValue === 'boolean') {
        result[key] = urlValue !== 'false' && urlValue !== '0'
      } else if (Array.isArray(defaultValue)) {
        result[key] = urlValue ? urlValue.split(',').map((s) => s.trim()) : []
      } else {
        result[key] = decodeURIComponent(urlValue)
      }
    }

    return result as Partial<T>
  }, [defaults])
}

/**
 * Parse a single string parameter from URL
 *
 * @param name - Parameter name
 * @param fallback - Fallback value if param not found
 */
export function useStringParam(name: string, fallback: string = ''): string {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(name)
    return value !== null ? decodeURIComponent(value) : fallback
  }, [name, fallback])
}

/**
 * Parse a single number parameter from URL
 *
 * @param name - Parameter name
 * @param fallback - Fallback value if param not found or invalid
 */
export function useNumberParam(name: string, fallback: number = 0): number {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(name)

    if (value === null) return fallback

    const parsed = parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }, [name, fallback])
}

/**
 * Parse a single boolean parameter from URL
 *
 * @param name - Parameter name
 * @param fallback - Fallback value if param not found
 */
export function useBooleanParam(name: string, fallback: boolean = false): boolean {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(name)

    if (value === null) return fallback

    // 'false' and '0' are false, everything else is true
    return value !== 'false' && value !== '0'
  }, [name, fallback])
}

/**
 * Parse an array parameter from URL (comma-separated)
 *
 * @param name - Parameter name
 * @param fallback - Fallback value if param not found
 */
export function useArrayParam(name: string, fallback: string[] = []): string[] {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(name)

    if (value === null) return fallback

    return value.split(',').map((s) => s.trim())
  }, [name, fallback])
}

/**
 * Get all URL parameters as an object
 */
export function useAllParams(): Record<string, string> {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const result: Record<string, string> = {}

    params.forEach((value, key) => {
      result[key] = decodeURIComponent(value)
    })

    return result
  }, [])
}
