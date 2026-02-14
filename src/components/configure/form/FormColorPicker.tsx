/**
 * FormColorPicker Component
 * RGBA color picker with swatch preview, popover picker, hex input, and alpha slider
 */

import { useState, useCallback } from 'react'
import { RgbaColorPicker, type RgbaColor } from 'react-colorful'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { hexToRgba, rgbaToHex, hexToCssColor } from '../../../utils/color.utils'

interface FormColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  help?: string
  error?: string
  showAlpha?: boolean
  placeholder?: string
  allowEmpty?: boolean
}

/**
 * Color picker with swatch, popover, hex input, and optional alpha slider
 */
export function FormColorPicker({
  label,
  value,
  onChange,
  onBlur,
  help,
  error,
  showAlpha = true,
  placeholder = 'Leave empty for auto color',
  allowEmpty = true,
}: FormColorPickerProps) {
  const [open, setOpen] = useState(false)

  const rgba = value ? hexToRgba(value) : { r: 0, g: 0, b: 0, a: 1 }
  const alpha = value ? Math.round(rgba.a * 100) : 100
  const cssColor = value ? hexToCssColor(value) : ''

  const handlePickerChange = useCallback(
    (color: RgbaColor) => {
      const hex = rgbaToHex(color.r, color.g, color.b, color.a)
      onChange(hex)
    },
    [onChange]
  )

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace('#', '').toUpperCase()
      // Allow partial input while typing
      val = val.replace(/[^0-9A-F]/g, '').slice(0, 8)

      if (val === '' && allowEmpty) {
        onChange('')
        return
      }
      onChange(val)
    },
    [onChange, allowEmpty]
  )

  const handleAlphaChange = useCallback(
    (vals: number[]) => {
      if (!value) return
      const newAlpha = vals[0] / 100
      const { r, g, b } = hexToRgba(value)
      const hex = rgbaToHex(r, g, b, newAlpha)
      onChange(hex)
    },
    [value, onChange]
  )

  const handleClear = useCallback(() => {
    onChange('')
    onBlur?.()
  }, [onChange, onBlur])

  return (
    <div className="space-y-2">
      <Label className="config-label">{label}</Label>

      <div className="flex items-center gap-2">
        {/* Color swatch with popover picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-8 h-8 rounded border border-border shrink-0 relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`Pick color: ${value || 'none'}`}
            >
              {/* Checkerboard background for alpha visualization */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                }}
              />
              {/* Color overlay */}
              {value && (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: cssColor }}
                />
              )}
              {/* Empty state */}
              {!value && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                  —
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="space-y-3">
              <RgbaColorPicker
                color={rgba}
                onChange={handlePickerChange}
              />
              {allowEmpty && value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear color
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Hex input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            #
          </span>
          <Input
            value={value}
            onChange={handleHexInput}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={8}
            className="pl-7 text-sm font-mono"
            aria-label={`${label} hex code`}
          />
        </div>
      </div>

      {/* Alpha slider */}
      {showAlpha && value && (
        <div className="flex items-center gap-3 pl-10">
          <span className="text-xs text-muted-foreground w-12 shrink-0">Alpha</span>
          <Slider
            value={[alpha]}
            onValueChange={handleAlphaChange}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-right font-mono">
            {alpha}%
          </span>
        </div>
      )}

      {/* Help text */}
      {help && !error && (
        <p className="text-xs text-muted-foreground">{help}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
