/**
 * useKeyboardShortcuts Hook
 * Manages keyboard shortcuts for undo/redo operations
 */

import { useEffect } from 'react'

interface Shortcut {
  key: string
  ctrlOrCmd: boolean
  shift?: boolean
  callback: () => void
}

/**
 * Custom hook for managing keyboard shortcuts
 * Automatically prevents default behavior and ignores shortcuts when typing in inputs
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Check each shortcut
      for (const shortcut of shortcuts) {
        const ctrlOrCmdPressed = e.metaKey || e.ctrlKey
        const shiftPressed = e.shiftKey
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (
          keyMatches &&
          ctrlOrCmdPressed === shortcut.ctrlOrCmd &&
          (!shortcut.shift || shiftPressed === shortcut.shift)
        ) {
          e.preventDefault()
          shortcut.callback()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
