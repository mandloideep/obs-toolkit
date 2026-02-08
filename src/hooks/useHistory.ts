/**
 * useHistory Hook
 * Manages undo/redo functionality for overlay configurations
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseHistoryOptions {
  maxHistorySize?: number
  debounceMs?: number
}

interface UseHistoryReturn<T> {
  state: T
  setState: (newState: T | ((prev: T) => T)) => void
  updateState: (newState: T) => void // Immediate update without debounce
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  clearHistory: () => void
}

/**
 * Custom hook for managing state with undo/redo history
 */
export function useHistory<T>(
  initialState: T,
  options: UseHistoryOptions = {}
): UseHistoryReturn<T> {
  const { maxHistorySize = 50, debounceMs = 150 } = options

  // Current state
  const [state, setInternalState] = useState<T>(initialState)

  // History stack
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const pendingState = useRef<T | null>(null)

  // Add state to history
  const addToHistory = useCallback(
    (newState: T) => {
      setHistory((prev) => {
        // Remove any redo history (if we're not at the end)
        const newHistory = prev.slice(0, currentIndex + 1)

        // Add new state
        newHistory.push(newState)

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift()
          setCurrentIndex((idx) => idx - 1)
          return newHistory
        }

        return newHistory
      })
      setCurrentIndex((idx) => idx + 1)
    },
    [currentIndex, maxHistorySize]
  )

  // Flush pending state (called on debounce timeout)
  const flushPendingState = useCallback(() => {
    if (pendingState.current !== null) {
      const stateToAdd = pendingState.current
      pendingState.current = null
      addToHistory(stateToAdd)
    }
  }, [addToHistory])

  // Set state with debounce
  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      const resolvedState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(state)
        : newState

      setInternalState(resolvedState)
      pendingState.current = resolvedState

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Set new timer
      debounceTimer.current = setTimeout(() => {
        flushPendingState()
      }, debounceMs)
    },
    [state, debounceMs, flushPendingState]
  )

  // Set state immediately without debounce (for operations like preset load, reset)
  const updateState = useCallback(
    (newState: T) => {
      // Clear any pending debounced state
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }
      pendingState.current = null

      setInternalState(newState)
      addToHistory(newState)
    },
    [addToHistory]
  )

  // Undo
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      // Flush any pending state first
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }
      if (pendingState.current !== null) {
        flushPendingState()
      }

      setCurrentIndex((idx) => idx - 1)
      setInternalState(history[currentIndex - 1])
    }
  }, [currentIndex, history, flushPendingState])

  // Redo
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      // Flush any pending state first
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }
      if (pendingState.current !== null) {
        flushPendingState()
      }

      setCurrentIndex((idx) => idx + 1)
      setInternalState(history[currentIndex + 1])
    }
  }, [currentIndex, history, flushPendingState])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([state])
    setCurrentIndex(0)
  }, [state])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    state,
    setState,
    updateState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clearHistory,
  }
}
