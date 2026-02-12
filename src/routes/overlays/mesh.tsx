/**
 * Mesh Background Overlay Route
 * Fullscreen transparent route for the mesh background overlay
 */

import { createFileRoute } from '@tanstack/react-router'
import { MeshOverlay } from '../../components/overlays/MeshOverlay'

export const Route = createFileRoute('/overlays/mesh')({
  component: MeshOverlayRoute,
})

function MeshOverlayRoute() {
  return <MeshOverlay />
}
