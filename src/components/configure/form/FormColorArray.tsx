/**
 * FormColorArray Component
 * Dynamic color array management with ShadCN UI components
 */

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'

interface FormColorArrayProps {
  label: string
  colors: string[]
  onChange: (colors: string[]) => void
  maxColors?: number
  error?: string
}

/**
 * Dynamic color array input with add/remove functionality
 *
 * Features:
 * - Visual color preview boxes
 * - Add/remove colors with validation
 * - Max colors limit
 * - Hex color input (without # prefix)
 * - Error message display
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
  const addColor = () => {
    if (colors.length < maxColors) {
      onChange([...colors, 'FFFFFF'])
    }
  }

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index))
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    // Remove # prefix if user adds it
    newColors[index] = value.replace('#', '').toUpperCase()
    onChange(newColors)
  }

  return (
    <div className="space-y-3">
      {/* Label */}
      <Label className="config-label">{label}</Label>

      {/* Color Inputs */}
      <div className="space-y-2">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Color Preview Box */}
            <div
              className="w-8 h-8 rounded border border-border shrink-0"
              style={{
                backgroundColor: `#${color}`,
              }}
              aria-label={`Color preview: #${color}`}
            />

            {/* Hex Input */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                #
              </span>
              <Input
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                placeholder="RRGGBB"
                maxLength={6}
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
        ))}

        {/* Empty State */}
        {colors.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            No custom colors added
          </p>
        )}

        {/* Add Color Button */}
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

        {/* Max Colors Reached */}
        {colors.length >= maxColors && (
          <p className="text-xs text-muted-foreground">
            Maximum {maxColors} colors reached
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
