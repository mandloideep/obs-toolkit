/**
 * FormColorArray Component
 * Dynamic color array management with inline color picker per row
 */

import { useState, useCallback } from 'react'
import { RgbaColorPicker, type RgbaColor } from 'react-colorful'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Plus, X } from 'lucide-react'
import { hexToRgba, rgbaToHex, hexToCssColor } from '../../../utils/color.utils'

interface FormColorArrayProps {
  label: string
  colors: string[]
  onChange: (colors: string[]) => void
  maxColors?: number
  error?: string
}

/**
 * Dynamic color array input with color picker per row
 *
 * @example
 * ```tsx
 * <form.Field name="colors">
 *   {(field) => (
 *     <FormColorArray
 *       label="Custom Colors"
 *       colors={field.state.value}
 *       onChange={(colors) => field.handleChange(colors)}
 *       maxColors={5}
 *       error={field.state.meta.errors?.[0]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function FormColorArray({
  label,
  colors,
  onChange,
  maxColors = 5,
  error,
}: FormColorArrayProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const addColor = () => {
    if (colors.length < maxColors) {
      onChange([...colors, 'FFFFFF'])
    }
  }

  const removeColor = (index: number) => {
    if (openIndex === index) setOpenIndex(null)
    onChange(colors.filter((_, i) => i !== index))
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value.replace('#', '').toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 8)
    onChange(newColors)
  }

  const handlePickerChange = useCallback(
    (index: number, color: RgbaColor) => {
      const newColors = [...colors]
      newColors[index] = rgbaToHex(color.r, color.g, color.b, color.a)
      onChange(newColors)
    },
    [colors, onChange]
  )

  return (
    <div className="space-y-3">
      <Label className="config-label">{label}</Label>

      <div className="space-y-2">
        {colors.map((color, index) => {
          const rgba = hexToRgba(color)
          const cssColor = hexToCssColor(color)

          return (
            <div key={index} className="flex items-center gap-2">
              {/* Color swatch with picker popover */}
              <Popover
                open={openIndex === index}
                onOpenChange={(open) => setOpenIndex(open ? index : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-8 h-8 rounded border border-border shrink-0 relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label={`Pick color ${index + 1}`}
                  >
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
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: cssColor }}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <RgbaColorPicker
                    color={rgba}
                    onChange={(c) => handlePickerChange(index, c)}
                  />
                </PopoverContent>
              </Popover>

              {/* Hex Input */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                  #
                </span>
                <Input
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  placeholder="RRGGBB"
                  maxLength={8}
                  className="pl-7 text-sm font-mono"
                  aria-label={`Color ${index + 1} hex code`}
                />
              </div>

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeColor(index)}
                className="shrink-0"
                aria-label={`Remove color ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        })}

        {colors.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            No custom colors added
          </p>
        )}

        {colors.length < maxColors && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColor}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Color {colors.length > 0 && `(${colors.length}/${maxColors})`}
          </Button>
        )}

        {colors.length >= maxColors && (
          <p className="text-xs text-muted-foreground">
            Maximum {maxColors} colors reached
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
