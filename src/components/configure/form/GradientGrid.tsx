import { BRAND_CONFIG } from '@/config/brand.config'
import type { GradientName } from '@/types/brand.types'
import { cn } from '@/lib/utils'

interface GradientGridProps {
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  className?: string
}

// Organize gradients into categories for better UX
const GRADIENT_CATEGORIES = {
  Popular: ['indigo', 'cyan', 'sunset', 'emerald', 'purple', 'neon', 'fire', 'ocean'],
  'Warm Tones': ['sunset', 'fire', 'coral', 'amber', 'crimson', 'gold'],
  'Cool Tones': ['frost', 'ocean', 'navy', 'teal', 'cyan', 'lavender'],
  Nature: ['emerald', 'mint', 'forest'],
  Monochrome: ['mono', 'slate'],
  Special: ['rainbow', 'magenta'],
} as const

// Get all unique gradients (some appear in multiple categories)
const getAllGradients = (): GradientName[] => {
  const allFromCategories = new Set<string>()
  Object.values(GRADIENT_CATEGORIES).forEach((gradients) => {
    gradients.forEach((g) => allFromCategories.add(g))
  })

  // Add any gradients from BRAND_CONFIG that aren't categorized yet
  const allBrandGradients = Object.keys(BRAND_CONFIG.gradients)
  allBrandGradients.forEach((g) => allFromCategories.add(g))

  return Array.from(allFromCategories) as GradientName[]
}

export function GradientGrid({ value, onValueChange, onBlur, className }: GradientGridProps) {
  const allGradients = getAllGradients()

  // Handler that calls both onChange and onBlur
  const handleSelect = (gradientName: GradientName) => {
    onValueChange(gradientName)
    if (onBlur) {
      onBlur()
    }
  }

  // Render a single gradient button
  const renderGradientButton = (gradientName: GradientName) => {
    const colors = BRAND_CONFIG.gradients[gradientName]
    if (!colors) return null

    const isSelected = value === gradientName
    const gradientStyle = {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    }

    return (
      <button
        key={gradientName}
        onClick={() => handleSelect(gradientName)}
        className={cn(
          'relative rounded-lg overflow-hidden transition-all duration-200',
          'hover:scale-105 hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 focus:ring-offset-dark-bg',
          isSelected && 'ring-2 ring-brand-indigo ring-offset-2 ring-offset-dark-bg scale-105'
        )}
        aria-label={`Select ${gradientName} gradient`}
        title={gradientName.charAt(0).toUpperCase() + gradientName.slice(1)}
      >
        {/* Gradient preview */}
        <div className="w-full h-12" style={gradientStyle} />

        {/* Gradient name */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm transition-opacity',
              isSelected
                ? 'bg-white/90 text-dark-bg opacity-100'
                : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
            )}
            style={{
              opacity: isSelected ? 1 : undefined,
            }}
          >
            {gradientName.charAt(0).toUpperCase() + gradientName.slice(1)}
          </span>
        </div>

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-brand-indigo rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Show all gradients in a grid */}
      <div className="grid grid-cols-3 gap-3">
        {allGradients.map((gradientName) => renderGradientButton(gradientName))}
      </div>

      {/* Current selection display */}
      <div className="text-xs text-dark-muted text-center">
        Selected: <span className="text-dark-text font-medium capitalize">{value}</span>
      </div>
    </div>
  )
}
