/**
 * Counter Overlay Component
 * Displays animated counters with icon, label, and optional API polling
 * Supports various number formats, layouts, and live data updates
 */

import { useState, useEffect, useMemo, type CSSProperties } from 'react'
import {
  Heart,
  Star,
  Users,
  Eye,
  Zap,
  Flame,
  Trophy,
  Bell,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import { useOverlayParams } from '../../hooks/useOverlayParams'
import { useTheme, useGradient, useFontFamily, useLoadGoogleFont } from '../../hooks/useBrand'
import { useCountUpWithTrend } from '../../hooks/useCountUp'
import { useAPIPolling } from '../../hooks/useAPIPolling'
import { OverlayContainer } from './OverlayContainer'
import { OverlayPanel } from './OverlayPanel'
import { COUNTER_DEFAULTS, API_SERVICES } from '../../types/counter.types'
import type { CounterOverlayParams, CounterIcon } from '../../types/counter.types'
import { createLinearGradient } from '../../utils/css.utils'

/**
 * Icon mapping from parameter to Lucide icon component
 */
const ICON_MAP: Record<CounterIcon, LucideIcon | null> = {
  heart: Heart,
  star: Star,
  users: Users,
  eye: Eye,
  zap: Zap,
  fire: Flame,
  trophy: Trophy,
  bell: Bell,
  none: null,
}

/**
 * Format number with various options
 */
function formatNumber(
  value: number,
  options: {
    separator: boolean
    decimals: number
    abbreviate: boolean
    notation: 'standard' | 'compact' | 'scientific'
  }
): string {
  const { separator, decimals, abbreviate, notation } = options

  // Handle abbreviation (e.g., 1.2K, 3.5M)
  if (abbreviate) {
    const absValue = Math.abs(value)
    if (absValue >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(decimals) + 'B'
    }
    if (absValue >= 1_000_000) {
      return (value / 1_000_000).toFixed(decimals) + 'M'
    }
    if (absValue >= 1_000) {
      return (value / 1_000).toFixed(decimals) + 'K'
    }
  }

  // Use Intl.NumberFormat for standard formatting
  if (notation === 'standard') {
    return new Intl.NumberFormat('en-US', {
      useGrouping: separator,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  // Use compact or scientific notation
  return new Intl.NumberFormat('en-US', {
    notation,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function CounterOverlay() {
  // Parse URL parameters
  const params = useOverlayParams<CounterOverlayParams>(COUNTER_DEFAULTS)

  const theme = useTheme(params.theme)
  const gradient = useGradient(params.gradient, params.colors)
  const fontFamily = useFontFamily(params.font)

  // Load Google Font if needed
  useLoadGoogleFont(params.font)

  // API polling (if service configured)
  const apiConfig = params.service !== 'custom' ? API_SERVICES[params.service] : null
  const { data: apiData } = useAPIPolling({
    config: apiConfig || { url: () => params.poll, path: params.pollkey },
    userId: params.userid,
    apiKey: params.apikey,
    path: params.pollkey,
    interval: params.pollrate,
    enabled:
      (params.service !== 'custom' && !!params.userid && !!apiConfig) ||
      (params.service === 'custom' && !!params.poll),
  })

  // Determine target value (API data or manual value)
  const targetValue = apiData !== null ? Number(apiData) : params.value

  // Count-up animation with trend detection
  const { value: animatedValue, trend } = useCountUpWithTrend(
    targetValue,
    params.duration,
    params.animate
  )

  // Format the number
  const formattedNumber = formatNumber(animatedValue, {
    separator: params.separator,
    decimals: params.decimals,
    abbreviate: params.abbreviate,
    notation: params.notation,
  })

  // Get icon component
  const IconComponent = ICON_MAP[params.icon]

  // Icon color (custom or theme default)
  const iconColor = params.iconcolor || gradient[0]
  const numberColor = params.numbercolor || theme.text

  // Trend indicator color
  const trendColor = params.trendcolor

  // Layout styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: params.layout === 'stack' ? 'column' : 'row',
    alignItems: params.align === 'left' ? 'flex-start' : params.align === 'right' ? 'flex-end' : 'center',
    gap: params.layout === 'stack' ? '8px' : '16px',
    padding: `${params.counterpady}px ${params.counterpadx}px`,
    width: params.width !== 'auto' ? params.width : undefined,
    height: params.height !== 'auto' ? params.height : undefined,
  }

  const numberStyle: CSSProperties = {
    fontSize: `${params.size}px`,
    fontWeight: 700,
    fontFamily,
    color: numberColor,
    lineHeight: 1,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const labelStyle: CSSProperties = {
    fontSize: `${params.labelsize}px`,
    fontWeight: 400,
    fontFamily,
    color: theme.textMuted,
    lineHeight: 1.5,
    margin: 0,
  }

  const content = (
    <div style={containerStyle}>
      {/* Icon */}
      {IconComponent && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent size={params.size * 0.8} color={iconColor} strokeWidth={2} />
        </div>
      )}

      {/* Number and label */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems:
            params.align === 'left' ? 'flex-start' : params.align === 'right' ? 'flex-end' : 'center',
          gap: '4px',
        }}
      >
        <div style={numberStyle}>
          {params.prefix && <span>{params.prefix}</span>}
          <span>{formattedNumber}</span>
          {params.suffix && <span>{params.suffix}</span>}
          {/* Trend indicator */}
          {params.trend && trend !== 'neutral' && (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {trend === 'up' ? (
                <TrendingUp size={params.size * 0.5} color={trendColor} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={params.size * 0.5} color={trendColor} strokeWidth={2.5} />
              )}
            </span>
          )}
        </div>

        {params.label && <p style={labelStyle}>{params.label}</p>}
      </div>
    </div>
  )

  return (
    <OverlayContainer align={params.align} valign="center" showBg={false}>
      {params.bg ? <OverlayPanel>{content}</OverlayPanel> : content}
    </OverlayContainer>
  )
}
