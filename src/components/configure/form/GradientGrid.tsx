import { BRAND_CONFIG } from '@/config/brand.config'
import type { GradientName } from '@/types/brand.types'
import { PALETTE_GRADIENTS } from '@/lib/meshPalettes'
import { applyColorModeShift } from '@/utils/color.utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GradientGridProps {
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  className?: string
  /** Current colormode value. When provided alongside onColorModeChange, the
   *  palette variant chips render below palette gradients. */
  colorMode?: string
  onColorModeChange?: (mode: string) => void
}

// Organize gradients into categories for better UX
const GRADIENT_CATEGORIES = {
  Popular: ['indigo', 'cyan', 'sunset', 'emerald', 'purple', 'neon', 'fire', 'ocean'],
  'Warm Tones': ['sunset', 'fire', 'coral', 'amber', 'crimson', 'gold'],
  'Cool Tones': ['frost', 'ocean', 'navy', 'teal', 'cyan', 'lavender'],
  Nature: ['emerald', 'mint'],
  Monochrome: ['mono', 'slate'],
  Special: ['rainbow', 'magenta'],
} as const

// Variant chips map onto the existing 5-level colormode field
const VARIANT_CHIPS: Array<{ label: string; mode: string }> = [
  { label: 'Darker', mode: 'darker' },
  { label: 'Dark', mode: 'dark' },
  { label: 'Normal', mode: 'normal' },
  { label: 'Light', mode: 'light' },
  { label: 'Lighter', mode: 'lighter' },
]

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

// Get all palette gradient entries
const getPaletteGradients = (): { name: string; key: string; colors: string[] }[] => {
  return Object.entries(PALETTE_GRADIENTS).map(([name, colors]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    key: `palette:${name}`,
    colors,
  }))
}

export function GradientGrid({
  value,
  onValueChange,
  onBlur,
  className,
  colorMode,
  onColorModeChange,
}: GradientGridProps) {
  const allGradients = getAllGradients()
  const paletteGradients = getPaletteGradients()
  const showVariantChips = Boolean(onColorModeChange) && value.startsWith('palette:')

  // Handler that calls both onChange and onBlur
  const handleSelect = (gradientName: string) => {
    onValueChange(gradientName)
    if (onBlur) {
      onBlur()
    }
  }

  // Render a single gradient button (supports both brand and palette gradients)
  const renderGradientButton = (
    gradientName: string,
    colorsOverride?: string[],
    displayName?: string
  ) => {
    const colors =
      colorsOverride || BRAND_CONFIG.gradients[gradientName as keyof typeof BRAND_CONFIG.gradients]
    if (!colors) return null

    const isSelected = value === gradientName
    const label = displayName || gradientName
    const gradientStyle = {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    }

    return (
      <Button
        key={gradientName}
        type="button"
        variant="ghost"
        onClick={() => handleSelect(gradientName)}
        className={cn(
          'relative rounded-lg overflow-hidden transition-all duration-200 p-0 h-12 hover:bg-transparent',
          'hover:scale-105 hover:shadow-lg',
          'focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg',
          isSelected && 'ring-2 ring-brand-indigo ring-offset-2 ring-offset-dark-bg scale-105'
        )}
        aria-label={`Select ${label} gradient`}
        title={label.charAt(0).toUpperCase() + label.slice(1)}
      >
        {/* Gradient preview */}
        <div className="absolute inset-0" style={gradientStyle} />

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
            {label.charAt(0).toUpperCase() + label.slice(1)}
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
      </Button>
    )
  }

  // Render variant chips for the currently selected palette
  const renderVariantChips = () => {
    if (!showVariantChips) return null
    const paletteName = value.replace('palette:', '')
    const baseColors = PALETTE_GRADIENTS[paletteName]
    if (!baseColors) return null

    return (
      <div className="space-y-2 pt-2 border-t border-dark-border">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-dark-text">Palette Variant</h4>
          <span className="text-xs text-dark-muted">Shift lightness to match your background</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {VARIANT_CHIPS.map(({ label, mode }) => {
            const previewColors = applyColorModeShift(baseColors, mode)
            const isActive = (colorMode ?? 'normal') === mode
            return (
              <Button
                key={mode}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onColorModeChange?.(mode)}
                className={cn(
                  'relative h-12 p-0 overflow-hidden flex flex-col items-stretch gap-0',
                  isActive && 'ring-2 ring-brand-indigo ring-offset-1 ring-offset-dark-bg'
                )}
                aria-pressed={isActive}
                title={`${label} variant`}
              >
                <div
                  className="flex-1"
                  style={{
                    background: `linear-gradient(to right, ${previewColors.join(', ')})`,
                  }}
                />
                <span className="text-[10px] font-medium py-0.5 bg-dark-bg/80 text-dark-text">
                  {label}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Show all brand gradients in a grid */}
      <div className="grid grid-cols-3 gap-3">
        {allGradients.map((gradientName) => renderGradientButton(gradientName))}
      </div>

      {/* Mesh Palettes section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-dark-text">Mesh Palettes</h4>
        <div className="grid grid-cols-3 gap-3">
          {paletteGradients.map(({ name, key, colors }) => renderGradientButton(key, colors, name))}
        </div>
      </div>

      {/* Palette variant chips — only shown for palette:* gradients */}
      {renderVariantChips()}

      {/* Current selection display */}
      <div className="text-xs text-dark-muted text-center">
        Selected:{' '}
        <span className="text-dark-text font-medium capitalize">
          {value.startsWith('palette:') ? value.replace('palette:', '') + ' (palette)' : value}
        </span>
      </div>
    </div>
  )
}
