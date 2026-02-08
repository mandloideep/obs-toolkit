/**
 * Border Overlay Route
 * Fullscreen transparent route for the border overlay
 */

import { createFileRoute } from '@tanstack/react-router'
import { BorderOverlay } from '../../components/overlays/BorderOverlay'

export const Route = createFileRoute('/overlays/border')({
  component: BorderOverlayRoute,
})

function BorderOverlayRoute() {
  return <BorderOverlay />
}
