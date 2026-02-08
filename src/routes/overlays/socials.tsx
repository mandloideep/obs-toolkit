/**
 * Socials Overlay Route
 * Fullscreen transparent route for the social media links overlay
 */

import { createFileRoute } from '@tanstack/react-router'
import { SocialsOverlay } from '../../components/overlays/SocialsOverlay'

export const Route = createFileRoute('/overlays/socials')({
  component: SocialsOverlayRoute,
})

function SocialsOverlayRoute() {
  return <SocialsOverlay />
}
