/**
 * NumberSlider Component
 * Combined slider and number input for better UX
 */

import { Label } from '../../ui/label'
import { Slider } from '../../ui/slider'
import { Input } from '../../ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'

interface NumberSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string // 'px', 's', '%', etc.
  help?: string // Tooltip text
}

export function NumberSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  help,
}: NumberSliderProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(newValue, min), max))
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="config-label mb-0">
          {label}
          {help && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1.5 text-dark-muted cursor-help text-xs">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{help}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-20 h-8 text-sm"
          />
          {unit && <span className="text-sm text-dark-muted min-w-[24px]">{unit}</span>}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
}
