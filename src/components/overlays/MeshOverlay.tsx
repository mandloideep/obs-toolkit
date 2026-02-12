/**
 * Mesh Background Overlay
 * Canvas-based mesh gradient using inverse distance weighted color interpolation.
 * Renders to a small canvas (64x64) and lets the browser's bilinear scaling
 * produce the smooth, full-screen gradient — same technique as mesh gradient tools.
 * Deterministic: same seed always produces the same visual output.
 */

import { useRef, useMemo, useCallback } from 'react'
import { useOverlayParams } from '../../hooks/useOverlayParams'
import { useRAFAnimation } from '../../hooks/useRAFAnimation'
import { createSeededRandom, seededFloat } from '../../lib/seededRandom'
import {
  MESH_PALETTE_DEFINITIONS,
  generatePaletteColors,
} from '../../lib/meshPalettes'
import type { RGBColor } from '../../lib/meshPalettes'
import type { MeshOverlayParams } from '../../types/mesh.types'
import { MESH_DEFAULTS } from '../../types/mesh.types'

const RESOLUTION = 64

interface ControlPoint {
  // Base position (normalized 0-1)
  baseX: number
  baseY: number
  // Color
  color: RGBColor
  // Animation params
  angle: number
  radius: number
  driftVx: number
  driftVy: number
  breathePhase: number
  waveFreq: number
  wavePhase: number
  orbitSpeed: number
}

