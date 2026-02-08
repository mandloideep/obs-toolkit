/**
 * Border Overlay Configurator
 * Visual configuration UI for border overlay parameters
 * Now with TanStack Form + Zod validation + ShadCN UI components
 */

import { createFileRoute } from '@tanstack/react-router'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { FormNumberSlider } from '../../components/configure/form/FormNumberSlider'
import { FormColorArray } from '../../components/configure/form/FormColorArray'
import { FormSelectInput } from '../../components/configure/form/FormSelectInput'
import { FormSwitch } from '../../components/configure/form/FormSwitch'
import { AnimationSelect } from '../../components/configure/form/AnimationSelect'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import { Label } from '../../components/ui/label'
import { BORDER_DEFAULTS } from '../../types/border.types'
import type { BorderOverlayParams } from '../../types/border.types'
import { useHistory } from '../../hooks/useHistory'
import { useFormWithHistory } from '../../hooks/useFormWithHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'
import { BorderOverlayHelp } from '../../components/configure/help/BorderOverlayHelp'
import { borderOverlaySchema } from '../../lib/validation/schemas'

export const Route = createFileRoute('/configure/border')({
  component: BorderConfigurator,
})

function BorderConfigurator() {
  // History management (undo/redo + debouncing)
  const history = useHistory<BorderOverlayParams>(BORDER_DEFAULTS)
  const { state: params, updateState, undo, redo, canUndo, canRedo } = history

  // TanStack Form with Zod validation
  const form = useFormWithHistory({
    history,
    schema: borderOverlaySchema,
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
  } = usePresets<BorderOverlayParams>('border', BORDER_DEFAULTS)

  // Load preset with validation
  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      // Validate preset before loading
      const result = borderOverlaySchema.safeParse(presetParams)
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
  const resetColorsGradient = () => {
    updateState({
      ...params,
      gradient: BORDER_DEFAULTS.gradient,
      colors: BORDER_DEFAULTS.colors,
      random: BORDER_DEFAULTS.random,
      multicolor: BORDER_DEFAULTS.multicolor,
      colorshift: BORDER_DEFAULTS.colorshift,
      shiftspeed: BORDER_DEFAULTS.shiftspeed,
    })
  }

  // Generate preview URL
  const previewUrl = `${window.location.origin}/overlays/border?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== BORDER_DEFAULTS[key as keyof BorderOverlayParams]) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()}`

  const configSections = (
    <>
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

      {/* Section 1: Basic Configuration */}
      <CollapsibleSection title="Basic Configuration" defaultOpen={true} storageKey="border-basic">
        <form.Field name="shape">
          {(field) => (
            <FormSelectInput
              label="Shape"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as any)}
              options={[
                { value: 'rect', label: 'Rectangle' },
                { value: 'circle', label: 'Circle' },
              ]}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="style">
          {(field) => (
            <FormSelectInput
              label="Style"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as any)}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
                { value: 'double', label: 'Double' },
                { value: 'neon', label: 'Neon' },
              ]}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <div>
          <label className="config-label">Animation</label>
          <form.Field name="animation">
            {(field) => (
              <AnimationSelect
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'dash', label: 'Dash' },
                  { value: 'rotate', label: 'Rotate' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'breathe', label: 'Breathe' },
                ]}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="thickness">
          {(field) => (
            <FormNumberSlider
              label="Thickness"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              min={1}
              max={50}
              unit="px"
              help="Border thickness in pixels"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="speed">
          {(field) => (
            <FormNumberSlider
              label="Animation Speed"
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
              onBlur={field.handleBlur}
              min={0.1}
              max={10}
              step={0.1}
              unit="s"
              help="Animation cycle duration"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.shape === 'rect' && (
          <form.Field name="r">
            {(field) => (
              <FormNumberSlider
                label="Corner Radius"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0}
                max={50}
                unit="px"
                help="Rounded corners for rectangles"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}

        {params.style === 'dashed' && (
          <form.Field name="dash">
            {(field) => (
              <FormNumberSlider
                label="Dash Ratio"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0}
                max={1}
                step={0.1}
                help="Visible portion of dash (0-1)"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 2: Colors & Gradient */}
      <CollapsibleSection
        title="Colors & Gradient"
        defaultOpen={true}
        storageKey="border-colors"
        onReset={resetColorsGradient}
      >
        <div>
          <label className="config-label">Gradient Preset</label>
          <form.Field name="gradient">
            {(field) => (
              <GradientGrid
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="multicolor">
          {(field) => (
            <FormSwitch
              label="Multi-color Mode"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              help="Cycle through all gradients"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="colorshift">
          {(field) => (
            <FormSwitch
              label="Color Shift"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              help="Smooth color transitions"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {(params.multicolor || params.colorshift) && (
          <form.Field name="shiftspeed">
            {(field) => (
              <FormNumberSlider
                label="Shift Speed"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={1}
                max={30}
                unit="s"
                help="Color cycle duration"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}

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

        <form.Field name="random">
          {(field) => (
            <FormSwitch
              label="Random Gradient"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              help="Randomize gradient on load"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 3: Visual Effects */}
      <CollapsibleSection title="Visual Effects" defaultOpen={false} storageKey="border-effects">
        <form.Field name="glow">
          {(field) => (
            <FormSwitch
              label="Glow Effect"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.glow && (
          <form.Field name="glowsize">
            {(field) => (
              <FormNumberSlider
                label="Glow Size"
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                min={0}
                max={20}
                unit="px"
                help="Glow blur radius"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}

        <form.Field name="opacity">
          {(field) => (
            <FormNumberSlider
              label="Opacity"
              value={field.state.value * 100}
              onChange={(val) => field.handleChange(val / 100)}
              onBlur={field.handleBlur}
              min={0}
              max={100}
              unit="%"
              help="Border opacity (0-100%)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Help & Guides */}
      <CollapsibleSection
        title="Help & Guides"
        defaultOpen={false}
        storageKey="border-help"
      >
        <BorderOverlayHelp />
      </CollapsibleSection>
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      overlayTitle="Border Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/border"
          params={params}
          defaults={BORDER_DEFAULTS}
          overlayType="border"
          onImportConfig={(importedParams) => updateState(importedParams as BorderOverlayParams)}
        />
      }
      undoRedoControls={{ undo, redo, canUndo, canRedo }}
    />
  )
}
