/**
 * Socials Overlay Component
 * Social media links with icons, handles, and flexible animation modes
 * Supports standard display, loop mode, and one-by-one cycling
 */

import { useState, useEffect, useMemo, type CSSProperties } from 'react'
import { useOverlayParams } from '../../hooks/useOverlayParams'
import { useTheme, useGradient, useBrand, useFontFamily, useLoadGoogleFont } from '../../hooks/useBrand'
import { OverlayPanel } from './OverlayPanel'
import { PLATFORMS } from '../../config/platform-icons'
import { SOCIALS_DEFAULTS, SIZE_MAP } from '../../types/socials.types'
import type { SocialsOverlayParams } from '../../types/socials.types'
import type { SocialPlatform } from '../../types/brand.types'

type AnimationMode = 'idle' | 'entering' | 'visible' | 'exiting'

interface SocialItem {
  platform: SocialPlatform
  handle: string
  visible: boolean
}

export function SocialsOverlay() {
  // Parse URL parameters
  const params = useOverlayParams<SocialsOverlayParams>(SOCIALS_DEFAULTS)

  const brand = useBrand()
  const theme = useTheme(params.theme)
  const gradient = useGradient(params.gradient, params.colors)
  const fontFamily = useFontFamily(params.font)

  // Load Google Font if needed
  useLoadGoogleFont(params.font)

  // Parse handles override
  const handleOverrides = useMemo(() => {
    const overrides: Record<string, string> = {}
    if (params.handles) {
      params.handles.split(',').forEach((item) => {
        const [platform, handle] = item.split(':')
        if (platform && handle) {
          overrides[platform.trim()] = handle.trim()
        }
      })
    }
    return overrides
  }, [params.handles])

  // Parse icon overrides
  const iconOverrides = useMemo(() => {
    const overrides: Record<string, string> = {}
    if (params.icons) {
      params.icons.split(',').forEach((item) => {
        const [platform, iconName] = item.split(':')
        if (platform && iconName) {
          overrides[platform.trim()] = iconName.trim()
        }
      })
    }
    return overrides
  }, [params.icons])

  // Determine which platforms to show
  const platforms = useMemo(() => {
    let platformList: SocialPlatform[]

    if (params.show) {
      // Use explicit show list
      platformList = params.show
        .split(',')
        .map((p) => p.trim() as SocialPlatform)
        .filter((p) => PLATFORMS[p])
    } else {
      // Use platforms from brand config
      platformList = Object.keys(brand.socials)
        .filter((key) => brand.socials[key as SocialPlatform])
        .filter((key) => PLATFORMS[key as SocialPlatform]) as SocialPlatform[]
    }

    // Apply priority ordering if specified
    if (params.order === 'priority' && params.priority) {
      const priorityMap: Record<string, number> = {}
      params.priority.split(',').forEach((item) => {
        const [platform, rank] = item.split(':')
        if (platform && rank) {
          priorityMap[platform.trim()] = parseInt(rank)
        }
      })

      platformList.sort((a, b) => {
        const rankA = priorityMap[a] || 999
        const rankB = priorityMap[b] || 999
        return rankA - rankB
      })
    }

    return platformList
  }, [params.show, params.order, params.priority, brand.socials])

  // Social items state
  const [items, setItems] = useState<SocialItem[]>(() =>
    platforms.map((platform) => ({
      platform,
      handle: handleOverrides[platform] || brand.socials[platform] || platform,
      visible: false,
    }))
  )

  const [animationMode, setAnimationMode] = useState<AnimationMode>('entering')
  const [oneByOneIndex, setOneByOneIndex] = useState(0)

  // Size configuration
  const iconSize = params.iconsize || SIZE_MAP[params.size].icon
  const handleSize = params.fontsize || SIZE_MAP[params.size].handle
  const finalGap = params.spacing || params.gap

  // Get icon color for a platform
  const getIconColor = (platform: SocialPlatform, index: number): string => {
    switch (params.iconcolor) {
      case 'platform':
        return PLATFORMS[platform].color
      case 'white':
        return '#ffffff'
      case 'gradient':
        return gradient[index % gradient.length]
      default: // 'brand'
        return gradient[0]
    }
  }

  // Standard mode: show all with optional stagger
  useEffect(() => {
    if (params.onebyone || params.loop) return

    const timer = setTimeout(() => {
      setAnimationMode('visible')

      if (params.entrance === 'stagger') {
        // Stagger animation
        items.forEach((_, index) => {
          setTimeout(() => {
            setItems((prev) =>
              prev.map((item, i) => (i === index ? { ...item, visible: true } : item))
            )
          }, index * 150)
        })
      } else {
        // Show all at once
        setItems((prev) => prev.map((item) => ({ ...item, visible: true })))
      }
    }, params.delay * 1000)

    return () => clearTimeout(timer)
  }, [params.onebyone, params.loop, params.entrance, params.delay])

  // Loop mode: show all → hold → hide → pause → repeat
  useEffect(() => {
    if (!params.loop || params.onebyone) return

    let timer: NodeJS.Timeout

    const showAll = () => {
      setAnimationMode('visible')
      items.forEach((_, index) => {
        setTimeout(() => {
          setItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, visible: true } : item))
          )
        }, params.entrance === 'stagger' ? index * 150 : 0)
      })
    }

    const hideAll = () => {
      setAnimationMode('exiting')
      items.forEach((_, index) => {
        setTimeout(() => {
          setItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, visible: false } : item))
          )
        }, index * 80)
      })
    }

    const loopCycle = () => {
      showAll()
      timer = setTimeout(() => {
        hideAll()
        timer = setTimeout(loopCycle, params.pause * 1000 + items.length * 80)
      }, (params.hold + params.delay + (params.entrance === 'stagger' ? items.length * 0.15 : 0)) * 1000)
    }

    loopCycle()

    return () => clearTimeout(timer)
  }, [params.loop, params.onebyone, params.hold, params.pause, params.delay, params.entrance, items.length])

  // One-by-one mode: show each social one at a time
  useEffect(() => {
    if (!params.onebyone) return

    let timer: NodeJS.Timeout

    const showNext = () => {
      // Hide all
      setItems((prev) => prev.map((item) => ({ ...item, visible: false })))

      // Show current
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item, i) => (i === oneByOneIndex ? { ...item, visible: true } : item))
        )

        // Schedule next
        timer = setTimeout(() => {
          setOneByOneIndex((prev) => (prev + 1) % items.length)
        }, params.each * 1000 + params.eachpause * 1000)
      }, 300)
    }

    timer = setTimeout(showNext, params.delay * 1000)

    return () => clearTimeout(timer)
  }, [params.onebyone, params.each, params.eachpause, params.delay, oneByOneIndex, items.length])

  // Container styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: params.layout === 'vertical' ? 'column' : 'row',
    alignItems: params.layout === 'vertical' ? 'flex-start' : 'center',
    gap: `${finalGap}px`,
    padding: params.iconpadding ? `${params.iconpadding}px` : '16px',
    borderRadius: `${params.borderradius}px`,
  }

  const itemStyle = (visible: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: 'all 0.4s ease-out',
  })

  const iconStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }

  const handleStyle: CSSProperties = {
    color: theme.text,
    fontFamily,
    fontSize: `${handleSize}px`,
    fontWeight: params.fontweight,
    letterSpacing: `${params.letterspacing}px`,
    whiteSpace: 'nowrap',
    margin: 0,
  }

  const content = (
    <div style={containerStyle}>
      {items.map((item, index) => {
        const platformConfig = PLATFORMS[item.platform]
        const iconColor = getIconColor(item.platform, index)

        return (
          <div key={item.platform} style={itemStyle(item.visible)}>
            {/* Icon */}
            <div
              style={iconStyle}
              dangerouslySetInnerHTML={{
                __html: platformConfig.icon.replace(
                  'fill="currentColor"',
                  `fill="${iconColor}" width="${iconSize}" height="${iconSize}"`
                ),
              }}
            />

            {/* Handle */}
            {params.showtext && (
              <span style={handleStyle}>
                {platformConfig.prefix}
                {item.handle}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '20px',
        pointerEvents: 'none',
      }}
    >
      {params.bg ? <OverlayPanel>{content}</OverlayPanel> : content}
    </div>
  )
}
