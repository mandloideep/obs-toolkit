/**
 * useFormWithHistory Hook
 * Integrates TanStack Form with useHistory for validation + undo/redo functionality
 */

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useEffect, useRef } from 'react'
import type { UseHistoryReturn } from './useHistory'
import type { z } from 'zod'

interface UseFormWithHistoryOptions<T> {
  history: UseHistoryReturn<T>
  schema: z.ZodType<T>
}

/**
 * Creates a TanStack Form instance integrated with useHistory
 *
 * Features:
 * - Bidirectional sync between form and history state
 * - Validation on blur (not onChange for better UX)
 * - Undo/redo support without circular updates
 * - Debounced state updates via useHistory (300ms)
 *
 * @param history - useHistory hook instance
 * @param schema - Zod validation schema
 * @returns TanStack Form instance
 *
 * @example
 * ```tsx
 * const history = useHistory<BorderOverlayParams>(BORDER_DEFAULTS)
 * const form = useFormWithHistory({
 *   history,
 *   schema: borderOverlaySchema
 * })
 *
 * <form.Field name="thickness">
 *   {(field) => <FormNumberSlider field={field} ... />}
 * </form.Field>
 * ```
 */
export function useFormWithHistory<T extends Record<string, any>>({
  history,
  schema,
}: UseFormWithHistoryOptions<T>) {
  // Track whether we're updating from history (undo/redo)
  // This prevents circular updates: history -> form -> history -> ...
  const updatingFromHistory = useRef(false)

  // Create TanStack Form instance
  const form = useForm({
    defaultValues: history.state,
    validatorAdapter: zodValidator(),
    validators: {
      // Validate on blur only (not onChange) for better UX
      // This prevents jittery error messages while typing
      onBlur: schema,
    },
  })

  // Sync Form → History: Update history when form changes
  useEffect(() => {
    const unsubscribe = form.store.subscribe((formState) => {
      // Skip if we're currently updating from history (undo/redo)
      if (updatingFromHistory.current) {
        return
      }

      // Only update history if form is valid
      // Invalid states don't trigger history updates
      if (formState.isValid) {
        // useHistory's setState is debounced (300ms)
        // This prevents excessive history entries during rapid input
        history.setState(formState.values as T)
      }
    })

    return unsubscribe
  }, [form.store, history])

  // Sync History → Form: Update form when history changes (undo/redo)
  useEffect(() => {
    const currentValues = form.getFieldValue('') // Get all form values

    // Only update if values actually changed
    // This prevents unnecessary re-renders
    if (JSON.stringify(currentValues) !== JSON.stringify(history.state)) {
      // Set flag to prevent circular updates
      updatingFromHistory.current = true

      // Update form with history state
      // validate: false - Skip validation when restoring from history
      // This allows invalid historical states to be restored
      // (user might have had invalid state before validation was added)
      form.update({
        values: history.state as any,
        fieldMeta: {},
      })

      // Clear flag after React finishes rendering
      // Using setTimeout ensures the flag is cleared after all effects run
      setTimeout(() => {
        updatingFromHistory.current = false
      }, 0)
    }
  }, [history.state, form])

  return form
}
