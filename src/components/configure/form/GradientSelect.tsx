import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { BRAND_CONFIG } from '@/config/brand.config'
import type { GradientName } from '@/types/brand.types'

interface GradientSelectProps {
  value: string
  onValueChange: (value: string) => void
  showAll?: boolean
  className?: string
}

export function GradientSelect({
  value,
  onValueChange,
  showAll = true,
  className,
}: GradientSelectProps) {
  // Get all gradient names from BRAND_CONFIG
  const allGradients = Object.keys(BRAND_CONFIG.gradients) as GradientName[]

  // Default subset (original 8 presets) if showAll is false
  const defaultGradients: GradientName[] = [
    'indigo',
    'cyan',
    'sunset',
    'emerald',
    'purple',
    'neon',
    'fire',
    'ocean',
  ]

  const gradientsToShow = showAll ? allGradients : defaultGradients

  // Render gradient strip preview
  const renderGradientStrip = (gradientName: GradientName) => {
    const colors = BRAND_CONFIG.gradients[gradientName]
    const gradientStyle = {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    }

    return (
      <div
        className="w-[120px] h-5 rounded border border-white/10 flex-shrink-0"
        style={gradientStyle}
        aria-hidden="true"
      />
    )
  }

  // Capitalize gradient name for display
  const formatGradientName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('bg-black/30 focus:ring-brand-indigo/50', className)}>
        <div className="flex items-center gap-3 w-full">
          <span className="flex-shrink-0">{formatGradientName(value)}</span>
          {renderGradientStrip(value as GradientName)}
        </div>
      </SelectTrigger>
      <SelectContent>
        {gradientsToShow.map((gradientName) => (
          <SelectItem key={gradientName} value={gradientName}>
            <div className="flex items-center gap-3">
              <span className="min-w-[80px]">{formatGradientName(gradientName)}</span>
              {renderGradientStrip(gradientName)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
