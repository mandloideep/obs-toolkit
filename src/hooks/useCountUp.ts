/**
 * Count Up Animation Hook
 * Smoothly animates a number from current value to target value
 */

import { useState, useEffect, useRef } from 'react'

/**
 * Cubic ease-out easing function
 * Starts fast, slows down at the end for natural number counting
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * useCountUp Hook
 * Animates a number from its current value to a target value over a specified duration
 *
 * @param target - The target number to count up to
 * @param duration - Animation duration in seconds (default: 2)
 * @param enabled - Whether animation is enabled (default: true)
 * @returns The current animated value
 *
 * @example
 * const count = useCountUp(1000, 2) // Animates from 0 to 1000 over 2 seconds
 */
export function useCountUp(target: number, duration: number = 2, enabled: boolean = true): number {
  const [currentValue, setCurrentValue] = useState(target)
  const animationRef = useRef<number | undefined>(undefined)
  const startValueRef = useRef(target)
  const startTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // If animation disabled, jump to target immediately
    if (!enabled) {
      setCurrentValue(target)
      return
    }

    // If target hasn't changed, no need to animate
    if (Math.abs(currentValue - target) < 0.01) {
      return
    }

    // Store starting value and reset start time
    startValueRef.current = currentValue
    startTimeRef.current = undefined

    // Animation loop
    const animate = (timestamp: number) => {
      // Initialize start time on first frame
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      // Calculate elapsed time and progress (0 to 1)
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // Apply easing
      const easedProgress = easeOutCubic(progress)

      // Calculate current value
      const start = startValueRef.current
      const value = start + (target - start) * easedProgress

      setCurrentValue(value)

      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Ensure we end exactly at target
        setCurrentValue(target)
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [target, duration, enabled])

  return currentValue
}

/**
 * useCountUpWithTrend Hook
 * Count-up animation with trend detection (up/down/neutral)
 *
 * @param target - The target number to count up to
 * @param duration - Animation duration in seconds
 * @param enabled - Whether animation is enabled
 * @returns Object with current value and trend direction
 *
 * @example
 * const { value, trend } = useCountUpWithTrend(1500, 2)
 * // trend: 'up' | 'down' | 'neutral'
 */
export function useCountUpWithTrend(
  target: number,
  duration: number = 2,
  enabled: boolean = true
): { value: number; trend: 'up' | 'down' | 'neutral' } {
  const value = useCountUp(target, duration, enabled)
  const prevTargetRef = useRef(target)
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral')

  useEffect(() => {
    const prev = prevTargetRef.current
    const diff = target - prev

    if (Math.abs(diff) < 0.01) {
      setTrend('neutral')
    } else if (diff > 0) {
      setTrend('up')
    } else {
      setTrend('down')
    }

    prevTargetRef.current = target
  }, [target])

  return { value, trend }
}
