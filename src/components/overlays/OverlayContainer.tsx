/**
 * Overlay Container Component
 * Provides positioning and layout for all overlay components
 */

import React, { useEffect, type CSSProperties } from 'react'
import type { HorizontalAlign, VerticalAlign } from '../../types/brand.types'
import { useTheme } from '../../hooks/useBrand'
import { setCSSVars } from '../../utils/css.utils'

interface OverlayContainerProps {
  children: React.ReactNode
  showBg?: boolean
  padding?: number
  align?: HorizontalAlign
  valign?: VerticalAlign
  className?: string
}

/**
 * Overlay Container
 * Handles absolute positioning with flex alignment
 * Provides background panel and theme CSS variables
 *
 * @param showBg - Show background panel
 * @param padding - Uniform padding in pixels
 * @param align - Horizontal alignment (left, center, right)
 * @param valign - Vertical alignment (top, center, bottom)
 */
export function OverlayContainer({
  children,
  showBg: _showBg = false,
  padding = 0,
  align = 'center',
  valign = 'center',
  className = '',
}: OverlayContainerProps) {
  const theme = useTheme()

  // Inject theme CSS variables on mount/update
  useEffect(() => {
    setCSSVars({
      'theme-bg': theme.bg,
      'theme-bg-alt': theme.bgAlt,
      'theme-surface': theme.surface,
      'theme-border': theme.border,
      'theme-text': theme.text,
      'theme-text-muted': theme.textMuted,
      'theme-text-dim': theme.textDim,
    })
  }, [theme])

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: getVerticalAlignment(valign),
    justifyContent: getHorizontalAlignment(align),
    padding: padding > 0 ? `${padding}px` : 0,
    pointerEvents: 'none', // Make container transparent to clicks
    zIndex: 9999,
  }

  const contentStyle: CSSProperties = {
    pointerEvents: 'auto', // Re-enable pointer events for content
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={contentStyle}>{children}</div>
    </div>
  )
}

/**
 * Convert horizontal alignment to flex justify-content
 */
function getHorizontalAlignment(align: HorizontalAlign): string {
  switch (align) {
    case 'left':
      return 'flex-start'
    case 'right':
      return 'flex-end'
    case 'center':
    default:
      return 'center'
  }
}

/**
 * Convert vertical alignment to flex align-items
 */
function getVerticalAlignment(valign: VerticalAlign): string {
  switch (valign) {
    case 'top':
      return 'flex-start'
    case 'bottom':
      return 'flex-end'
    case 'center':
    default:
      return 'center'
  }
}
