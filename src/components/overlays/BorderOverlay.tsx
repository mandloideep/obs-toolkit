/**
 * Border Overlay Component
 * Animated gradient borders for screen/camera frames
 * Migrated from border.html with full feature parity
 */

import React, { useRef, useState, useEffect } from 'react'
import { useOverlayParams } from '../../hooks/useOverlayParams'
import { useGradient, useBrand } from '../../hooks/useBrand'
import { useRAFAnimation } from '../../hooks/useRAFAnimation'
import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { interpolateColor } from '../../utils/css.utils'
import { GradientDef } from '../svg/GradientDef'
import type { BorderOverlayParams } from '../../types/border.types'
import { BORDER_DEFAULTS } from '../../types/border.types'
import type { GradientName } from '../../types/brand.types'

export function BorderOverlay() {
  const params = useOverlayParams<BorderOverlayParams>(BORDER_DEFAULTS)
  const brand = useBrand()

  // Gradient colors with random/custom support
  const baseGradient = useGradient(
    params.gradient,
    params.colors.length > 0 ? params.colors : undefined,
    params.random,
    params.colormode
  )

  // State for dynamic gradient colors (for multicolor/colorshift)
  const [currentGradient, setCurrentGradient] = useState(baseGradient)

  // Track window dimensions for accurate perimeter calculations
  const { width, height } = useWindowDimensions()

  // SVG element ref for animations
  const svgRef = useRef<SVGSVGElement>(null)
  const shapeRef = useRef<SVGRectElement | SVGCircleElement>(null)

  // Calculate perimeter for dash animations based on actual dimensions
  const getPerimeter = (): number => {
    if (params.shape === 'circle') {
      const minDim = Math.min(width, height)
      const radius = (minDim / 2) - params.thickness - 2
      return 2 * Math.PI * radius
    } else {
      const w = width - params.thickness - 4
      const h = height - params.thickness - 4

      // Account for corner radius in perimeter calculation
      if (params.r > 0) {
        // Rounded rectangle: straight edges + arc length
        // Each corner is a quarter-circle arc, 4 corners = full circle
        const straightEdgeLength = 2 * ((w - 2 * params.r) + (h - 2 * params.r))
        const arcLength = 2 * Math.PI * params.r
        return straightEdgeLength + arcLength
      }

      // Sharp corners
      return 2 * (w + h)
    }
  }

  // Dash Animation
  useRAFAnimation(
    (timestamp) => {
      if (params.animation !== 'dash' || !shapeRef.current) return

      const progress = ((timestamp % (params.speed * 1000)) / (params.speed * 1000))
      const perimeter = getPerimeter()
      const offset = -progress * perimeter

      shapeRef.current.style.strokeDashoffset = `${offset}`
    },
    [params.animation, params.speed, params.shape, params.thickness, width, height]
  )

  // Rotate Animation (rotates gradient direction)
  const [gradientRotation, setGradientRotation] = useState(90)
  useRAFAnimation(
    (timestamp) => {
      if (params.animation !== 'rotate') return

      const progress = ((timestamp % (params.speed * 1000)) / (params.speed * 1000))
      setGradientRotation(progress * 360)
    },
    [params.animation, params.speed]
  )

  // Pulse Animation (opacity)
  const [pulseOpacity, setPulseOpacity] = useState(params.opacity)
  useRAFAnimation(
    (timestamp) => {
      if (params.animation !== 'pulse') return

      const progress = ((timestamp % (params.speed * 1000)) / (params.speed * 1000))
      const sine = Math.sin(progress * Math.PI * 2)
      const opacity = 0.3 + (0.7 * ((sine + 1) / 2))
      setPulseOpacity(opacity * params.opacity)
    },
    [params.animation, params.speed, params.opacity]
  )

  // Breathe Animation (glow intensity)
  const [breatheGlow, setBreatheGlow] = useState(params.glowsize)
  useRAFAnimation(
    (timestamp) => {
      if (params.animation !== 'breathe') return

      const progress = ((timestamp % (params.speed * 1000)) / (params.speed * 1000))
      const sine = Math.sin(progress * Math.PI * 2)
      const glow = params.glowsize * (0.5 + 0.5 * ((sine + 1) / 2))
      setBreatheGlow(glow)
    },
    [params.animation, params.speed, params.glowsize]
  )

  // Multicolor Mode (cycle through all gradients)
  useRAFAnimation(
    (timestamp) => {
      if (!params.multicolor) return

      const gradientKeys = Object.keys(brand.gradients) as GradientName[]
      const progress = ((timestamp % (params.speed * 1000)) / (params.speed * 1000))
      const index = Math.floor(progress * gradientKeys.length)
      const nextIndex = (index + 1) % gradientKeys.length

      const localProgress = (progress * gradientKeys.length) % 1
      const currentColors = brand.gradients[gradientKeys[index]]
      const nextColors = brand.gradients[gradientKeys[nextIndex]]

      // Interpolate between current and next gradient
      const interpolated = currentColors.map((color, i) =>
        interpolateColor(color, nextColors[i] || nextColors[0], localProgress)
      )

      setCurrentGradient(interpolated)
    },
    [params.multicolor, params.speed, brand.gradients]
  )

  // Colorshift Mode (smooth transitions between gradients)
  useRAFAnimation(
    (timestamp) => {
      if (!params.colorshift || params.multicolor) return

      const gradientKeys = Object.keys(brand.gradients) as GradientName[]
      const duration = params.shiftspeed * 1000
      const progress = ((timestamp % duration) / duration)
      const index = Math.floor(progress * gradientKeys.length)
      const nextIndex = (index + 1) % gradientKeys.length

      const localProgress = (progress * gradientKeys.length) % 1
      const currentColors = brand.gradients[gradientKeys[index]]
      const nextColors = brand.gradients[gradientKeys[nextIndex]]

      const interpolated = currentColors.map((color, i) =>
        interpolateColor(color, nextColors[i] || nextColors[0], localProgress)
      )

      setCurrentGradient(interpolated)
    },
    [params.colorshift, params.multicolor, params.shiftspeed, brand.gradients]
  )

  // Update gradient when base changes (if not in multicolor/colorshift mode)
  useEffect(() => {
    if (!params.multicolor && !params.colorshift) {
      setCurrentGradient(baseGradient)
    }
  }, [baseGradient, params.multicolor, params.colorshift])

  // Calculate stroke dasharray for different styles
  const getStrokeDasharray = (): string => {
    const perimeter = getPerimeter()

    switch (params.style) {
      case 'dashed':
        return `${perimeter * 0.05} ${perimeter * 0.05}`
      case 'dotted':
        return `${params.thickness} ${params.thickness * 2}`
      case 'solid':
      case 'neon':
      default:
        if (params.animation === 'dash') {
          const visibleLength = perimeter * params.dash
          const invisibleLength = perimeter - visibleLength
          return `${visibleLength} ${invisibleLength}`
        }
        return 'none'
    }
  }

  // Get opacity for main layer
  const getOpacity = (): number => {
    return params.animation === 'pulse' ? pulseOpacity : params.opacity
  }

  // Render the shape with optional stroke width override and gradient ID
  const renderShape = (strokeWidthOverride?: number, isGlowLayer: boolean = false, gradientId: string = 'borderGradient') => {
    const strokeWidth = strokeWidthOverride ?? params.thickness
    const commonProps = {
      ref: isGlowLayer ? undefined : (shapeRef as any),
      fill: 'none',
      stroke: `url(#${gradientId})`,
      strokeWidth: strokeWidth,
      strokeDasharray: getStrokeDasharray(),
      strokeLinecap: (params.style === 'dotted' ? 'round' : 'butt') as any,
    }

    if (params.shape === 'circle') {
      const minDim = Math.min(width, height)
      const radius = (minDim / 2) - params.thickness - 2
      return <circle cx={width / 2} cy={height / 2} r={radius} {...commonProps} />
    }

    // Rectangle - use actual dimensions
    const offset = params.thickness / 2 + 2
    const rectWidth = width - params.thickness - 4
    const rectHeight = height - params.thickness - 4

    // Handle double border style
    if (params.style === 'double') {
      const gap = params.thickness * 3
      const innerOffset = offset + gap
      const innerWidth = rectWidth - gap * 2
      const innerHeight = rectHeight - gap * 2

      return (
        <>
          <rect
            x={offset}
            y={offset}
            width={rectWidth}
            height={rectHeight}
            rx={params.r}
            {...commonProps}
          />
          <rect
            x={innerOffset}
            y={innerOffset}
            width={innerWidth}
            height={innerHeight}
            rx={Math.max(0, params.r - gap)}
            {...commonProps}
          />
        </>
      )
    }

    return (
      <rect
        x={offset}
        y={offset}
        width={rectWidth}
        height={rectHeight}
        rx={params.r}
        {...commonProps}
      />
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Glow Layers - rendered first (behind main layer) */}
      {params.glow && (
        <>
          {/* Primary glow layer */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: params.style === 'neon' ? 0.7 : 0.4,
              filter: `blur(${params.style === 'neon' ? params.glowsize * 2 : params.glowsize}px)`,
            }}
          >
            <GradientDef
              id="glowGradient"
              colors={currentGradient}
              direction={params.animation === 'rotate' ? gradientRotation : 90}
            />
            {renderShape(params.style === 'neon' ? params.thickness * 3 : params.thickness, true, 'glowGradient')}
          </svg>

          {/* Extra glow layer for neon style */}
          {params.style === 'neon' && (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0.3,
                filter: `blur(${params.glowsize * 4}px)`,
              }}
            >
              <GradientDef
                id="glowGradient2"
                colors={currentGradient}
                direction={params.animation === 'rotate' ? gradientRotation : 90}
              />
              {renderShape(params.thickness * 5, true, 'glowGradient2')}
            </svg>
          )}
        </>
      )}

      {/* Main border layer - rendered last (on top) */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: getOpacity(),
        }}
      >
        <GradientDef
          id="borderGradient"
          colors={currentGradient}
          direction={params.animation === 'rotate' ? gradientRotation : 90}
        />
        {renderShape()}
      </svg>
    </div>
  )
}
