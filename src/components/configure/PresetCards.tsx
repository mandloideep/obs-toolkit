/**
 * Visual Preset Cards
 * Clickable cards with gradient swatches for quick preset selection.
 * Replaces the dropdown for a more visual preset browsing experience.
 */

import { useMemo } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useGradient } from '../../hooks/useBrand'
import type { GradientName, ColorMode } from '../../types/brand.types'

export interface PresetCardInfo {
  value: string
  label: string
  description: string
  gradient?: GradientName
  colormode?: ColorMode
}

interface PresetCardsProps {
  presets: PresetCardInfo[]
  value: string
  onSelect: (value: string) => void
}

function GradientSwatch({
  gradient,
  colormode,
}: {
  gradient?: GradientName
  colormode?: ColorMode
}) {
  const colors = useGradient(gradient || 'indigo', undefined, undefined, colormode)

  const style = useMemo(
    () => ({
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    }),
    [colors]
  )

  return <div className="h-1.5 mt-2 rounded-full" style={style} />
}

export function PresetCards({ presets, value, onSelect }: PresetCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map((preset) => (
        <Button
          key={preset.value}
          type="button"
          variant="ghost"
          onClick={() => onSelect(preset.value)}
          className={cn(
            'p-3 h-auto rounded-lg border text-left transition-colors hover:bg-accent/50 flex flex-col items-stretch gap-0 justify-start whitespace-normal',
            value === preset.value
              ? 'border-primary bg-accent/30 ring-1 ring-primary/30'
              : 'border-border'
          )}
        >
          <div className="text-sm font-medium">{preset.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {preset.description}
          </div>
          {preset.gradient && (
            <GradientSwatch gradient={preset.gradient} colormode={preset.colormode} />
          )}
        </Button>
      ))}
    </div>
  )
}
