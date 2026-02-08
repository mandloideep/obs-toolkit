/**
 * RequestAnimationFrame Hooks
 * Hooks for managing 60fps animations with proper cleanup
 */

import { useEffect, useRef, useCallback } from 'react'

/**
 * RequestAnimationFrame callback with timestamp
 */
export type RAFCallback = (timestamp: number) => void

/**
 * Use RequestAnimationFrame with automatic cleanup
 *
 * @param callback - Function called on each animation frame
 * @param deps - Dependency array (when to restart the animation)
 *
 * @example
 * ```tsx
 * useRAFAnimation((timestamp) => {
 *   // Animation logic here
 *   updatePosition(timestamp)
 * }, [dependency])
 * ```
 */
export function useRAFAnimation(
  callback: RAFCallback,
  deps: React.DependencyList = []
): void {
  const requestRef = useRef<number>()
  const callbackRef = useRef(callback)

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const animate = (timestamp: number) => {
      callbackRef.current(timestamp)
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    // Cleanup: cancel animation frame on unmount or deps change
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Animation cycle that returns normalized progress (0-1)
 *
 * @param duration - Cycle duration in seconds
 * @returns Current progress (0-1) within the cycle
 *
 * @example
 * ```tsx
 * const progress = useAnimationCycle(4) // 4 second cycle
 * // progress goes from 0 to 1 over 4 seconds, then repeats
 * ```
 */
export function useAnimationCycle(duration: number): number {
  const progressRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useRAFAnimation((timestamp) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const durationMs = duration * 1000

    // Calculate progress (0-1) with modulo for looping
    progressRef.current = ((elapsed % durationMs) / durationMs)
  }, [duration])

  return progressRef.current
}

/**
 * Staggered entrance animation for multiple elements
 *
 * @param count - Number of elements
 * @param delayBetween - Delay between each element (seconds)
 * @returns Array of visibility states for each element
 *
 * @example
 * ```tsx
 * const visible = useStaggeredEntrance(5, 0.2)
 * // visible[0] = true at 0s
 * // visible[1] = true at 0.2s
 * // visible[2] = true at 0.4s
 * // etc.
 * ```
 */
export function useStaggeredEntrance(
  count: number,
  delayBetween: number
): boolean[] {
  const visibleRef = useRef<boolean[]>(new Array(count).fill(false))
  const startTimeRef = useRef<number | null>(null)

  useRAFAnimation((timestamp) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }

    const elapsed = (timestamp - startTimeRef.current) / 1000 // Convert to seconds

    for (let i = 0; i < count; i++) {
      const elementDelay = i * delayBetween
      if (elapsed >= elementDelay && !visibleRef.current[i]) {
        visibleRef.current[i] = true
      }
    }
  }, [count, delayBetween])

  return visibleRef.current
}

/**
 * Simple easing function: cubic ease-out
 * Used for smooth count-up animations, fades, etc.
 *
 * @param t - Progress (0-1)
 * @returns Eased value (0-1)
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Easing function: sine wave for breathing/pulsing effects
 *
 * @param t - Progress (0-1)
 * @returns Sine value (-1 to 1)
 */
export function easeSine(t: number): number {
  return Math.sin(t * Math.PI * 2)
}

/**
 * Use interval with RAF precision
 * Calls callback at specified interval using requestAnimationFrame
 *
 * @param callback - Function to call at interval
 * @param intervalMs - Interval in milliseconds
 *
 * @example
 * ```tsx
 * useRAFInterval(() => {
 *   fetchData() // Called every 5 seconds
 * }, 5000)
 * ```
 */
export function useRAFInterval(
  callback: () => void,
  intervalMs: number
): void {
  const lastCallRef = useRef<number>(0)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useRAFAnimation((timestamp) => {
    if (timestamp - lastCallRef.current >= intervalMs) {
      callbackRef.current()
      lastCallRef.current = timestamp
    }
  }, [intervalMs])
}

/**
 * Hook for controlled animation state (play/pause)
 *
 * @param duration - Animation duration in seconds
 * @param autoStart - Start animation automatically
 * @returns Control functions and current progress
 */
export function useControlledAnimation(
  duration: number,
  autoStart: boolean = true
) {
  const isPlayingRef = useRef(autoStart)
  const progressRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const pausedAtRef = useRef(0)

  useRAFAnimation((timestamp) => {
    if (!isPlayingRef.current) return

    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp - pausedAtRef.current
    }

    const elapsed = timestamp - startTimeRef.current
    const durationMs = duration * 1000

    progressRef.current = Math.min(elapsed / durationMs, 1)

    // Stop when complete
    if (progressRef.current >= 1) {
      isPlayingRef.current = false
    }
  }, [duration])

  const play = useCallback(() => {
    isPlayingRef.current = true
    startTimeRef.current = null
  }, [])

  const pause = useCallback(() => {
    if (isPlayingRef.current) {
      pausedAtRef.current = progressRef.current * duration * 1000
      isPlayingRef.current = false
    }
  }, [duration])

  const reset = useCallback(() => {
    progressRef.current = 0
    startTimeRef.current = null
    pausedAtRef.current = 0
  }, [])

  const restart = useCallback(() => {
    reset()
    play()
  }, [reset, play])

  return {
    progress: progressRef.current,
    isPlaying: isPlayingRef.current,
    play,
    pause,
    reset,
    restart,
  }
}
