/**
 * FormSelectInput Component
 * Select dropdown with ShadCN UI components
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FormSelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  help?: string
  placeholder?: string
  error?: string
}

/**
 * Select dropdown with label and error display
 *
 * Features:
 * - ShadCN Select component with proper styling
 * - Help text display
 * - Error message display
 * - Accessible labels
 * - Custom placeholder support
 *
 * @example
 * ```tsx
 * <form.Field name="shape">
 *   {(field) => (
 *     <FormSelectInput
 *       label="Shape"
 *       value={field.state.value}
 *       onChange={(val) => field.handleChange(val)}
 *       options={[
 *         { value: 'rect', label: 'Rectangle' },
 *         { value: 'circle', label: 'Circle' },
 *       ]}
 *       error={field.state.meta.errors?.[0]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function FormSelectInput({
  label,
  value,
  onChange,
  options,
  help,
  placeholder,
  error,
}: FormSelectInputProps) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <Label className="config-label">{label}</Label>

      {/* Help Text */}
      {help && (
        <p className="text-xs text-muted-foreground -mt-1">{help}</p>
      )}

      {/* Select Dropdown */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
