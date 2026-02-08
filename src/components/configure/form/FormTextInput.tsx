/**
 * FormTextInput Component
 * Text input field with ShadCN UI components
 */

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormTextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  help?: string
  type?: 'text' | 'password' | 'email' | 'url'
  error?: string
}

/**
 * Text input field with label and error display
 *
 * Features:
 * - Standard text input with validation
 * - Support for password, email, and URL types
 * - Help text display
 * - Error message display
 * - Accessible labels
 *
 * @example
 * ```tsx
 * <form.Field name="text">
 *   {(field) => (
 *     <FormTextInput
 *       label="Text Content"
 *       value={field.state.value}
 *       onChange={(val) => field.handleChange(val)}
 *       onBlur={field.handleBlur}
 *       placeholder="Enter text..."
 *       error={field.state.meta.errors?.[0]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function FormTextInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  help,
  type = 'text',
  error,
}: FormTextInputProps) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <Label className="config-label">{label}</Label>

      {/* Help Text */}
      {help && (
        <p className="text-xs text-muted-foreground -mt-1">{help}</p>
      )}

      {/* Input Field */}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={error ? 'border-destructive' : ''}
      />

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
