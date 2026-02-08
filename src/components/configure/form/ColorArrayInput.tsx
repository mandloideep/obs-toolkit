/**
 * ColorArrayInput Component
 * Manages an array of colors with add/remove functionality
 */

import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

interface ColorArrayInputProps {
  label: string
  colors: string[]
  onChange: (colors: string[]) => void
  maxColors?: number
}

export function ColorArrayInput({
  label,
  colors,
  onChange,
  maxColors = 5,
}: ColorArrayInputProps) {
  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors]
    // Remove # if user includes it
    newColors[index] = value.replace('#', '')
    onChange(newColors)
  }

  const handleAddColor = () => {
    if (colors.length < maxColors) {
      onChange([...colors, 'FF0000'])
    }
  }

  const handleRemoveColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index)
    onChange(newColors)
  }

  return (
    <div className="space-y-3">
      <Label className="config-label">{label}</Label>
      <div className="space-y-2">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center flex-1 gap-2">
              <div
                className="w-8 h-8 rounded border border-dark-border flex-shrink-0"
                style={{ backgroundColor: `#${color}` }}
              />
              <div className="flex items-center flex-1 gap-1">
                <span className="text-dark-muted text-sm">#</span>
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  placeholder="FF0000"
                  maxLength={6}
                  className="flex-1 font-mono uppercase"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveColor(index)}
              className="text-red-500 hover:text-red-600 h-8"
              type="button"
            >
              Remove
            </Button>
          </div>
        ))}
        {colors.length < maxColors && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddColor}
            className="text-brand-indigo hover:text-brand-indigo/80 h-8"
            type="button"
          >
            + Add Color
          </Button>
        )}
      </div>
      {colors.length === 0 && (
        <p className="text-xs text-dark-muted">No custom colors. Using gradient preset.</p>
      )}
    </div>
  )
}
