/**
 * CTA Overlay Component
 * Call-to-action overlay with animated icons, text, and decorations
 * Supports presets, loop mode, and customizable styling
 */

import { useState, useEffect, useMemo, type CSSProperties } from 'react'
import { ThumbsUp, Bell, Share2, Heart, Star, UserPlus, Youtube } from 'lucide-react'
import { useOverlayParams } from '../../hooks/useOverlayParams'
import { useTheme, useGradient, useFontFamily, useLoadGoogleFont } from '../../hooks/useBrand'
import { EntranceAnimation } from '../animations/EntranceAnimation'
import { ExitAnimation, useDelayedExit } from '../animations/ExitAnimation'
import { OverlayContainer } from './OverlayContainer'
import { OverlayPanel } from './OverlayPanel'
import { CTA_PRESETS } from '../../config/cta-presets'
import { CTA_DEFAULTS } from '../../types/cta.types'
import type { CTAOverlayParams } from '../../types/cta.types'
import type { IconAnimation, LoopState } from '../../types/brand.types'
import { createLinearGradient } from '../../utils/css.utils'

/**
 * Icon mapping from parameter to Lucide icon component
 */
const CTA_ICON_MAP: Record<string, React.FC<any>> = {
  like: ThumbsUp,
  sub: Youtube,
  bell: Bell,
  share: Share2,
  heart: Heart,
  star: Star,
  follow: UserPlus,
}

/**
 * Get icon animation CSS class
 */
function getIconAnimationClass(animation: IconAnimation): string {
  return animation !== 'none' ? `cta-icon-${animation}` : ''
}

/**
 * Icon animation keyframes (injected into document head)
 */
const iconAnimationStyles = `
@keyframes ctaIconBounce {
  0% { transform: scale(0.3); }
  50% { transform: scale(1.3); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes ctaIconShake {
  0% { transform: rotate(0); }
  25% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0); }
}

@keyframes ctaIconPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
}

@keyframes ctaIconSpin {
  0% { transform: rotateY(0); }
  100% { transform: rotateY(360deg); }
}

@keyframes ctaIconWiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

@keyframes ctaIconFlip {
  0% { transform: rotateX(0); }
  50% { transform: rotateX(180deg); }
  100% { transform: rotateX(360deg); }
}

@keyframes ctaIconHeartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.2); }
  28% { transform: scale(1); }
  42% { transform: scale(1.2); }
  70% { transform: scale(1); }
}

.cta-icon-bounce { animation: ctaIconBounce 0.6s ease-out 0.4s both; }
.cta-icon-shake { animation: ctaIconShake 0.5s ease-out 0.4s both; }
.cta-icon-pulse { animation: ctaIconPulse 1.5s ease-in-out infinite; }
.cta-icon-spin { animation: ctaIconSpin 0.8s ease-out 0.4s both; }
.cta-icon-wiggle { animation: ctaIconWiggle 0.5s ease-in-out 0.4s both; }
.cta-icon-flip { animation: ctaIconFlip 0.6s ease-out 0.4s both; }
.cta-icon-heartbeat { animation: ctaIconHeartbeat 1.2s ease-in-out infinite; }

@keyframes ctaDecoLineGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes ctaDecoSlantSlide {
  from { transform: translateX(-100%) skewX(-20deg); }
  to { transform: translateX(0) skewX(-20deg); }
}

.cta-deco-line {
  animation: ctaDecoLineGrow 0.6s ease-out 0.4s both;
}

.cta-deco-slant {
  animation: ctaDecoSlantSlide 0.6s ease-out 0.4s both;
}
`

