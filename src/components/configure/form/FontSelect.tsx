/**
 * FontSelect Component
 * Select dropdown that renders font names in their actual font
 * Supports both predefined options and Google Fonts browser
 */

import { useState, useEffect, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGoogleFonts } from '@/hooks/useGoogleFonts'
import { googleFontsService } from '@/services/googleFonts'
import { RefreshCw } from 'lucide-react'
import { STANDARD_FONT_NAMES } from '@/lib/constants'

export interface FontOption {
  value: string
  label: string
  fontFamily: string // Actual CSS font-family value
}

interface FontSelectProps {
  value: string
  onValueChange: (value: string) => void
  options?: FontOption[] // Now optional when using Google Fonts
  className?: string
  placeholder?: string
  showGoogleFonts?: boolean // Enable Google Fonts browser
}

// Standard fonts always available
const STANDARD_FONTS: FontOption[] = [
  { value: 'display', label: 'Display (Inter)', fontFamily: "'Inter', sans-serif" },
  { value: 'body', label: 'Body (Inter)', fontFamily: "'Inter', sans-serif" },
  { value: 'mono', label: 'Mono (JetBrains Mono)', fontFamily: "'JetBrains Mono', monospace" },
]

export function FontSelect({
  value,
  onValueChange,
  options,
  className,
  placeholder = 'Select font...',
  showGoogleFonts = false,
}: FontSelectProps) {
  const { fonts: googleFonts, loading, error, refresh } = useGoogleFonts()
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  // Use provided options or standard fonts
  const baseOptions = options || STANDARD_FONTS

  // Filter and map Google Fonts
  const googleFontOptions: FontOption[] = useMemo(() => {
    if (!showGoogleFonts || !googleFonts.length) return []

    return googleFonts
      .filter((f) => category === 'all' || f.category === category)
      .filter((f) => f.family.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 50) // Performance limit - only show first 50 results
      .map((f) => ({
        value: f.family,
        label: f.family,
        fontFamily: `'${f.family}', ${googleFontsService.getCategoryFallback(f.category)}`,
      }))
  }, [googleFonts, category, searchQuery, showGoogleFonts])

  // Combined options
  const allOptions = showGoogleFonts ? [...baseOptions, ...googleFontOptions] : baseOptions

  const selectedOption = allOptions.find((opt) => opt.value === value)

  return (
    <div className="space-y-2">
      {/* Search and Filters (only when Google Fonts enabled) */}
      {showGoogleFonts && (
        <>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                googleFontsService.clearCache()
                refresh()
              }}
              title="Refresh fonts"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'sans-serif', label: 'Sans Serif' },
              { value: 'serif', label: 'Serif' },
              { value: 'display', label: 'Display' },
              { value: 'monospace', label: 'Monospace' },
            ].map((cat) => (
              <Button
                key={cat.value}
                type="button"
                variant={category === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'h-7 text-xs',
                  category === cat.value && 'bg-indigo-500 hover:bg-indigo-500/90 border-indigo-500'
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-400 p-2 bg-red-500/10 rounded border border-red-500/30">
              {error}. Showing standard fonts only.
            </div>
          )}
        </>
      )}

      {/* Font Dropdown */}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn('bg-black/30 focus:ring-brand-indigo/50', className)}>
          <div className="w-full">
            {selectedOption ? (
              <FontPreview font={selectedOption} showValue={false} />
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {/* Standard Fonts Section */}
          {showGoogleFonts && baseOptions.length > 0 && (
            <div className="text-xs text-dark-muted px-2 py-1 font-semibold bg-dark-lighter/50">
              Standard Fonts
            </div>
          )}
          {baseOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <FontPreview font={option} />
            </SelectItem>
          ))}

          {/* Google Fonts Section */}
          {showGoogleFonts && googleFontOptions.length > 0 && (
            <>
              <div className="text-xs text-dark-muted px-2 py-1 font-semibold bg-dark-lighter/50 mt-2">
                Google Fonts ({googleFontOptions.length})
              </div>
              {googleFontOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <FontPreview font={option} />
                </SelectItem>
              ))}
            </>
          )}

          {/* Loading State */}
          {showGoogleFonts && loading && googleFontOptions.length === 0 && (
            <div className="text-xs text-dark-muted px-2 py-3 text-center">Loading fonts...</div>
          )}

          {/* No Results */}
          {showGoogleFonts &&
            !loading &&
            googleFonts.length > 0 &&
            googleFontOptions.length === 0 &&
            searchQuery && (
              <div className="text-xs text-dark-muted px-2 py-3 text-center">
                No fonts found matching "{searchQuery}"
              </div>
            )}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * FontPreview Component
 * Renders font name in its actual font with lazy loading
 */
interface FontPreviewProps {
  font: FontOption
  showValue?: boolean
}

function FontPreview({ font, showValue = true }: FontPreviewProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Skip standard fonts (already loaded)
    if ((STANDARD_FONT_NAMES as readonly string[]).includes(font.value)) {
      setLoaded(true)
      return
    }

    // Dynamically load Google Font for preview
    const fontName = font.value.replace(/ /g, '+')
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`
    link.rel = 'stylesheet'
    link.dataset.fontPreview = font.value

    // Check if already loaded
    const existing = document.querySelector(`link[data-font-preview="${font.value}"]`)
    if (existing) {
      setLoaded(true)
      return
    }

    link.onload = () => setLoaded(true)
    link.onerror = () => {
      console.warn('[FontPreview] Failed to load font:', font.value)
      setLoaded(true) // Show anyway with fallback
    }

    document.head.appendChild(link)

    // Cleanup on unmount
    return () => {
      // Don't remove the link - keep it cached for performance
      // Multiple previews may use the same font
    }
  }, [font.value])

  return (
    <span
      style={{
        fontFamily: loaded ? font.fontFamily : 'system-ui',
        opacity: loaded ? 1 : 0.6,
        transition: 'opacity 0.2s ease',
      }}
    >
      {showValue ? font.label : font.value}
    </span>
  )
}
