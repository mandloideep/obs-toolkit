/**
 * FormSwitch Component
 * Boolean toggle switch with ShadCN UI components and TanStack Form integration
 */

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface FormSwitchProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  help?: string
  error?: string
}

/**
 * Boolean toggle switch with label and help text
 *
 * Features:
 * - ShadCN Switch component with proper styling
 * - Horizontal layout (label left, switch right)
 * - Help text display below label
 * - Error message display
 * - Accessible labels
 *
 * @example
 * ```tsx
 * <form.Field name="glow">
 *   {(field) => (
 *     <FormSwitch
 *       label="Glow Effect"
 *       checked={field.state.value}
 *       onCheckedChange={(checked) => field.handleChange(checked)}
 *       help="Enable outer glow effect"
 *       error={field.state.meta.errors?.[0]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function FormSwitch({
  label,
  checked,
  onCheckedChange,
  help,
  error,
}: FormSwitchProps) {
  return (
    <div className="space-y-2">
      {/* Label + Switch Row */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="config-label cursor-pointer">{label}</Label>
          {help && (
            <p className="text-xs text-muted-foreground">{help}</p>
          )}
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={label}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
