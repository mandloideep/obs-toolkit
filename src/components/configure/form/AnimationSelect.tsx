/**
 * AnimationSelect Component
 * Select dropdown with visual animation hints using icons
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsUp,
  Rotate3D,
  Zap,
  Waves,
  Activity,
} from 'lucide-react'

interface AnimationOption {
  value: string
  label: string
}

interface AnimationSelectProps {
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  options: AnimationOption[]
  className?: string
  placeholder?: string
}

// Map animation types to icons
const getAnimationIcon = (animationType: string) => {
  const type = animationType.toLowerCase()

  // Entrance/Exit animations
  if (type.includes('fade')) return Eye
  if (type.includes('slideup') || type.includes('slide-up')) return ArrowUp
  if (type.includes('slidedown') || type.includes('slide-down')) return ArrowDown
  if (type.includes('slideleft') || type.includes('slide-left')) return ArrowLeft
  if (type.includes('slideright') || type.includes('slide-right')) return ArrowRight
  if (type.includes('bounce')) return ChevronsUp
  if (type.includes('zoom')) return Zap
  if (type.includes('rotate')) return Rotate3D

  // Icon animations
  if (type.includes('pulse')) return Activity
  if (type.includes('spin')) return Rotate3D
  if (type.includes('wave')) return Waves

  // Default
  return Eye
}

export function AnimationSelect({
  value,
  onValueChange,
  onBlur,
  options,
  className,
  placeholder = 'Select animation...',
}: AnimationSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value)
  const SelectedIcon = selectedOption ? getAnimationIcon(selectedOption.value) : Eye

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={(open) => {
        // Call onBlur when dropdown closes
        if (!open && onBlur) {
          onBlur()
        }
      }}
    >
      <SelectTrigger className={cn('bg-black/30 focus:ring-brand-indigo/50', className)}>
        <div className="flex items-center gap-2 w-full">
          <SelectedIcon size={16} className="text-brand-indigo shrink-0" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const OptionIcon = getAnimationIcon(option.value)
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <OptionIcon size={16} className="text-brand-indigo shrink-0" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
