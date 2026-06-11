/**
 * API Polling Hook
 * Fetches data from external APIs at regular intervals
 * Supports YouTube, Twitch, GitHub, and custom endpoints
 */

import { useState, useEffect, useRef } from 'react'
import type { APIServiceConfig } from '../types/counter.types'

/**
 * Poll state interface
 */
interface PollState<T = any> {
  data: T | null
  error: string | null
  loading: boolean
}

/**
 * API polling hook options
 */
interface UseAPIPollingOptions {
  /** API service configuration */
  config: APIServiceConfig
  /** User ID or username for the service */
  userId: string
  /** API key or token (optional) */
  apiKey?: string
  /** JSON path to extract value from response (e.g., 'items.0.statistics.subscriberCount') */
  path: string
  /** Poll interval in seconds */
  interval: number
  /** Whether polling is enabled */
  enabled?: boolean
}

/**
 * Navigate nested JSON object using dot notation path
 *
 * @param obj - The object to navigate
 * @param path - Dot notation path (e.g., 'items.0.statistics.subscriberCount')
 * @returns The value at the path, or null if not found
 *
 * @example
 * const data = { items: [{ statistics: { subscriberCount: '1000' } }] }
 * getNestedValue(data, 'items.0.statistics.subscriberCount') // '1000'
 */
function getNestedValue(obj: any, path: string): any {
  try {
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return null
      return current[key]
    }, obj)
  } catch (error) {
    return null
  }
}

/**
 * useAPIPolling Hook
 * Polls an API endpoint at regular intervals and extracts data using JSON path
 *
 * @param options - Polling configuration
 * @returns Poll state with data, error, and loading status
 *
 * @example
 * const { data, error, loading } = useAPIPolling({
 *   config: API_SERVICES.youtube,
 *   userId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
 *   apiKey: 'YOUR_API_KEY',
 *   path: 'items.0.statistics.subscriberCount',
 *   interval: 30,
 *   enabled: true
 * })
 */
export function useAPIPolling<T = any>(options: UseAPIPollingOptions): PollState<T> {
  const { config, userId, apiKey, path, interval, enabled = true } = options

  const [state, setState] = useState<PollState<T>>({
    data: null,
    error: null,
    loading: true,
  })

  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const abortControllerRef = useRef<AbortController | undefined>(undefined)

  // Fetch function
  const fetchData = async () => {
    // Skip if not enabled or missing required params
    if (!enabled || !userId) {
      setState({ data: null, error: null, loading: false })
      return
    }

    try {
      // Create abort controller for fetch cancellation
      abortControllerRef.current = new AbortController()

      // Build URL
      const url = config.url(userId, apiKey)

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...config.headers,
      }

      // For Twitch, set Client-ID header from apiKey
      if (config.headers?.['Client-ID'] !== undefined && apiKey) {
        headers['Client-ID'] = apiKey
      }

      // Fetch data
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const json = await response.json()

      // Extract value using JSON path
      const value = getNestedValue(json, path || config.path)

      if (value === null || value === undefined) {
        throw new Error(`Could not find value at path: ${path || config.path}`)
      }

      // Parse numeric values
      const parsedValue = typeof value === 'string' ? parseFloat(value) : value

      setState({
        data: parsedValue as T,
        error: null,
        loading: false,
      })
    } catch (error: any) {
      // Ignore abort errors (from cleanup)
      if (error.name === 'AbortError') {
        return
      }

      setState({
        data: null,
        error: error.message || 'Failed to fetch data',
        loading: false,
      })
    }
  }

  useEffect(() => {
    // Skip if not enabled
    if (!enabled) {
      setState({ data: null, error: null, loading: false })
      return
    }

    // Initial fetch
    fetchData()

    // Set up polling interval (convert seconds to milliseconds)
    if (interval > 0) {
      intervalRef.current = setInterval(fetchData, interval * 1000)
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [enabled, userId, apiKey, path, interval])

  return state
}

/**
 * useCustomPoll Hook
 * Polls a custom URL endpoint with configurable path extraction
 *
 * @param url - The URL to poll
 * @param path - JSON path to extract value (dot notation)
 * @param interval - Poll interval in seconds
 * @param enabled - Whether polling is enabled
 * @returns Poll state
 *
 * @example
 * const { data } = useCustomPoll(
 *   'https://api.example.com/stats',
 *   'data.followers',
 *   60
 * )
 */
export function useCustomPoll<T = any>(
  url: string,
  path: string = 'value',
  interval: number = 30,
  enabled: boolean = true
): PollState<T> {
  const customConfig: APIServiceConfig = {
    url: () => url,
    path,
  }

  return useAPIPolling<T>({
    config: customConfig,
    userId: '', // Not needed for custom URLs
    path,
    interval,
    enabled,
  })
}
