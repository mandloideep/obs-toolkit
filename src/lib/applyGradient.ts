/**
 * Helper to wire `FormColorPicker`'s `onApplyGradient` callback to an overlay's
 * params shape. Different overlays route the gradient name to different fields
 * (the main `gradient` field for most things, `bggradientname` for background
 * panels) and toggle different booleans (`textgradient`, `bggradient`,
 * `linestyle: 'gradient'`, etc.) when switching from solid color to gradient.
 *
 * Usage:
 *   onApplyGradient={buildApplyGradient(params, updateState, {
 *     colorField: 'linecolor',
 *     extras: { linestyle: 'gradient' },
 *   })}
 */

export type GradientVariantMode = 'darker' | 'dark' | 'normal' | 'light' | 'lighter'

export interface ApplyGradientSpec<P> {
  /** Field to clear (the per-element color override) */
  colorField: keyof P
  /** Where to write the gradient name. Defaults to `'gradient'`. */
  gradientField?: keyof P
  /** Where to write the variant mode. Defaults to `'colormode'`. */
  colorModeField?: keyof P
  /** Extra fields to set alongside (e.g. `{ textgradient: true }`). */
  extras?: Partial<P>
}

export function buildApplyGradient<P extends object>(
  params: P,
  updateState: (p: P) => void,
  spec: ApplyGradientSpec<P>
): (gradient: string, mode: GradientVariantMode) => void {
  return (gradient, mode) => {
    const gradientKey = (spec.gradientField ?? 'gradient') as string
    const colorModeKey = (spec.colorModeField ?? 'colormode') as string
    updateState({
      ...params,
      [spec.colorField]: '',
      [gradientKey]: gradient,
      [colorModeKey]: mode,
      ...(spec.extras ?? {}),
    } as P)
  }
}
