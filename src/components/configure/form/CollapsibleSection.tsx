/**
 * CollapsibleSection Component
 * Wrapper around Shadcn Accordion for config sections
 */

import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion'

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  storageKey?: string // For remembering open/close state
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  storageKey,
  children,
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
          <AccordionTrigger className="text-2xl font-semibold hover:no-underline py-0 mb-6">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="space-y-5">{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
