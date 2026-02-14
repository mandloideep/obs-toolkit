/**
 * Overlay Panel Component
 * Customizable background panel with blur, border, shadow, and color
 */

import React, { type CSSProperties } from 'react'
import { useTheme } from '../../hooks/useBrand'
import { hexToCssColor } from '../../utils/color.utils'
import { BG_SHADOW_CSS } from '../../lib/constants'
import type { BgShadow } from '../../types/brand.types'

interface OverlayPanelProps {
  children: React.ReactNode
  padding?: number
  borderRadius?: number
  blur?: number
  className?: string
  bgcolor?: string
  bgopacity?: number
  bgshadow?: BgShadow
}

/**
 * Overlay Panel
 * Theme-aware background panel with customizable glassmorphism effect
 */
export function OverlayPanel({
  children,
  padding = 24,
  borderRadius = 14,
  blur = 12,
  className = '',
  bgcolor = '',
  bgopacity = 0.9,
  bgshadow = 'md',
}: OverlayPanelProps) {
  const theme = useTheme()

  // Build background color with opacity
  let backgroundColor: string
  if (bgcolor) {
    // Custom color: apply opacity
    const cssColor = hexToCssColor(bgcolor)
    if (cssColor.startsWith('rgba')) {
      backgroundColor = cssColor
    } else {
      // Convert hex to rgba with opacity
      const hex = bgcolor.replace('#', '')
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      backgroundColor = `rgba(${r}, ${g}, ${b}, ${bgopacity})`
    }
  } else {
    // Theme surface color with opacity as hex suffix
    const opacityHex = Math.round(bgopacity * 255).toString(16).padStart(2, '0')
    backgroundColor = `${theme.surface}${opacityHex}`
  }

  // Build shadow
  const shadowCss = BG_SHADOW_CSS[bgshadow] || BG_SHADOW_CSS.md
  const borderHighlight = bgshadow !== 'none' ? `, 0 0 0 1px ${theme.border}40` : ''
  const boxShadow = shadowCss === 'none' ? 'none' : `${shadowCss}${borderHighlight}`

  const panelStyle: CSSProperties = {
    backgroundColor,
    border: `1px solid ${theme.border}`,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    boxShadow,
  }

  return (
    <div style={panelStyle} className={className}>
      {children}
    </div>
  )
}