export function CTAOverlay() {
  // Parse URL parameters
  const urlParams = useOverlayParams<CTAOverlayParams>(CTA_DEFAULTS)

  // Resolve preset (URL params override preset defaults)
  const params = useMemo(() => {
    const preset = CTA_PRESETS[urlParams.preset] || {}
    return {
      ...CTA_DEFAULTS,
      ...preset,
      ...urlParams,
      // Override with URL params if they're not the defaults
      text: urlParams.text || preset.text || 'Subscribe',
      sub: urlParams.sub !== undefined ? urlParams.sub : (preset.sub || ''),
      icon: urlParams.icon || preset.icon || 'sub',
      iconanim: urlParams.iconanim || preset.iconanim || 'bounce',
    }
  }, [urlParams])

  const theme = useTheme(params.theme)
  const gradient = useGradient(params.gradient, params.colors)
  const fontFamily = useFontFamily(params.font)

  // Load Google Font if needed
  useLoadGoogleFont(params.font)

  // Loop mode state machine
  const [loopState, setLoopState] = useState<LoopState>('entering')
  const [loopCycle, setLoopCycle] = useState(0)

  // Exit trigger (for non-loop mode)
  const shouldExit = useDelayedExit(10) // Default 10s for CTA if not looping

  // Loop mode state machine
  useEffect(() => {
    if (!params.loop) return

    let timer: NodeJS.Timeout

    switch (loopState) {
      case 'entering':
        // After entrance animation, go to visible state
        timer = setTimeout(() => {
          setLoopState('visible')
        }, (params.delay + params.entrancespeed) * 1000)
        break

      case 'visible':
        // Hold for specified duration, then exit
        timer = setTimeout(() => {
          setLoopState('exiting')
        }, params.hold * 1000)
        break

      case 'exiting':
        // After exit animation, go to hidden state
        timer = setTimeout(() => {
          setLoopState('hidden')
        }, params.exitspeed * 1000)
        break

      case 'hidden':
        // Pause, then restart cycle
        timer = setTimeout(() => {
          setLoopState('entering')
          setLoopCycle((prev) => prev + 1)
        }, params.pause * 1000)
        break
    }

    return () => clearTimeout(timer)
  }, [loopState, params.loop, params.delay, params.entrancespeed, params.hold, params.exitspeed, params.pause])

  // Determine if component should be visible
  const isVisible = params.loop ? loopState === 'entering' || loopState === 'visible' || loopState === 'exiting' : true

  // Determine if exit animation should trigger
  const triggerExit = params.loop ? loopState === 'exiting' : shouldExit && params.exit !== 'none'

  // Get icon component
  const IconComponent = CTA_ICON_MAP[params.icon] || null

  // Icon color (custom or gradient primary)
  const iconColor = params.iconcolor || gradient[0]
  const iconSize = params.iconsize || Math.round(params.size * 1.1)

  // Decoration color
  const decoColor = params.decorationcolor || gradient[0]

  // Container flex direction based on icon position
  const getFlexDirection = (): CSSProperties['flexDirection'] => {
    switch (params.iconpos) {
      case 'right':
        return 'row-reverse'
      case 'top':
        return 'column'
      case 'bottom':
        return 'column-reverse'
      default:
        return 'row'
    }
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: getFlexDirection(),
    alignItems: 'center',
    gap: '14px',
    padding: '16px 28px',
  }

  const textWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: `${params.textpady}px ${params.textpadx}px`,
  }

  const mainTextStyle: CSSProperties = {
    color: theme.text,
    fontSize: `${params.size}px`,
    fontWeight: 700,
    fontFamily,
    letterSpacing: `${params.letterspacing}px`,
    lineHeight: params.lineheight,
    whiteSpace: 'nowrap',
    margin: 0,
  }

  const subTextStyle: CSSProperties = {
    color: theme.textMuted,
    fontSize: `${params.size * 0.6}px`,
    fontWeight: 400,
    fontFamily,
    whiteSpace: 'nowrap',
    margin: 0,
  }

  const decoLineStyle: CSSProperties = {
    height: '2px',
    background: decoColor,
    borderRadius: '1px',
    marginTop: '6px',
    transformOrigin: 'left',
  }

  const decoSlantStyle: CSSProperties = {
    height: '2px',
    background: decoColor,
    marginTop: '6px',
    transformOrigin: 'left',
  }

  // Render decoration
  const renderDecoration = () => {
    if (params.decoration === 'none') return null

    if (params.decoration === 'swirl') {
      return (
        <svg
          width="60"
          height="12"
          viewBox="0 0 60 12"
          style={{ marginTop: '6px' }}
        >
          <path
            d="M2,6 Q8,2 15,6 T30,6 Q38,10 45,6 Q50,4 55,6"
            stroke={decoColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )
    }

    if (params.decoration === 'slant') {
      return <div className="cta-deco-slant" style={decoSlantStyle} />
    }

    // Default: line
    return <div className="cta-deco-line" style={decoLineStyle} />
  }

  const content = (
    <div style={containerStyle}>
      {/* Icon */}
      {IconComponent && params.icon !== 'none' && (
        <div
          className={getIconAnimationClass(params.iconanim)}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconComponent size={iconSize} color={iconColor} strokeWidth={2} />
        </div>
      )}

      {/* Text and decoration */}
      <div style={textWrapperStyle}>
        <div style={mainTextStyle}>{params.text}</div>
        {params.sub && <div style={subTextStyle}>{params.sub}</div>}
        {renderDecoration()}
      </div>
    </div>
  )

  // Inject icon animation styles
  useEffect(() => {
    if (!document.getElementById('cta-icon-animations')) {
      const style = document.createElement('style')
      style.id = 'cta-icon-animations'
      style.textContent = iconAnimationStyles
      document.head.appendChild(style)
    }
  }, [])

  return (
    <OverlayContainer align={params.align} valign={params.valign} showBg={false}>
      {isVisible && (
        <EntranceAnimation
          type={params.entrance}
          delay={params.delay}
          speed={params.entrancespeed}
          // Force re-mount on loop cycle to retrigger entrance animation
          key={`entrance-${loopCycle}`}
        >
          <ExitAnimation
            type={params.exit}
            trigger={triggerExit}
            duration={params.exitspeed}
            // Force re-mount on loop cycle to retrigger exit animation
            key={`exit-${loopCycle}`}
          >
            {params.bg ? <OverlayPanel>{content}</OverlayPanel> : content}
          </ExitAnimation>
        </EntranceAnimation>
      )}
    </OverlayContainer>
  )
}
