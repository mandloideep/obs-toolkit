import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  className?: string
}

export function FormSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: FormSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('bg-black/30 focus:ring-brand-indigo/50', className)}>
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
  )
}
