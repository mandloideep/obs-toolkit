import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()

  // Hide header for overlay routes (transparent fullscreen overlays)
  const isOverlayRoute = location.pathname.startsWith('/overlays/')

  return (
    <>
      {!isOverlayRoute && <Header />}
      <Outlet />
      {import.meta.env.DEV && !isOverlayRoute && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  )
}
