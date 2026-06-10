/**
 * AnimationTimeline - Visual timeline showing animation timing phases
 * Shows proportional-width colored segments for delay, entrance, hold, exit, pause
 */

import type { CSSProperties } from 'react'

interface AnimationTimelineProps {
  delay: number
  entrancespeed: number
  hold: number
  exitspeed: number
  pause: number
  loop: boolean
  entrance: string
  exit: string
  /** For non-loop mode: seconds before exit triggers */
  exitafter?: number
}

interface Segment {
  label: string
  duration: number
  color: string
  bgColor: string
}

function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs.toFixed(0)}s` : `${mins}m`
  }
  if (seconds >= 10) return `${seconds.toFixed(0)}s`
  if (seconds >= 1) return `${seconds.toFixed(1)}s`
  return `${(seconds * 1000).toFixed(0)}ms`
}

const SEGMENT_COLORS = {
  delay: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
  entrance: { color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' },
  visible: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  hold: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
  exit: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  pause: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)' },
}

export function AnimationTimeline({
  delay,
  entrancespeed,
  hold,
  exitspeed,
  pause,
  loop,
  entrance,
  exit,
  exitafter,
}: AnimationTimelineProps) {
  const hasEntrance = entrance !== 'none'
  const hasExit = exit !== 'none'

  // Build segments based on mode
  const segments: Segment[] = []

  if (loop) {
    // Loop mode: Delay → Entrance → Hold → Exit → Pause → repeat
    if (delay > 0) {
      segments.push({
        label: 'Delay',
        duration: delay,
        color: SEGMENT_COLORS.delay.color,
        bgColor: SEGMENT_COLORS.delay.bg,
      })
    }
    if (hasEntrance) {
      segments.push({
        label: 'Enter',
        duration: entrancespeed,
        color: SEGMENT_COLORS.entrance.color,
        bgColor: SEGMENT_COLORS.entrance.bg,
      })
    }
    segments.push({
      label: 'Hold',
      duration: hold,
      color: SEGMENT_COLORS.hold.color,
      bgColor: SEGMENT_COLORS.hold.bg,
    })
    if (hasExit) {
      segments.push({
        label: 'Exit',
        duration: exitspeed,
        color: SEGMENT_COLORS.exit.color,
        bgColor: SEGMENT_COLORS.exit.bg,
      })
    }
    if (pause > 0) {
      segments.push({
        label: 'Pause',
        duration: pause,
        color: SEGMENT_COLORS.pause.color,
        bgColor: SEGMENT_COLORS.pause.bg,
      })
    }
  } else {
    // Non-loop mode: Delay → Entrance → (Visible for exitafter) → Exit
    if (delay > 0) {
      segments.push({
        label: 'Delay',
        duration: delay,
        color: SEGMENT_COLORS.delay.color,
        bgColor: SEGMENT_COLORS.delay.bg,
      })
    }
    if (hasEntrance) {
      segments.push({
        label: 'Enter',
        duration: entrancespeed,
        color: SEGMENT_COLORS.entrance.color,
        bgColor: SEGMENT_COLORS.entrance.bg,
      })
    }
    if (hasExit && exitafter !== undefined && exitafter > 0) {
      segments.push({
        label: 'Visible',
        duration: exitafter,
        color: SEGMENT_COLORS.visible.color,
        bgColor: SEGMENT_COLORS.visible.bg,
      })
      segments.push({
        label: 'Exit',
        duration: exitspeed,
        color: SEGMENT_COLORS.exit.color,
        bgColor: SEGMENT_COLORS.exit.bg,
      })
    }
  }

  if (segments.length === 0) return null

  const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0)

  // Calculate proportional widths with minimum percentage
  const MIN_WIDTH_PERCENT = 8
  const availablePercent = 100 - segments.length * MIN_WIDTH_PERCENT
  const proportionalWidths = segments.map((s) => {
    const proportion = totalDuration > 0 ? s.duration / totalDuration : 1 / segments.length
    return MIN_WIDTH_PERCENT + proportion * availablePercent
  })

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  }

  const barContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '2px',
    height: '28px',
    borderRadius: '6px',
    overflow: 'hidden',
  }

  return (
    <div style={containerStyle}>
      {/* Timeline bar */}
      <div style={barContainerStyle}>
        {segments.map((segment, i) => (
          <div
            key={`${segment.label}-${i}`}
            style={{
              width: `${proportionalWidths[i]}%`,
              background: segment.bgColor,
              borderLeft: `3px solid ${segment.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: segment.color,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: '0 4px',
                letterSpacing: '0.02em',
              }}
            >
              {segment.label}
            </span>
          </div>
        ))}
      </div>

      {/* Time labels */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {segments.map((segment, i) => (
          <div
            key={`time-${segment.label}-${i}`}
            style={{
              width: `${proportionalWidths[i]}%`,
              textAlign: 'center',
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.4)',
              minWidth: 0,
            }}
          >
            {formatTime(segment.duration)}
          </div>
        ))}
      </div>

      {/* Summary line */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.35)',
          paddingTop: '2px',
        }}
      >
        <span>
          {loop ? 'Cycle' : 'Total'}: {formatTime(totalDuration)}
        </span>
        {loop && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 2l4 4-4 4" />
              <path d="M3 11v-1a4 4 0 014-4h14" />
              <path d="M7 22l-4-4 4-4" />
              <path d="M21 13v1a4 4 0 01-4 4H3" />
            </svg>
            Repeats
          </span>
        )}
      </div>
    </div>
  )
}
