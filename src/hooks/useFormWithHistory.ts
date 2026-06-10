/**
 * useFormWithHistory Hook
 * Integrates TanStack Form with useHistory for validation + undo/redo functionality
 */

import { useForm } from '@tanstack/react-form'
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

  // Track last synced values to prevent redundant sync cycles
  // This is the primary guard against infinite loops: both Form→History
  // and History→Form check against this before triggering updates
  const lastSyncedRef = useRef<string>(JSON.stringify(history.state))

  // Create TanStack Form instance
  // No validatorAdapter needed — Zod v4 implements Standard Schema,
  // which TanStack Form supports natively
  const form = useForm({
    defaultValues: history.state,
    validators: {
      // Validate on blur only (not onChange) for better UX
      // This prevents jittery error messages while typing
      onBlur: schema as any,
    },
  })

  // Sync Form → History: Update history when form changes
  useEffect(() => {
    const unsubscribe = form.store.subscribe(({ currentVal }) => {
      // Skip if we're currently updating from history (undo/redo)
      if (updatingFromHistory.current) {
        return
      }

      // Guard against undefined values during form initialization
      // TanStack Form's subscription can fire before values are hydrated
      if (currentVal.values === undefined || currentVal.values === null) {
        return
      }

      // Skip if values haven't actually changed
      // This prevents the circular update loop where:
      // form change → history.setState → setInternalState → history.state changes
      // → form.reset → form subscription fires again → history.setState → ...
      const serialized = JSON.stringify(currentVal.values)
      if (serialized === lastSyncedRef.current) {
        return
      }
      lastSyncedRef.current = serialized

      // Update history with form values
      // useHistory's setState is debounced (150ms)
      history.setState(currentVal.values as T)
    })

    return unsubscribe
  }, [form.store, history])

  // Sync History → Form: Update form when history changes (undo/redo)
  useEffect(() => {
    const historyStr = JSON.stringify(history.state)
    const currentStr = JSON.stringify(form.state.values)

    // Only update if values actually changed
    if (currentStr !== historyStr) {
      // Set flag to prevent circular updates
      updatingFromHistory.current = true
      lastSyncedRef.current = historyStr

      // Reset form to history state (skips validation)
      form.reset(history.state as any)

      // Clear flag after React finishes rendering
      // Using setTimeout ensures the flag is cleared after all effects run
      setTimeout(() => {
        updatingFromHistory.current = false
      }, 0)
    }
  }, [history.state, form])

  return form
}
