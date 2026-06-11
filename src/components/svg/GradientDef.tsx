/**
 * SVG Gradient Definition Component
 * Generates SVG gradient definitions for use in SVG elements
 */

interface GradientDefProps {
  id: string
  colors: string[]
  direction?: number
  type?: 'linear' | 'radial'
}

/**
 * GradientDef Component
 * Creates an SVG gradient definition in <defs>
 *
 * @param id - Unique ID for the gradient (used in url(#id))
 * @param colors - Array of hex color strings
 * @param direction - Gradient direction in degrees (0-360, only for linear)
 * @param type - Gradient type (linear or radial)
 */
export function GradientDef({ id, colors, direction = 90, type = 'linear' }: GradientDefProps) {
  if (type === 'radial') {
    return (
      <defs>
        <radialGradient id={id}>
          {colors.map((color, index) => (
            <stop
              key={index}
              offset={`${(index / (colors.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </radialGradient>
      </defs>
    )
  }

  // Convert direction to x1, y1, x2, y2 coordinates
  const coords = directionToCoords(direction)

  return (
    <defs>
      <linearGradient id={id} {...coords}>
        {colors.map((color, index) => (
          <stop key={index} offset={`${(index / (colors.length - 1)) * 100}%`} stopColor={color} />
        ))}
      </linearGradient>
    </defs>
  )
}

/**
 * Convert angle (degrees) to SVG linear gradient coordinates
 *
 * @param angle - Angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
 * @returns SVG coordinates object
 */
function directionToCoords(angle: number): {
  x1: string
  y1: string
  x2: string
  y2: string
} {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360

  // Convert to radians
  const radians = (normalizedAngle * Math.PI) / 180

  // Calculate endpoint (start is always center: 50%, 50%)
  const x2 = 50 + 50 * Math.cos(radians)
  const y2 = 50 + 50 * Math.sin(radians)

  // Calculate start point (opposite direction)
  const x1 = 100 - x2
  const y1 = 100 - y2

  return {
    x1: `${x1}%`,
    y1: `${y1}%`,
    x2: `${x2}%`,
    y2: `${y2}%`,
  }
}

/**
 * Animated Gradient Definition
 * Creates a gradient that animates through color changes
 */
interface AnimatedGradientDefProps {
  id: string
  colors: string[][]
  duration?: number
}

export function AnimatedGradientDef({ id, colors, duration = 3 }: AnimatedGradientDefProps) {
  if (colors.length === 0) return null

  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
        {colors[0].map((_, stopIndex) => (
          <stop key={stopIndex} offset={`${(stopIndex / (colors[0].length - 1)) * 100}%`}>
            <animate
              attributeName="stop-color"
              values={colors.map((colorSet) => colorSet[stopIndex]).join(';')}
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </stop>
        ))}
      </linearGradient>
    </defs>
  )
}

/**
 * Helper function to create a gradient ID
 * Ensures unique IDs across the application
 */
export function createGradientId(prefix: string = 'gradient'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}