export function MeshOverlay() {
  const params = useOverlayParams<MeshOverlayParams>(MESH_DEFAULTS)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageDataRef = useRef<ImageData | null>(null)
  const pointsRef = useRef<ControlPoint[]>([])

  // Pre-allocate reusable arrays for animated positions (avoid GC in animation loop)
  const animatedX = useRef<Float64Array>(new Float64Array(4))
  const animatedY = useRef<Float64Array>(new Float64Array(4))

  // Generate deterministic control points from seed
  const controlPoints = useMemo(() => {
    const rng = createSeededRandom(params.seed)
    const paletteDef = MESH_PALETTE_DEFINITIONS[params.palette]
    if (!paletteDef) return []

    const colors = generatePaletteColors(paletteDef, params.points, rng)

    // Place points in evenly-spaced sectors around the center
    const angleStep = (Math.PI * 2) / params.points
    const baseAngle = seededFloat(rng, 0, Math.PI * 2)
    // Scale controls how far from center the points are placed (0-1 normalized)
    const spreadDist = 0.15 + params.scale * 0.2

    const points: ControlPoint[] = Array.from(
      { length: params.points },
      (_, i) => {
        const sectorAngle = baseAngle + angleStep * i
        const dist = seededFloat(rng, spreadDist * 0.6, spreadDist)
        return {
          baseX: 0.5 + Math.cos(sectorAngle) * dist,
          baseY: 0.5 + Math.sin(sectorAngle) * dist,
          color: colors[i],
          angle: seededFloat(rng, 0, Math.PI * 2),
          radius: seededFloat(rng, 0.08, 0.25),
          driftVx: seededFloat(rng, -1, 1),
          driftVy: seededFloat(rng, -1, 1),
          breathePhase: seededFloat(rng, 0, Math.PI * 2),
          waveFreq: seededFloat(rng, 0.3, 0.8),
          wavePhase: seededFloat(rng, 0, Math.PI * 2),
          orbitSpeed:
            seededFloat(rng, 0.3, 0.8) * (rng() > 0.5 ? 1 : -1),
        }
      }
    )

    pointsRef.current = points

    // Ensure animated position arrays are large enough
    if (animatedX.current.length < params.points) {
      animatedX.current = new Float64Array(params.points)
      animatedY.current = new Float64Array(params.points)
    }

    return points
  }, [params.seed, params.points, params.palette, params.scale])

  // Render the mesh gradient to canvas using inverse distance weighting
  const renderMesh = useCallback(
    (posX: Float64Array, posY: Float64Array) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      // Reuse ImageData to avoid allocation per frame
      if (
        !imageDataRef.current ||
        imageDataRef.current.width !== RESOLUTION
      ) {
        imageDataRef.current = ctx.createImageData(RESOLUTION, RESOLUTION)
      }

      const data = imageDataRef.current.data
      const points = pointsRef.current
      const numPoints = points.length

      // Interpolation power: blur controls smoothness
      // Low blur (20) → power 3.0 (distinct regions)
      // High blur (200) → power 1.2 (very smooth blending)
      const power = 3.0 - ((params.blur - 20) / (200 - 20)) * 1.8

      for (let py = 0; py < RESOLUTION; py++) {
        const ny = py / (RESOLUTION - 1)
        for (let px = 0; px < RESOLUTION; px++) {
          const nx = px / (RESOLUTION - 1)

          let totalWeight = 0
          let r = 0
          let g = 0
          let b = 0

          for (let i = 0; i < numPoints; i++) {
            const dx = nx - posX[i]
            const dy = ny - posY[i]
            const distSq = dx * dx + dy * dy
            // Inverse distance weighting: weight = 1 / (dist^power + epsilon)
            const weight = 1 / (Math.pow(distSq, power * 0.5) + 0.00001)
            totalWeight += weight
            r += points[i].color.r * weight
            g += points[i].color.g * weight
            b += points[i].color.b * weight
          }

          const offset = (py * RESOLUTION + px) * 4
          data[offset] = r / totalWeight
          data[offset + 1] = g / totalWeight
          data[offset + 2] = b / totalWeight
          data[offset + 3] = 255
        }
      }

      ctx.putImageData(imageDataRef.current, 0, 0)
    },
    [params.blur]
  )

  // Initial render for static mode
  useMemo(() => {
    if (controlPoints.length === 0) return
    // Set initial positions
    for (let i = 0; i < controlPoints.length; i++) {
      animatedX.current[i] = controlPoints[i].baseX
      animatedY.current[i] = controlPoints[i].baseY
    }
    // Render after next paint (canvas needs to be mounted)
    requestAnimationFrame(() => renderMesh(animatedX.current, animatedY.current))
  }, [controlPoints, renderMesh])

  // Animation loop
  useRAFAnimation(
    (timestamp) => {
      const points = pointsRef.current
      if (points.length === 0) return

      if (params.animation === 'none') {
        // Static: just render at base positions (only on first frame)
        return
      }

      const t = timestamp * 0.001 * params.speed

      for (let i = 0; i < points.length; i++) {
        const pt = points[i]
        let x = pt.baseX
        let y = pt.baseY

        switch (params.animation) {
          case 'drift': {
            x += Math.sin(t * pt.driftVx * 0.3 + pt.angle) * 0.15
            y += Math.cos(t * pt.driftVy * 0.3 + pt.breathePhase) * 0.15
            break
          }
          case 'orbit': {
            x = 0.5 + Math.cos(t * pt.orbitSpeed + pt.angle) * pt.radius
            y = 0.5 + Math.sin(t * pt.orbitSpeed + pt.angle) * pt.radius
            break
          }
          case 'breathe': {
            const scale = 1 + 0.3 * Math.sin(t * 0.5 + pt.breathePhase)
            x = 0.5 + (pt.baseX - 0.5) * scale
            y = 0.5 + (pt.baseY - 0.5) * scale
            x += Math.sin(t * 0.2 + pt.angle) * 0.03
            y += Math.cos(t * 0.15 + pt.breathePhase) * 0.03
            break
          }
          case 'wave': {
            x += Math.sin(t * pt.waveFreq + pt.wavePhase) * 0.12
            y += Math.cos(t * pt.waveFreq * 0.7 + pt.wavePhase) * 0.08
            break
          }
        }

        animatedX.current[i] = x
        animatedY.current[i] = y
      }

      renderMesh(animatedX.current, animatedY.current)
    },
    [params.animation, params.speed, renderMesh]
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: `#${params.bg}`,
      }}
    >
      <canvas
        ref={canvasRef}
        width={RESOLUTION}
        height={RESOLUTION}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: params.opacity,
          mixBlendMode: params.blend,
          // Browser bilinear interpolation smooths the 64x64 → fullscreen scaling
          imageRendering: 'auto',
        }}
      />
    </div>
  )
}
