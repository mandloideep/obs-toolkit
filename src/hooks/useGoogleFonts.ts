/**
 * React Hook for Google Fonts Integration
 *
 * IMPORTANT: This hook is ONLY used in configurator files.
 * DO NOT import this in overlay files - overlays must stay minimal for OBS performance.
 */

import { useState, useEffect } from 'react'
import { googleFontsService, type GoogleFont } from '../services/googleFonts'

interface UseGoogleFontsReturn {
  fonts: GoogleFont[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useGoogleFonts(): UseGoogleFontsReturn {
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFonts()
  }, [])

  async function loadFonts() {
    try {
      setLoading(true)
      setError(null)

      const fonts = await googleFontsService.fetchFonts()
      setFonts(fonts)
    } catch (err) {
      console.error('[useGoogleFonts] Failed to load fonts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load Google Fonts')
      setFonts([]) // Fall back to empty array
    } finally {
      setLoading(false)
    }
  }

  return {
    fonts,
    loading,
    error,
    refresh: loadFonts,
  }
}
