/**
 * Brand Context
 * Provides global brand configuration throughout the application
 */

import React, { createContext, useContext, useMemo } from 'react'
import type { BrandConfig } from '../types/brand.types'
import { BRAND_CONFIG, deepMerge } from '../config/brand.config'

interface BrandContextValue {
  brand: BrandConfig
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined)

interface BrandProviderProps {
  children: React.ReactNode
  overrides?: Partial<BrandConfig>
}

/**
 * Brand Provider
 * Wraps the application and provides brand configuration via React Context
 *
 * @param overrides - Optional brand configuration overrides for preview/testing
 */
export function BrandProvider({ children, overrides }: BrandProviderProps) {
  const brand = useMemo(() => {
    if (!overrides) return BRAND_CONFIG

    return deepMerge(
      { ...BRAND_CONFIG, ...overrides } as BrandConfig,
      BRAND_CONFIG
    )
  }, [overrides])

  const value = useMemo(
    () => ({
      brand,
    }),
    [brand]
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

/**
 * Hook to access brand context
 * Must be used within a BrandProvider
 */
export function useBrandContext() {
  const context = useContext(BrandContext)

  if (!context) {
    throw new Error('useBrandContext must be used within a BrandProvider')
  }

  return context
}
