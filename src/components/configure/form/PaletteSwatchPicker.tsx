/**
 * PaletteSwatchPicker
 * Lets the user sample a single hex color from a brand gradient or mesh palette,
 * with the same 5-step lightness variants used elsewhere (darker..lighter).
 */

import { useState } from 'react'
import { BRAND_CONFIG } from '@/config/brand.config'
import { PALETTE_GRADIENTS } from '@/lib/meshPalettes'
import { applyColorModeShift } from '@/utils/color.utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Source = 'brand' | 'mesh'
type Mode = 'darker' | 'dark' | 'normal' | 'light' | 'lighter'

interface PaletteSwatchPickerProps {
  onPick: (hex: string) => void
  defaultMode?: Mode
}

const MODES: Array<{ label: string; mode: Mode }> = [
  { label: 'Darker', mode: 'darker' },
  { label: 'Dark', mode: 'dark' },
  { label: 'Normal', mode: 'normal' },
  { label: 'Light', mode: 'light' },
  { label: 'Lighter', mode: 'lighter' },
]

export function PaletteSwatchPicker({ onPick, defaultMode = 'normal' }: PaletteSwatchPickerProps) {
  const [source, setSource] = useState<Source>('brand')
  const [palette, setPalette] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>(defaultMode)

  const palettes: Array<{ name: string; colors: string[] }> =
    source === 'brand'
      ? Object.entries(BRAND_CONFIG.gradients).map(([name, colors]) => ({
          name,
          colors: colors as string[],
        }))
      : Object.entries(PALETTE_GRADIENTS).map(([name, colors]) => ({ name, colors }))

  const baseColors = palette
    ? (source === 'brand'
        ? (BRAND_CONFIG.gradients[palette as keyof typeof BRAND_CONFIG.gradients] as
            | string[]
            | undefined)
        : PALETTE_GRADIENTS[palette]) || null
    : null

  const resolvedColors = baseColors ? applyColorModeShift(baseColors, mode) : null

  return (
    <div className="space-y-3 w-[280px]">
      {/* Source toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-muted">
        {(['brand', 'mesh'] as Source[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSource(s)
              setPalette(null)
            }}
            className={cn(
              'text-xs font-medium py-1 px-2 rounded transition-colors',
              source === s
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s === 'brand' ? 'Brand' : 'Mesh'}
          </button>
        ))}
      </div>

      {/* Palette grid */}
      <div className="max-h-44 overflow-y-auto pr-1">
        <div className="grid grid-cols-3 gap-1.5">
          {palettes.map(({ name, colors }) => {
            const isSelected = palette === name
            return (
              <button
                key={name}
                type="button"
                onClick={() => setPalette(name)}
                title={name}
                aria-label={`Select ${name} palette`}
                className={cn(
                  'relative h-8 rounded-md overflow-hidden border transition-all',
                  'hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected
                    ? 'border-brand-indigo ring-2 ring-brand-indigo ring-offset-1 ring-offset-background'
                    : 'border-border'
                )}
                style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }}
              />
            )
          })}
        </div>
      </div>

      {/* Variant chips */}
      {palette && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            Variant
          </div>
          <div className="grid grid-cols-5 gap-1">
            {MODES.map(({ label, mode: m }) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'text-[10px] py-1 rounded transition-colors',
                  mode === m
                    ? 'bg-brand-indigo text-white font-semibold'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={mode === m}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resolved swatches */}
      {resolvedColors && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            Click to pick
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {resolvedColors.map((hex, i) => (
              <Button
                key={`${hex}-${i}`}
                type="button"
                variant="outline"
                onClick={() => onPick(hex)}
                title={hex}
                className="h-10 p-0 overflow-hidden"
              >
                <span className="block w-full h-full" style={{ backgroundColor: hex }} />
              </Button>
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground text-center font-mono">
            {resolvedColors.join(' · ')}
          </div>
        </div>
      )}

      {!palette && (
        <div className="text-xs text-muted-foreground text-center py-2">Pick a palette above</div>
      )}
    </div>
  )
}
