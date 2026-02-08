/**
 * Text Overlay Route
 * Fullscreen transparent route for the text overlay
 */

import { createFileRoute } from '@tanstack/react-router'
import { TextOverlay } from '../../components/overlays/TextOverlay'

export const Route = createFileRoute('/overlays/text')({
  component: TextOverlayRoute,
})

function TextOverlayRoute() {
  return <TextOverlay />
}
