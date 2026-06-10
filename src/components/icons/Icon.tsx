/**
 * Icon Component
 * Wrapper for Lucide React icons with fallback support
 */

import React from 'react'
import * as LucideIcons from 'lucide-react'
import { CUSTOM_ICONS } from './icon-library'

interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

/**
 * Icon Component
 * Renders Lucide icons or custom SVG fallbacks
 *
 * @param name - Icon name (Lucide icon name or custom icon key)
 * @param size - Icon size in pixels
 * @param color - Icon color (CSS color value)
 * @param strokeWidth - Icon stroke width
 */
export function Icon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}: IconProps) {
  // Try to get Lucide icon
  const LucideIcon = (LucideIcons as any)[toPascalCase(name)]

  if (LucideIcon) {
    return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} className={className} />
  }

  // Fallback to custom icons
  const customIcon = CUSTOM_ICONS[name]

  if (customIcon) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
        dangerouslySetInnerHTML={{ __html: customIcon }}
      />
    )
  }

  // No icon found - render placeholder circle
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

/**
 * Convert kebab-case or snake_case to PascalCase for Lucide icon names
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
