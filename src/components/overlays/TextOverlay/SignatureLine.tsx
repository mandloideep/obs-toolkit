/**
 * Signature Line Component
 * Decorative line element for text overlays with various styles and animations
 */

import React, { type CSSProperties } from 'react'
import type { LineStyle, LineAnimation } from '../../../types/brand.types'
import { createLinearGradient } from '../../../utils/css.utils'

interface SignatureLineProps {
  style: LineStyle
  animation: LineAnimation
  length: number
  width: number
  speed: number
  gradient: string[]
  className?: string
}

/**
 * SignatureLine Component
 * Renders a decorative line with configurable style and animation
 *
 * @param style - Line style (solid, dashed, dotted, gradient, slant, wave, swirl, bracket)
 * @param animation - Animation type (slide, grow, pulse, none)
 * @param length - Line width as percentage (0-100)
 * @param width - Line thickness in pixels
 * @param speed - Animation duration in seconds
 * @param gradient - Gradient colors array
 */
export function SignatureLine({
  style,
  animation,
  length,
  width,
  speed,
  gradient,
  className = '',
}: SignatureLineProps) {
  const getLineStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      width: `${length}%`,
      height: `${width}px`,
      margin: '8px 0',
    }

    // Animation styles
    if (animation !== 'none') {
      baseStyle.transition = `all ${speed}s cubic-bezier(0.4, 0, 0.2, 1)`
    }

    switch (style) {
      case 'solid':
        return {
          ...baseStyle,
          backgroundColor: gradient[0],
          ...getAnimationStyle(animation, speed),
        }

      case 'dashed':
        return {
          ...baseStyle,
          borderTop: `${width}px dashed ${gradient[0]}`,
          height: 0,
          ...getAnimationStyle(animation, speed),
        }

      case 'dotted':
        return {
          ...baseStyle,
          borderTop: `${width}px dotted ${gradient[0]}`,
          height: 0,
          ...getAnimationStyle(animation, speed),
        }

      case 'gradient':
        return {
          ...baseStyle,
          background: createLinearGradient(gradient, 90),
          ...getAnimationStyle(animation, speed),
        }

      case 'slant':
      case 'wave':
      case 'swirl':
      case 'bracket':
        // These will be rendered as SVG
        return baseStyle

      default:
        return baseStyle
    }
  }

  // Render SVG-based line styles
  if (['slant', 'wave', 'swirl', 'bracket'].includes(style)) {
    return (
      <div
        className={className}
        style={{ width: `${length}%`, height: `${width * 4}px`, margin: '8px 0' }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          style={getAnimationStyle(animation, speed)}
        >
          <defs>
            <linearGradient id={`lineGradient-${style}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradient.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index / (gradient.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>

          {style === 'slant' && (
            <line
              x1="0"
              y1="8"
              x2="100"
              y2="2"
              stroke={`url(#lineGradient-${style})`}
              strokeWidth={width / 2}
              strokeLinecap="round"
            />
          )}

          {style === 'wave' && (
            <path
              d="M 0 5 Q 25 2, 50 5 T 100 5"
              fill="none"
              stroke={`url(#lineGradient-${style})`}
              strokeWidth={width / 2}
              strokeLinecap="round"
            />
          )}

          {style === 'swirl' && (
            <path
              d="M 0 5 C 20 2, 30 8, 50 5 C 70 2, 80 8, 100 5"
              fill="none"
              stroke={`url(#lineGradient-${style})`}
              strokeWidth={width / 2}
              strokeLinecap="round"
            />
          )}

          {style === 'bracket' && (
            <>
              <path
                d="M 0 5 L 10 2"
                stroke={`url(#lineGradient-${style})`}
                strokeWidth={width / 2}
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="2"
                x2="90"
                y2="2"
                stroke={`url(#lineGradient-${style})`}
                strokeWidth={width / 2}
              />
              <path
                d="M 90 2 L 100 5"
                stroke={`url(#lineGradient-${style})`}
                strokeWidth={width / 2}
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </div>
    )
  }

  // Render standard line styles
  return <div className={className} style={getLineStyle()} />
}

/**
 * Get animation style based on animation type
 */
function getAnimationStyle(
  animation: LineAnimation,
  speed: number
): CSSProperties {
  switch (animation) {
    case 'slide':
      return {
        animation: `lineSlide ${speed}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
      }

    case 'grow':
      return {
        animation: `lineGrow ${speed}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
      }

    case 'pulse':
      return {
        animation: `linePulse ${speed}s ease-in-out infinite`,
      }

    case 'none':
    default:
      return {}
  }
}

// Export CSS keyframes for animations
export const lineAnimationStyles = `
@keyframes lineSlide {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes lineGrow {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes linePulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
`
