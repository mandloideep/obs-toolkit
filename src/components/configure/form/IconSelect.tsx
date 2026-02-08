/**
 * IconSelect Component
 * Select dropdown with visual icon previews
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@/components/icons/Icon'
import { cn } from '@/lib/utils'

interface IconOption {
  value: string
  label: string
}

interface IconSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: IconOption[]
  className?: string
  placeholder?: string
}

export function IconSelect({
  value,
  onValueChange,
  options,
  className,
  placeholder = 'Select icon...',
}: IconSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('bg-black/30 focus:ring-brand-indigo/50', className)}>
        <div className="flex items-center gap-2 w-full">
          {value && <Icon name={value} size={16} className="text-brand-indigo shrink-0" />}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <Icon name={option.value} size={16} className="text-brand-indigo shrink-0" />
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
