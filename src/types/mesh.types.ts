/**
 * Mesh Background Overlay Parameter Types
 */

import type { MeshAnimation, MeshPalette, MeshBlendMode } from './brand.types'

export interface MeshOverlayParams {
  seed: number
  points: 2 | 3 | 4
  palette: MeshPalette
  animation: MeshAnimation
  speed: number
  blur: number
  scale: number
  opacity: number
  blend: MeshBlendMode
  bg: string
}

export const MESH_DEFAULTS: MeshOverlayParams = {
  seed: 42,
  points: 3,
  palette: 'pastel',
  animation: 'drift',
  speed: 1,
  blur: 100,
  scale: 1,
  opacity: 0.8,
  blend: 'normal',
  bg: '000000',
}
