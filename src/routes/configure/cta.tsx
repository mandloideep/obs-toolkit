/**
 * CTA Overlay Configurator
 * Visual configuration UI for call-to-action overlay parameters
 * Now with TanStack Form + Zod validation + ShadCN UI components
 */

import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { FormNumberSlider } from '../../components/configure/form/FormNumberSlider'
import { FormColorArray } from '../../components/configure/form/FormColorArray'
import { FormTextInput } from '../../components/configure/form/FormTextInput'
import { FormSelectInput } from '../../components/configure/form/FormSelectInput'
import { FormSwitch } from '../../components/configure/form/FormSwitch'
import { IconSelect } from '../../components/configure/form/IconSelect'
import { FontSelect } from '../../components/configure/form/FontSelect'
import { AnimationSelect } from '../../components/configure/form/AnimationSelect'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import { CTA_DEFAULTS } from '../../types/cta.types'
import type { CTAOverlayParams } from '../../types/cta.types'
import { useHistory } from '../../hooks/useHistory'
import { useFormWithHistory } from '../../hooks/useFormWithHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'
import { CTAOverlayHelp } from '../../components/configure/help/CTAOverlayHelp'
import { ctaOverlaySchema } from '../../lib/validation/schemas'

export const Route = createFileRoute('/configure/cta')({
  component: CTAConfigurator,
})

