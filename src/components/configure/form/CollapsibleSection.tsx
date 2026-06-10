/**
 * CollapsibleSection Component
 * Wrapper around Shadcn Accordion for config sections
 */

import { useState, useEffect } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion'
import { Button } from '../../ui/button'

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  storageKey?: string // For remembering open/close state
  children: React.ReactNode
  onReset?: () => void // Optional callback to reset this section's params
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  storageKey,
  children,
  onReset,
}: CollapsibleSectionProps) {
  // Load saved state from localStorage if storageKey provided
  const [value, setValue] = useState<string>(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`collapsible-${storageKey}`)
      if (saved !== null) {
        return saved === 'open' ? 'item' : ''
      }
    }
    return defaultOpen ? 'item' : ''
  })

  // Save state to localStorage when it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`collapsible-${storageKey}`, value === 'item' ? 'open' : 'closed')
    }
  }, [value, storageKey])

  return (
    <div className="config-section">
      <Accordion type="single" collapsible value={value} onValueChange={setValue}>
        <AccordionItem value="item" className="border-0">
          {/* Header with optional reset button */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline py-0 flex-1">
              {title}
            </AccordionTrigger>
            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation() // Prevent accordion toggle
                  onReset()
                }}
                className="text-xs text-dark-muted hover:text-dark-text shrink-0"
                title="Reset this section to defaults"
              >
                Reset Section
              </Button>
            )}
          </div>
          <AccordionContent className="pb-0">
            <div className="space-y-5">{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
