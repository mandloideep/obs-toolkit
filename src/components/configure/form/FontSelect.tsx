/**
 * FontSelect Component
 * Select dropdown that renders font names in their actual font
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FontOption {
  value: string
  label: string
  fontFamily: string // Actual CSS font-family value
}

interface FontSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: FontOption[]
  className?: string
  placeholder?: string
}

export function FontSelect({
  value,
  onValueChange,
  options,
  className,
  placeholder = 'Select font...',
}: FontSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('bg-black/30 focus:ring-brand-indigo/50', className)}>
        <div className="w-full">
          {selectedOption ? (
            <span style={{ fontFamily: selectedOption.fontFamily }}>
              {selectedOption.label}
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span style={{ fontFamily: option.fontFamily }}>
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
