/**
 * CTA Overlay Route
 * Fullscreen transparent route for the call-to-action overlay
 */

import { createFileRoute } from '@tanstack/react-router'
import { CTAOverlay } from '../../components/overlays/CTAOverlay'

export const Route = createFileRoute('/overlays/cta')({
  component: CTAOverlayRoute,
})

function CTAOverlayRoute() {
  return <CTAOverlay />
}
