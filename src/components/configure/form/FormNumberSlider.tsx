/**
 * FormNumberSlider Component
 * Number input with synchronized slider using ShadCN UI components
 */

import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InfoIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FormNumberSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  min: number
  max: number
  step?: number
  unit?: string
  help?: string
  error?: string
}

/**
 * Number slider with dual input (slider + text input)
 *
 * Features:
 * - Synchronized slider and number input
 * - Optional unit display (px, s, %, etc.)
 * - Tooltip help text
 * - Error message display
 * - Min/max validation
 *
 * @example
 * ```tsx
 * <form.Field name="thickness">
 *   {(field) => (
 *     <FormNumberSlider
 *       label="Thickness"
 *       value={field.state.value}
 *       onChange={(val) => field.handleChange(val)}
 *       onBlur={field.handleBlur}
 *       min={1}
 *       max={50}
 *       unit="px"
 *       help="Border thickness in pixels"
 *       error={field.state.meta.errors?.[0]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function FormNumberSlider({
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  step = 1,
  unit,
  help,
  error,
}: FormNumberSliderProps) {
  // Clamp value to min/max range
  const clampedValue = Math.min(Math.max(value, min), max)

  const handleSliderChange = (values: number[]) => {
    onChange(values[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      // Clamp to range
      const clampedVal = Math.min(Math.max(val, min), max)
      onChange(clampedVal)
    }
  }

  return (
    <div className="space-y-3">
      {/* Label with optional help tooltip */}
      <div className="flex items-center gap-2">
        <Label className="config-label">{label}</Label>
        {help && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <InfoIcon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{help}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Slider + Number Input */}
      <div className="flex items-center gap-3">
        {/* Slider */}
        <Slider
          value={[clampedValue]}
          onValueChange={handleSliderChange}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />

        {/* Number Input with Unit */}
        <div className="flex items-center gap-1.5 min-w-[80px]">
          <Input
            type="number"
            value={clampedValue}
            onChange={handleInputChange}
            onBlur={onBlur}
            min={min}
            max={max}
            step={step}
            className="w-16 h-8 text-sm"
          />
          {unit && (
            <span className="text-xs text-muted-foreground min-w-[20px]">{unit}</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}
