/**
 * Text Overlay Configurator
 * Visual configuration UI for text overlay parameters
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
import { FontSelect } from '../../components/configure/form/FontSelect'
import { AnimationSelect } from '../../components/configure/form/AnimationSelect'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import { TEXT_DEFAULTS } from '../../types/text.types'
import type { TextOverlayParams } from '../../types/text.types'
import { useHistory } from '../../hooks/useHistory'
import { useFormWithHistory } from '../../hooks/useFormWithHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'
import { TextOverlayHelp } from '../../components/configure/help/TextOverlayHelp'
import { textOverlaySchema } from '../../lib/validation/schemas'

export const Route = createFileRoute('/configure/text')({
  component: TextConfigurator,
})

function TextConfigurator() {
  // History management (undo/redo + debouncing)
  const history = useHistory<TextOverlayParams>(TEXT_DEFAULTS)
  const { state: params, updateState, undo, redo, canUndo, canRedo } = history

  // TanStack Form with Zod validation
  const form = useFormWithHistory({
    history,
    schema: textOverlaySchema,
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
  } = usePresets<TextOverlayParams>('text', TEXT_DEFAULTS)

  // Load preset with validation
  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      // Validate preset before loading
      const result = textOverlaySchema.safeParse(presetParams)
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
      textcolor: TEXT_DEFAULTS.textcolor,
      subcolor: TEXT_DEFAULTS.subcolor,
      textgradient: TEXT_DEFAULTS.textgradient,
      theme: TEXT_DEFAULTS.theme,
      gradient: TEXT_DEFAULTS.gradient,
      colors: TEXT_DEFAULTS.colors,
    })
  }

  const previewUrl = useMemo(() => {
    // Guard against undefined params during initialization
    if (!params) {
      return `${window.location.origin}/overlays/text`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== TEXT_DEFAULTS[key as keyof TextOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${window.location.origin}/overlays/text?${searchParams.toString()}`
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
                  { value: 'brb', label: 'Be Right Back' },
                  { value: 'chatting', label: 'Just Chatting' },
                  { value: 'starting', label: 'Starting Soon' },
                  { value: 'ending', label: 'Thanks for Watching' },
                  { value: 'technical', label: 'Technical Difficulties' },
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
        <CollapsibleSection title="Content" defaultOpen={true} storageKey="text-content">
            <form.Field name="text">
              {(field) => (
                <FormTextInput
                  label="Main Text"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  placeholder="Enter main text"
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
                  placeholder="Enter subtitle (optional)"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="size">
                {(field) => (
                  <FormNumberSlider
                    label="Text Size"
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    onBlur={field.handleBlur}
                    min={12}
                    max={200}
                    unit="px"
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>

              <form.Field name="subsize">
                {(field) => (
                  <FormNumberSlider
                    label="Subtitle Size"
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    onBlur={field.handleBlur}
                    min={8}
                    max={100}
                    unit="px"
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>
            </div>
        </CollapsibleSection>

        {/* Section 3: Typography */}
        <CollapsibleSection title="Typography" defaultOpen={false} storageKey="text-typography">
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

          <form.Field name="weight">
            {(field) => (
              <FormNumberSlider
                label="Font Weight"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={100}
                max={900}
                step={100}
                help="Controls the boldness of the text (100 = thin, 900 = black)"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="textcolor">
              {(field) => (
                <FormTextInput
                  label="Text Color"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for gradient"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="subcolor">
              {(field) => (
                <FormTextInput
                  label="Subtitle Color"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for gradient"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
          </div>
        </CollapsibleSection>

        {/* Section 4: Spacing & Position */}
        <CollapsibleSection title="Spacing & Position" defaultOpen={false} storageKey="text-spacing">
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="padx">
              {(field) => (
                <FormNumberSlider
                  label="Padding X"
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

            <form.Field name="pady">
              {(field) => (
                <FormNumberSlider
                  label="Padding Y"
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

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="marginx">
              {(field) => (
                <FormNumberSlider
                  label="Margin X"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={0}
                  max={200}
                  unit="px"
                  help="Horizontal margin from edge"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="marginy">
              {(field) => (
                <FormNumberSlider
                  label="Margin Y"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={0}
                  max={200}
                  unit="px"
                  help="Vertical margin from edge"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="offsetx">
              {(field) => (
                <FormNumberSlider
                  label="Offset X"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={-500}
                  max={500}
                  unit="px"
                  help="Fine-tune horizontal position"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="offsety">
              {(field) => (
                <FormNumberSlider
                  label="Offset Y"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  min={-500}
                  max={500}
                  unit="px"
                  help="Fine-tune vertical position"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
          </div>

          <form.Field name="maxwidth">
            {(field) => (
              <FormTextInput
                label="Max Width"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                placeholder="auto, 500px, 80%, etc."
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </CollapsibleSection>

        {/* Section 5: Layout */}
        <CollapsibleSection title="Layout" defaultOpen={true} storageKey="text-layout">
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
                  label="Show background panel"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
        </CollapsibleSection>

        {/* Section 6: Signature Line */}
        <CollapsibleSection title="Signature Line" defaultOpen={true} storageKey="text-line">
            <form.Field name="line">
              {(field) => (
                <FormSwitch
                  label="Show signature line"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            {params.line && (
              <>
                <form.Field name="linestyle">
                  {(field) => (
                    <FormSelectInput
                      label="Line Style"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as any)}
                      options={[
                        { value: 'solid', label: 'Solid' },
                        { value: 'dashed', label: 'Dashed' },
                        { value: 'dotted', label: 'Dotted' },
                        { value: 'gradient', label: 'Gradient' },
                        { value: 'slant', label: 'Slant' },
                        { value: 'wave', label: 'Wave' },
                        { value: 'swirl', label: 'Swirl' },
                        { value: 'bracket', label: 'Bracket' },
                      ]}
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <form.Field name="lineanim">
                  {(field) => (
                    <FormSelectInput
                      label="Line Animation"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as any)}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'slide', label: 'Slide' },
                        { value: 'grow', label: 'Grow' },
                        { value: 'pulse', label: 'Pulse' },
                      ]}
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <form.Field name="linepos">
                  {(field) => (
                    <FormSelectInput
                      label="Line Position"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as any)}
                      options={[
                        { value: 'top', label: 'Top' },
                        { value: 'bottom', label: 'Bottom' },
                        { value: 'both', label: 'Both' },
                      ]}
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="linelength">
                    {(field) => (
                      <FormNumberSlider
                        label="Line Length"
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val)}
                        onBlur={field.handleBlur}
                        min={0}
                        max={100}
                        unit="%"
                        help="Line length as percentage of container width"
                        error={field.state.meta.errors?.[0]}
                      />
                    )}
                  </form.Field>

                  <form.Field name="linewidth">
                    {(field) => (
                      <FormNumberSlider
                        label="Line Width"
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val)}
                        onBlur={field.handleBlur}
                        min={1}
                        max={10}
                        unit="px"
                        help="Line stroke thickness"
                        error={field.state.meta.errors?.[0]}
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="linespeed">
                  {(field) => (
                    <FormNumberSlider
                      label="Line Speed"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                      min={0.5}
                      max={5}
                      step={0.1}
                      unit="s"
                      help="Animation speed in seconds"
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>
              </>
            )}
        </CollapsibleSection>

        {/* Section 7: Animations */}
        <CollapsibleSection title="Animations" defaultOpen={true} storageKey="text-animations">
            <div>
              <label className="config-label">Entrance Animation</label>
              <form.Field name="entrance">
                {(field) => (
                  <AnimationSelect
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                    onBlur={field.handleBlur}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'fade', label: 'Fade' },
                      { value: 'slideUp', label: 'Slide Up' },
                      { value: 'slideDown', label: 'Slide Down' },
                      { value: 'slideLeft', label: 'Slide Left' },
                      { value: 'slideRight', label: 'Slide Right' },
                      { value: 'scale', label: 'Scale' },
                      { value: 'bounce', label: 'Bounce' },
                      { value: 'typewriter', label: 'Typewriter' },
                      { value: 'flipIn', label: 'Flip In' },
                      { value: 'zoomBounce', label: 'Zoom Bounce' },
                      { value: 'rotateIn', label: 'Rotate In' },
                      { value: 'zoomIn', label: 'Zoom In' },
                      { value: 'stagger', label: 'Stagger' },
                    ]}
                  />
                )}
              </form.Field>
            </div>

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

            <div>
              <label className="config-label">Exit Animation</label>
              <form.Field name="exit">
                {(field) => (
                  <AnimationSelect
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                    onBlur={field.handleBlur}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'fade', label: 'Fade' },
                      { value: 'slideDown', label: 'Slide Down' },
                      { value: 'slideUp', label: 'Slide Up' },
                      { value: 'slideLeft', label: 'Slide Left' },
                      { value: 'slideRight', label: 'Slide Right' },
                      { value: 'scale', label: 'Scale' },
                      { value: 'fadeLeft', label: 'Fade Left' },
                      { value: 'zoomOut', label: 'Zoom Out' },
                      { value: 'rotateOut', label: 'Rotate Out' },
                      { value: 'flipOut', label: 'Flip Out' },
                    ]}
                  />
                )}
              </form.Field>
            </div>

            {params.exit !== 'none' && (
              <div className="grid grid-cols-2 gap-4">
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

                <form.Field name="exitafter">
                  {(field) => (
                    <FormNumberSlider
                      label="Exit After"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                      min={0}
                      max={300}
                      unit="s"
                      help="Auto-exit after N seconds (0 = manual)"
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>
              </div>
            )}
        </CollapsibleSection>

        {/* Section 8: Loop Mode */}
        <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="text-loop">
            <form.Field name="loop">
              {(field) => (
                <FormSwitch
                  label="Enable loop mode (appear → hold → disappear → pause → repeat)"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
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
          defaultOpen={true}
          storageKey="text-theme"
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

            <form.Field name="textgradient">
              {(field) => (
                <FormSwitch
                  label="Apply gradient to text"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

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
          storageKey="text-help"
        >
          <TextOverlayHelp />
        </CollapsibleSection>
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      overlayTitle="Text Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/text"
          params={params}
          defaults={TEXT_DEFAULTS}
          overlayType="text"
          onImportConfig={(importedParams) => updateState(importedParams as TextOverlayParams)}
        />
      }
      undoRedoControls={{ undo, redo, canUndo, canRedo }}
    />
  )
}