function CTAConfigurator() {
  // History management (undo/redo + debouncing)
  const history = useHistory<CTAOverlayParams>(CTA_DEFAULTS)
  const { state: params, updateState, undo, redo, canUndo, canRedo } = history

  // TanStack Form with Zod validation
  const form = useFormWithHistory({
    history,
    schema: ctaOverlaySchema,
  })

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'z', ctrlOrCmd: true, shift: false, callback: undo },
    { key: 'z', ctrlOrCmd: true, shift: true, callback: redo },
  ])

  // Presets management
  const {
    presets,
    currentPresetName,
    loadPreset,
    savePreset,
    deletePreset,
    renamePreset,
    exportPreset,
    importPreset,
  } = usePresets<CTAOverlayParams>('cta', CTA_DEFAULTS)

  // Load preset with validation
  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      // Validate preset before loading
      const result = ctaOverlaySchema.safeParse(presetParams)
      if (result.success) {
        updateState(result.data)
      } else {
        console.error('Invalid preset:', result.error)
        // Still load it but show warning
        updateState(presetParams)
      }
    }
  }

  // Section-specific reset handlers (use updateState for immediate history entry)
  const resetThemeColors = () => {
    updateState({
      ...params,
      theme: CTA_DEFAULTS.theme,
      gradient: CTA_DEFAULTS.gradient,
      colors: CTA_DEFAULTS.colors,
    })
  }

  const previewUrl = useMemo(() => {
    // Guard against undefined params during initialization
    if (!params) {
      return `${window.location.origin}/overlays/cta`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== CTA_DEFAULTS[key as keyof CTAOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${window.location.origin}/overlays/cta?${searchParams.toString()}`
  }, [params])

  const configSections = (
    <>
      {/* Section 1: Quick Presets */}
      <div className="config-section">
        <h2 className="text-2xl font-semibold mb-6">Quick Presets</h2>
        <form.Field name="preset">
          {(field) => (
            <FormSelectInput
              label="Preset"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as any)}
              options={[
                { value: 'custom', label: 'Custom' },
                { value: 'subscribe', label: 'Subscribe' },
                { value: 'like', label: 'Like & Subscribe' },
                { value: 'follow', label: 'Follow' },
                { value: 'share', label: 'Share' },
                { value: 'notify', label: 'Turn on Notifications' },
              ]}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </div>

      {/* Custom Presets Manager */}
      <PresetManager
        presets={presets}
        currentPresetName={currentPresetName}
        currentParams={params}
        onLoadPreset={handleLoadPreset}
        onSavePreset={savePreset}
        onDeletePreset={deletePreset}
        onRenamePreset={renamePreset}
        onExportPreset={exportPreset}
        onImportPreset={importPreset}
      />

      {/* Section 2: Content */}
      <CollapsibleSection title="Content" defaultOpen={true} storageKey="cta-content">
        <form.Field name="text">
          {(field) => (
            <FormTextInput
              label="Main Text"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              placeholder="e.g., Subscribe"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="sub">
          {(field) => (
            <FormTextInput
              label="Subtitle"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              placeholder="e.g., for more content!"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="size">
          {(field) => (
            <FormNumberSlider
              label="Text Size"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              min={12}
              max={100}
              unit="px"
              help="Font size for main text"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 3: Icon Customization */}
      <CollapsibleSection title="Icon Customization" defaultOpen={true} storageKey="cta-icon">
        <div>
          <label className="config-label">Icon Type</label>
          <form.Field name="icon">
            {(field) => (
              <IconSelect
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'like', label: 'Thumbs Up (Like)' },
                  { value: 'sub', label: 'YouTube Subscribe' },
                  { value: 'bell', label: 'Bell (Notifications)' },
                  { value: 'share', label: 'Share' },
                  { value: 'heart', label: 'Heart' },
                  { value: 'star', label: 'Star' },
                  { value: 'follow', label: 'Follow' },
                ]}
              />
            )}
          </form.Field>
        </div>

        {params.icon !== 'none' && (
          <>
            <form.Field name="customicon">
              {(field) => (
                <FormTextInput
                  label="Custom Icon (Lucide name)"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty to use preset icon"
                  help="Override with any Lucide icon name (e.g., 'heart', 'star', 'bell')"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="iconpos">
              {(field) => (
                <FormSelectInput
                  label="Icon Position"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val as any)}
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                  ]}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <div>
              <label className="config-label">Icon Animation</label>
              <form.Field name="iconanim">
                {(field) => (
                  <AnimationSelect
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                    onBlur={field.handleBlur}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'bounce', label: 'Bounce' },
                      { value: 'shake', label: 'Shake' },
                      { value: 'pulse', label: 'Pulse' },
                      { value: 'spin', label: 'Spin' },
                      { value: 'wiggle', label: 'Wiggle' },
                      { value: 'flip', label: 'Flip' },
                      { value: 'heartbeat', label: 'Heartbeat' },
                    ]}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="iconsize">
              {(field) => (
                <FormNumberSlider
                  label="Icon Size Override"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={0}
                  max={100}
                  unit="px"
                  help="0 = auto size, otherwise custom size"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="iconcolor">
              {(field) => (
                <FormTextInput
                  label="Icon Color"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for auto color"
                  help="Hex color (e.g., FF0000) or leave empty for gradient color"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
          </>
        )}
      </CollapsibleSection>

      {/* Section 4: Text Styling */}
      <CollapsibleSection title="Text Styling" defaultOpen={false} storageKey="cta-text">
        <div>
          <label className="config-label">Font Family</label>
          <form.Field name="font">
            {(field) => (
              <FontSelect
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
                showGoogleFonts={true}
              />
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="textpadx">
            {(field) => (
              <FormNumberSlider
                label="Text Padding X"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0}
                max={100}
                unit="px"
                help="Horizontal padding around text"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="textpady">
            {(field) => (
              <FormNumberSlider
                label="Text Padding Y"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0}
                max={100}
                unit="px"
                help="Vertical padding around text"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="letterspacing">
          {(field) => (
            <FormNumberSlider
              label="Letter Spacing"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              min={-2}
              max={4}
              step={0.1}
              unit="px"
              help="Space between letters"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="lineheight">
          {(field) => (
            <FormNumberSlider
              label="Line Height"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              min={0.8}
              max={2}
              step={0.1}
              help="Line height multiplier (1.2 = 120%)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 5: Decoration */}
      <CollapsibleSection title="Decoration" defaultOpen={false} storageKey="cta-decoration">
        <form.Field name="decoration">
          {(field) => (
            <FormSelectInput
              label="Decoration Style"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as any)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'line', label: 'Line' },
                { value: 'slant', label: 'Slant' },
                { value: 'swirl', label: 'Swirl' },
              ]}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.decoration !== 'none' && (
          <form.Field name="decorationcolor">
            {(field) => (
              <FormTextInput
                label="Decoration Color"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                placeholder="Leave empty for auto color"
                help="Hex color or leave empty for gradient color"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 6: Layout */}
      <CollapsibleSection title="Layout" defaultOpen={false} storageKey="cta-layout">
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="align">
            {(field) => (
              <FormSelectInput
                label="Horizontal Align"
                value={field.state.value}
                onChange={(val) => field.handleChange(val as any)}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ]}
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="valign">
            {(field) => (
              <FormSelectInput
                label="Vertical Align"
                value={field.state.value}
                onChange={(val) => field.handleChange(val as any)}
                options={[
                  { value: 'top', label: 'Top' },
                  { value: 'center', label: 'Center' },
                  { value: 'bottom', label: 'Bottom' },
                ]}
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="bg">
          {(field) => (
            <FormSwitch
              label="Show Background Panel"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 7: Animations */}
      <CollapsibleSection title="Animations" defaultOpen={false} storageKey="cta-animations">
        <form.Field name="entrance">
          {(field) => (
            <FormSelectInput
              label="Entrance Animation"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as any)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'fade', label: 'Fade' },
                { value: 'slideUp', label: 'Slide Up' },
                { value: 'slideDown', label: 'Slide Down' },
                { value: 'slideLeft', label: 'Slide Left' },
                { value: 'slideRight', label: 'Slide Right' },
                { value: 'scale', label: 'Scale' },
                { value: 'bounce', label: 'Bounce' },
              ]}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="entrancespeed">
            {(field) => (
              <FormNumberSlider
                label="Entrance Speed"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0.1}
                max={5}
                step={0.1}
                unit="s"
                help="Duration of entrance animation"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="delay">
            {(field) => (
              <FormNumberSlider
                label="Entrance Delay"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0}
                max={10}
                step={0.1}
                unit="s"
                help="Delay before animation starts"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="exit">
          {(field) => (
            <FormSelectInput
              label="Exit Animation"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as any)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'fade', label: 'Fade' },
                { value: 'slideDown', label: 'Slide Down' },
                { value: 'slideUp', label: 'Slide Up' },
                { value: 'scale', label: 'Scale' },
              ]}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.exit !== 'none' && (
          <form.Field name="exitspeed">
            {(field) => (
              <FormNumberSlider
                label="Exit Speed"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0.1}
                max={5}
                step={0.1}
                unit="s"
                help="Duration of exit animation"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 8: Loop Mode */}
      <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="cta-loop">
        <form.Field name="loop">
          {(field) => (
            <FormSwitch
              label="Enable Loop Mode"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              help="Appear → hold → disappear → pause → repeat"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.loop && (
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="hold">
              {(field) => (
                <FormNumberSlider
                  label="Hold Visible"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={1}
                  max={60}
                  unit="s"
                  help="How long to stay visible"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="pause">
              {(field) => (
                <FormNumberSlider
                  label="Pause Hidden"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={0}
                  max={60}
                  unit="s"
                  help="How long to stay hidden"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
          </div>
        )}
      </CollapsibleSection>

      {/* Section 9: Theme & Colors */}
      <CollapsibleSection
        title="Theme & Colors"
        defaultOpen={false}
        storageKey="cta-theme"
        onReset={resetThemeColors}
      >
        <div>
          <label className="config-label">Gradient Preset</label>
          <form.Field name="gradient">
            {(field) => (
              <GradientGrid
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="colors">
          {(field) => (
            <FormColorArray
              label="Custom Colors"
              colors={field.state.value}
              onChange={(colors) => field.handleChange(colors)}
              maxColors={5}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Help & Guides */}
      <CollapsibleSection
        title="Help & Guides"
        defaultOpen={false}
        storageKey="cta-help"
      >
        <CTAOverlayHelp />
      </CollapsibleSection>
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      overlayTitle="CTA Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/cta"
          params={params}
          defaults={CTA_DEFAULTS}
          overlayType="cta"
          onImportConfig={(importedParams) => updateState(importedParams as CTAOverlayParams)}
        />
      }
      undoRedoControls={{ undo, redo, canUndo, canRedo }}
    />
  )
}
