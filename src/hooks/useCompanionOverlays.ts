/**
 * Companion Overlays Hook
 * Stores the last-rendered preview URL for each overlay kind in localStorage so
 * other configurators can compose layered previews (e.g. configure a border
 * while seeing it sit over the last-used mesh and beneath the last-used text).
 */

import { useCallback, useEffect, useState } from 'react'

export type CompanionKind = 'mesh' | 'border' | 'text'

type CompanionUrls = Record<CompanionKind, string>

const STORAGE_PREFIX = 'companion.'
const STORAGE_EVENT = 'obs-toolkit:companion'

function storageKey(kind: CompanionKind): string {
  return `${STORAGE_PREFIX}${kind}`
}

function readAll(): CompanionUrls {
  const result: CompanionUrls = { mesh: '', border: '', text: '' }
  try {
    for (const kind of ['mesh', 'border', 'text'] as CompanionKind[]) {
      result[kind] = localStorage.getItem(storageKey(kind)) ?? ''
    }
  } catch {
    // ignore
  }
  return result
}

export function useCompanionOverlays() {
  const [urls, setUrls] = useState<CompanionUrls>(() => readAll())

  // Cross-tab + cross-hook sync. The native storage event fires only in OTHER
  // tabs, so we also dispatch a same-tab custom event from setUrl.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
        setUrls(readAll())
      }
    }
    const handleCustom = () => setUrls(readAll())

    window.addEventListener('storage', handleStorage)
    window.addEventListener(STORAGE_EVENT, handleCustom)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(STORAGE_EVENT, handleCustom)
    }
  }, [])

  const setUrl = useCallback((kind: CompanionKind, url: string) => {
    try {
      if (url) {
        localStorage.setItem(storageKey(kind), url)
      } else {
        localStorage.removeItem(storageKey(kind))
      }
      window.dispatchEvent(new Event(STORAGE_EVENT))
    } catch {
      // ignore
    }
    setUrls((prev) => ({ ...prev, [kind]: url }))
  }, [])

  const clearUrl = useCallback((kind: CompanionKind) => setUrl(kind, ''), [setUrl])

  return { urls, setUrl, clearUrl }
}
