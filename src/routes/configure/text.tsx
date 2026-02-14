/**
 * Text Overlay Configurator
 * Visual configuration UI for text overlay parameters
 * Now with TanStack Form + Zod validation + ShadCN UI components
 */

import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { getBaseUrl } from '../../lib/baseUrl'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { FormNumberSlider } from '../../components/configure/form/FormNumberSlider'
import { FormColorArray } from '../../components/configure/form/FormColorArray'
import { FormTextInput } from '../../components/configure/form/FormTextInput'
import { FormColorPicker } from '../../components/configure/form/FormColorPicker'
import { FormSelectInput } from '../../components/configure/form/FormSelectInput'
import { FormSwitch } from '../../components/configure/form/FormSwitch'
import { FontSelect } from '../../components/configure/form/FontSelect'
import { AnimationSelect } from '../../components/configure/form/AnimationSelect'
import { AnimationTimeline } from '../../components/configure/form/AnimationTimeline'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import {
  TEXT_PRESET_OPTIONS,
  LINE_STYLE_OPTIONS,
  LINE_ANIMATION_OPTIONS,
  LINE_POSITION_OPTIONS,
  HORIZONTAL_ALIGN_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
  ENTRANCE_ANIMATION_OPTIONS,
  EXIT_ANIMATION_OPTIONS,
  BG_SHADOW_OPTIONS,
  COLOR_MODE_OPTIONS,
  BG_PANEL_DEFAULTS,
} from '../../lib/constants'
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
      return `${getBaseUrl()}/overlays/text`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== TEXT_DEFAULTS[key as keyof TextOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${getBaseUrl()}/overlays/text?${searchParams.toString()}`
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
                value={params.preset}
                onChange={(val) => {
                  field.handleChange(val as any)
                  updateState({ ...params, preset: val as any })
                }}
                options={TEXT_PRESET_OPTIONS}
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
                  value={params.text}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, text: val })
                  }}
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
                  value={params.sub}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, sub: val })
                  }}
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
                    value={params.size}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, size: val })
                    }}
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
                    value={params.subsize}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, subsize: val })
                    }}
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
                  value={params.font}
                  onValueChange={(value) => {
                    field.handleChange(value as any)
                    updateState({ ...params, font: value as any })
                  }}
                  showGoogleFonts={true}
                />
              )}
            </form.Field>
          </div>

          <form.Field name="weight">
            {(field) => (
              <FormNumberSlider
                label="Font Weight"
                value={params.weight}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, weight: val })
                }}
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
                <FormColorPicker
                  label="Text Color"
                  value={params.textcolor}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, textcolor: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for gradient"
                  help="Text color or leave empty for gradient"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="subcolor">
              {(field) => (
                <FormColorPicker
                  label="Subtitle Color"
                  value={params.subcolor}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, subcolor: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for gradient"
                  help="Subtitle color or leave empty for gradient"
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
                  value={params.padx}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, padx: val })
                  }}
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
                  value={params.pady}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, pady: val })
                  }}
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
                  value={params.marginx}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, marginx: val })
                  }}
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
                  value={params.marginy}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, marginy: val })
                  }}
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
                  value={params.offsetx}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, offsetx: val })
                  }}
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
                  value={params.offsety}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, offsety: val })
                  }}
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
                value={params.maxwidth}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, maxwidth: val })
                }}
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
                    value={params.align}
                    onChange={(val) => {
                      field.handleChange(val as any)
                      updateState({ ...params, align: val as any })
                    }}
                    options={HORIZONTAL_ALIGN_OPTIONS}
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>

              <form.Field name="valign">
                {(field) => (
                  <FormSelectInput
                    label="Vertical Align"
                    value={params.valign}
                    onChange={(val) => {
                      field.handleChange(val as any)
                      updateState({ ...params, valign: val as any })
                    }}
                    options={VERTICAL_ALIGN_OPTIONS}
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="bg">
              {(field) => (
                <FormSwitch
                  label="Show background panel"
                  checked={params.bg}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    updateState({ ...params, bg: checked })
                  }}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
        </CollapsibleSection>

        {/* Background Panel */}
        {params.bg && (
          <CollapsibleSection title="Background Panel" defaultOpen={false} storageKey="text-bgpanel">
            <form.Field name="bgcolor">
              {(field) => (
                <FormColorPicker
                  label="Background Color"
                  value={params.bgcolor}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, bgcolor: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for theme color"
                  help="Custom background color (empty = theme default)"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="bgopacity">
              {(field) => (
                <FormNumberSlider
                  label="Background Opacity"
                  value={Math.round(params.bgopacity * 100)}
                  onChange={(val) => {
                    const opacity = val / 100
                    field.handleChange(opacity)
                    updateState({ ...params, bgopacity: opacity })
                  }}
                  onBlur={field.handleBlur}
                  min={0}
                  max={100}
                  unit="%"
                  help="Panel background transparency"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="bgshadow">
              {(field) => (
                <FormSelectInput
                  label="Shadow"
                  value={params.bgshadow}
                  onChange={(val) => {
                    field.handleChange(val as any)
                    updateState({ ...params, bgshadow: val as any })
                  }}
                  options={BG_SHADOW_OPTIONS}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="bgblur">
                {(field) => (
                  <FormNumberSlider
                    label="Backdrop Blur"
                    value={params.bgblur}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, bgblur: val })
                    }}
                    onBlur={field.handleBlur}
                    min={0}
                    max={50}
                    unit="px"
                    help="Glassmorphism blur"
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>

              <form.Field name="bgradius">
                {(field) => (
                  <FormNumberSlider
                    label="Border Radius"
                    value={params.bgradius}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, bgradius: val })
                    }}
                    onBlur={field.handleBlur}
                    min={0}
                    max={50}
                    unit="px"
                    help="Corner rounding"
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>
            </div>
          </CollapsibleSection>
        )}

        {/* Section 6: Signature Line */}
        <CollapsibleSection title="Signature Line" defaultOpen={true} storageKey="text-line">
            <form.Field name="line">
              {(field) => (
                <FormSwitch
                  label="Show signature line"
                  checked={params.line}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    updateState({ ...params, line: checked })
                  }}
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
                      value={params.linestyle}
                      onChange={(val) => {
                        field.handleChange(val as any)
                        updateState({ ...params, linestyle: val as any })
                      }}
                      options={LINE_STYLE_OPTIONS}
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <form.Field name="lineanim">
                  {(field) => (
                    <FormSelectInput
                      label="Line Animation"
                      value={params.lineanim}
                      onChange={(val) => {
                        field.handleChange(val as any)
                        updateState({ ...params, lineanim: val as any })
                      }}
                      options={LINE_ANIMATION_OPTIONS}
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <form.Field name="linepos">
                  {(field) => (
                    <FormSelectInput
                      label="Line Position"
                      value={params.linepos}
                      onChange={(val) => {
                        field.handleChange(val as any)
                        updateState({ ...params, linepos: val as any })
                      }}
                      options={LINE_POSITION_OPTIONS}
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="linelength">
                    {(field) => (
                      <FormNumberSlider
                        label="Line Length"
                        value={params.linelength}
                        onChange={(val) => {
                          field.handleChange(val)
                          updateState({ ...params, linelength: val })
                        }}
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
                        value={params.linewidth}
                        onChange={(val) => {
                          field.handleChange(val)
                          updateState({ ...params, linewidth: val })
                        }}
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
                      value={params.linespeed}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, linespeed: val })
                      }}
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
                    value={params.entrance}
                    onValueChange={(value) => {
                      field.handleChange(value as any)
                      updateState({ ...params, entrance: value as any })
                    }}
                    onBlur={field.handleBlur}
                    options={ENTRANCE_ANIMATION_OPTIONS}
                  />
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="entrancespeed">
                {(field) => (
                  <FormNumberSlider
                    label="Entrance Speed"
                    value={params.entrancespeed}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, entrancespeed: val })
                    }}
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
                    value={params.delay}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, delay: val })
                    }}
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
                    value={params.exit}
                    onValueChange={(value) => {
                      field.handleChange(value as any)
                      updateState({ ...params, exit: value as any })
                    }}
                    onBlur={field.handleBlur}
                    options={EXIT_ANIMATION_OPTIONS}
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
                      value={params.exitspeed}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, exitspeed: val })
                      }}
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
                      value={params.exitafter}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, exitafter: val })
                      }}
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
                  checked={params.loop}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    updateState({ ...params, loop: checked })
                  }}
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
                      value={params.hold}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, hold: val })
                      }}
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
                      value={params.pause}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, pause: val })
                      }}
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

        {/* Animation Timeline */}
        <AnimationTimeline
          delay={params.delay}
          entrancespeed={params.entrancespeed}
          hold={params.hold}
          exitspeed={params.exitspeed}
          pause={params.pause}
          loop={params.loop}
          entrance={params.entrance}
          exit={params.exit}
          exitafter={params.exitafter}
        />

        {/* Section 9: Theme & Colors */}
        <CollapsibleSection
          title="Theme & Colors"
          defaultOpen={true}
          storageKey="text-theme"
          onReset={resetThemeColors}
        >
            <form.Field name="colormode">
              {(field) => (
                <FormSelectInput
                  label="Color Mode"
                  value={params.colormode}
                  onChange={(val) => {
                    field.handleChange(val as any)
                    updateState({ ...params, colormode: val as any })
                  }}
                  options={COLOR_MODE_OPTIONS}
                  help="Adjust gradient lightness to match your background"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <div>
              <label className="config-label">Gradient Preset</label>
              <form.Field name="gradient">
                {(field) => (
                  <GradientGrid
                    value={params.gradient}
                    onValueChange={(value) => {
                      field.handleChange(value as any)
                      updateState({ ...params, gradient: value as any })
                    }}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="textgradient">
              {(field) => (
                <FormSwitch
                  label="Apply gradient to text"
                  checked={params.textgradient}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    updateState({ ...params, textgradient: checked })
                  }}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="colors">
              {(field) => (
                <FormColorArray
                  label="Custom Colors"
                  colors={params.colors}
                  onChange={(colors) => {
                    field.handleChange(colors)
                    updateState({ ...params, colors })
                  }}
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
