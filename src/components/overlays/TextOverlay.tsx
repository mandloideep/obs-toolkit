/**
 * Text Overlay Component
 * Name plates, lower thirds, stream screens with presets and animations
 * Migrated from text.html with full feature parity
 */

import React, { useState, useEffect, useMemo, type CSSProperties } from 'react'
import { useOverlayParams } from '../../hooks/useOverlayParams'
import { useGradient, useTheme, useFontFamily, useLoadCustomFonts } from '../../hooks/useBrand'
import { EntranceAnimation } from '../animations/EntranceAnimation'
import { ExitAnimation, useDelayedExit } from '../animations/ExitAnimation'
import { OverlayContainer } from './OverlayContainer'
import { OverlayPanel } from './OverlayPanel'
import { SignatureLine, lineAnimationStyles } from './TextOverlay/SignatureLine'
import { TEXT_PRESETS } from '../../config/text-presets'
import { TEXT_DEFAULTS } from '../../types/text.types'
import type { TextOverlayParams } from '../../types/text.types'
import { createLinearGradient } from '../../utils/css.utils'

// Loop state machine states
type LoopState = 'entering' | 'visible' | 'exiting' | 'hidden'

export function TextOverlay() {
  // Parse URL parameters
  const urlParams = useOverlayParams<TextOverlayParams>(TEXT_DEFAULTS)

  // Resolve preset (URL params override preset defaults)
  const params = useMemo(() => {
    const preset = TEXT_PRESETS[urlParams.preset] || {}
    return {
      ...TEXT_DEFAULTS,
      ...preset,
      ...urlParams,
      // Override with URL params if they're not the defaults
      text: urlParams.text || preset.text || '',
      sub: urlParams.sub || preset.sub || '',
    }
  }, [urlParams])

  const theme = useTheme(params.theme)
  const gradient = useGradient(params.gradient, params.colors)
  const fontFamily = useFontFamily(params.font)

  // Load custom fonts if specified
  useLoadCustomFonts(params.colors)

  // Loop mode state machine
  const [loopState, setLoopState] = useState<LoopState>('entering')
  const [loopCycle, setLoopCycle] = useState(0)

  // Exit trigger (for non-loop mode)
  const shouldExit = useDelayedExit(params.exitafter)

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
  const isVisible = params.loop
    ? loopState === 'entering' || loopState === 'visible'
    : true

  // Determine if exit animation should trigger
  const triggerExit = params.loop
    ? loopState === 'exiting'
    : shouldExit && params.exit !== 'none'

  // Calculate padding (use specific padx/pady if set, otherwise use pad)
  const paddingX = params.padx > 0 ? params.padx : params.pad
  const paddingY = params.pady > 0 ? params.pady : params.pad

  // Text color (use custom or theme default)
  const textColor = params.textcolor || theme.text
  const subColor = params.subcolor || theme.textMuted

  // Get text style (gradient or solid)
  const getTextStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      fontSize: `${params.size}px`,
      fontWeight: params.weight,
      fontFamily,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      margin: 0,
    }

    if (params.textgradient) {
      return {
        ...baseStyle,
        background: createLinearGradient(gradient, 90),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    }

    return {
      ...baseStyle,
      color: textColor,
    }
  }

  const getSubStyle = (): CSSProperties => {
    return {
      fontSize: `${params.subsize}px`,
      fontWeight: 400,
      fontFamily,
      color: subColor,
      lineHeight: 1.5,
      margin: '8px 0 0 0',
      opacity: 0.9,
    }
  }

  const contentStyle: CSSProperties = {
    maxWidth: params.maxwidth !== 'auto' ? params.maxwidth : undefined,
    padding: `${paddingY}px ${paddingX}px`,
    margin: `${params.marginy}px ${params.marginx}px`,
    transform: `translate(${params.offsetx}px, ${params.offsety}px)`,
  }

  // Render signature line (top, bottom, or both)
  const renderLine = (position: 'top' | 'bottom') => {
    if (!params.line) return null
    if (params.linepos !== position && params.linepos !== 'both') return null

    return (
      <SignatureLine
        style={params.linestyle}
        animation={params.lineanim}
        length={params.linelength}
        width={params.linewidth}
        speed={params.linespeed}
        gradient={gradient}
      />
    )
  }

  const content = (
    <div style={contentStyle}>
      {params.bg ? (
        <OverlayPanel>
          {renderLine('top')}
          <h1 style={getTextStyle()}>{params.text}</h1>
          {params.sub && <p style={getSubStyle()}>{params.sub}</p>}
          {renderLine('bottom')}
        </OverlayPanel>
      ) : (
        <>
          {renderLine('top')}
          <h1 style={getTextStyle()}>{params.text}</h1>
          {params.sub && <p style={getSubStyle()}>{params.sub}</p>}
          {renderLine('bottom')}
        </>
      )}
    </div>
  )

  // Inject line animation styles
  useEffect(() => {
    if (!document.getElementById('line-animations')) {
      const style = document.createElement('style')
      style.id = 'line-animations'
      style.textContent = lineAnimationStyles
      document.head.appendChild(style)
    }
  }, [])

  return (
    <OverlayContainer
      align={params.align}
      valign={params.valign}
      showBg={false}
    >
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
            {content}
          </ExitAnimation>
        </EntranceAnimation>
      )}
    </OverlayContainer>
  )
}
