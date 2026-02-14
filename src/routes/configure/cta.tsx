/**
 * CTA Overlay Configurator
 * Visual configuration UI for call-to-action overlay parameters
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
import { IconSelect } from '../../components/configure/form/IconSelect'
import { FontSelect } from '../../components/configure/form/FontSelect'
import { AnimationSelect } from '../../components/configure/form/AnimationSelect'
import { AnimationTimeline } from '../../components/configure/form/AnimationTimeline'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import {
  CTA_PRESET_OPTIONS,
  CTA_ICON_OPTIONS,
  ICON_ANIMATION_OPTIONS,
  ICON_POSITION_OPTIONS,
  DECORATION_STYLE_OPTIONS,
  HORIZONTAL_ALIGN_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
  ENTRANCE_ANIMATION_OPTIONS,
  EXIT_ANIMATION_OPTIONS,
  BG_SHADOW_OPTIONS,
  COLOR_MODE_OPTIONS,
  BG_PANEL_DEFAULTS,
} from '../../lib/constants'
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
      return `${getBaseUrl()}/overlays/cta`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== CTA_DEFAULTS[key as keyof CTAOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${getBaseUrl()}/overlays/cta?${searchParams.toString()}`
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
              options={CTA_PRESET_OPTIONS}
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
              value={params.text}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, text: val })
              }}
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
              value={params.sub}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, sub: val })
              }}
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
              value={params.size}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, size: val })
              }}
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
                value={params.icon}
                onValueChange={(value) => {
                  field.handleChange(value as any)
                  updateState({ ...params, icon: value as any })
                }}
                options={CTA_ICON_OPTIONS}
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
                  value={params.customicon}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, customicon: val })
                  }}
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
                  value={params.iconpos}
                  onChange={(val) => {
                    field.handleChange(val as any)
                    updateState({ ...params, iconpos: val as any })
                  }}
                  options={ICON_POSITION_OPTIONS}
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <div>
              <label className="config-label">Icon Animation</label>
              <form.Field name="iconanim">
                {(field) => (
                  <AnimationSelect
                    value={params.iconanim}
                    onValueChange={(value) => {
                      field.handleChange(value as any)
                      updateState({ ...params, iconanim: value as any })
                    }}
                    onBlur={field.handleBlur}
                    options={ICON_ANIMATION_OPTIONS}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="iconsize">
              {(field) => (
                <FormNumberSlider
                  label="Icon Size Override"
                  value={params.iconsize}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, iconsize: val })
                  }}
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
                <FormColorPicker
                  label="Icon Color"
                  value={params.iconcolor}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, iconcolor: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Leave empty for auto color"
                  help="Leave empty for gradient color"
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

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="textpadx">
            {(field) => (
              <FormNumberSlider
                label="Text Padding X"
                value={params.textpadx}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, textpadx: val })
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

          <form.Field name="textpady">
            {(field) => (
              <FormNumberSlider
                label="Text Padding Y"
                value={params.textpady}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, textpady: val })
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

        <form.Field name="letterspacing">
          {(field) => (
            <FormNumberSlider
              label="Letter Spacing"
              value={params.letterspacing}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, letterspacing: val })
              }}
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
              value={params.lineheight}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, lineheight: val })
              }}
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
              value={params.decoration}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, decoration: val as any })
              }}
              options={DECORATION_STYLE_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.decoration !== 'none' && (
          <form.Field name="decorationcolor">
            {(field) => (
              <FormColorPicker
                label="Decoration Color"
                value={params.decorationcolor}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, decorationcolor: val })
                }}
                onBlur={field.handleBlur}
                placeholder="Leave empty for auto color"
                help="Leave empty for gradient color"
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
              label="Show Background Panel"
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
        <CollapsibleSection title="Background Panel" defaultOpen={false} storageKey="cta-bgpanel">
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

      {/* Section 7: Animations */}
      <CollapsibleSection title="Animations" defaultOpen={false} storageKey="cta-animations">
        <form.Field name="entrance">
          {(field) => (
            <FormSelectInput
              label="Entrance Animation"
              value={params.entrance}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, entrance: val as any })
              }}
              options={ENTRANCE_ANIMATION_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

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

        <form.Field name="exit">
          {(field) => (
            <FormSelectInput
              label="Exit Animation"
              value={params.exit}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, exit: val as any })
              }}
              options={EXIT_ANIMATION_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.exit !== 'none' && (
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
        )}
      </CollapsibleSection>

      {/* Section 8: Loop Mode */}
      <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="cta-loop">
        <form.Field name="loop">
          {(field) => (
            <FormSwitch
              label="Enable Loop Mode"
              checked={params.loop}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, loop: checked })
              }}
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
                  value={params.hold}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, hold: val })
                  }}
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
                  value={params.pause}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, pause: val })
                  }}
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
      />

      {/* Section 9: Theme & Colors */}
      <CollapsibleSection
        title="Theme & Colors"
        defaultOpen={false}
        storageKey="cta-theme"
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
