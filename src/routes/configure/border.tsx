/**
 * Border Overlay Configurator
 * Visual configuration UI for border overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { NumberSlider } from '../../components/configure/form/NumberSlider'
import { ColorArrayInput } from '../../components/configure/form/ColorArrayInput'
import { FormSelect } from '../../components/configure/form/FormSelect'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { BORDER_DEFAULTS } from '../../types/border.types'
import type { BorderOverlayParams } from '../../types/border.types'
import { useHistory } from '../../hooks/useHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'

export const Route = createFileRoute('/configure/border')({
  component: BorderConfigurator,
})

function BorderConfigurator() {
  const { state: params, setState: setParams, updateState, undo, redo, canUndo, canRedo } = useHistory<BorderOverlayParams>(BORDER_DEFAULTS)

  const updateParam = <K extends keyof BorderOverlayParams>(
    key: K,
    value: BorderOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

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

  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      updateState(presetParams)
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
        <div>
          <label className="config-label">Shape</label>
          <FormSelect
            value={params.shape}
            onValueChange={(value) => updateParam('shape', value as any)}
            options={[
              { value: 'rect', label: 'Rectangle' },
              { value: 'circle', label: 'Circle' },
            ]}
          />
        </div>

        <div>
          <label className="config-label">Style</label>
          <FormSelect
            value={params.style}
            onValueChange={(value) => updateParam('style', value as any)}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'double', label: 'Double' },
              { value: 'neon', label: 'Neon' },
            ]}
          />
        </div>

        <div>
          <label className="config-label">Animation</label>
          <FormSelect
            value={params.animation}
            onValueChange={(value) => updateParam('animation', value as any)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'dash', label: 'Dash' },
              { value: 'rotate', label: 'Rotate' },
              { value: 'pulse', label: 'Pulse' },
              { value: 'breathe', label: 'Breathe' },
            ]}
          />
        </div>

        <NumberSlider
          label="Thickness"
          value={params.thickness}
          onChange={(val) => updateParam('thickness', val)}
          min={1}
          max={50}
          unit="px"
          help="Border thickness in pixels"
        />

        <NumberSlider
          label="Animation Speed"
          value={params.speed}
          onChange={(val) => updateParam('speed', val)}
          min={0.1}
          max={10}
          step={0.1}
          unit="s"
          help="Animation cycle duration"
        />

        {params.shape === 'rect' && (
          <NumberSlider
            label="Corner Radius"
            value={params.r}
            onChange={(val) => updateParam('r', val)}
            min={0}
            max={50}
            unit="px"
            help="Rounded corners for rectangles"
          />
        )}

        {params.style === 'dashed' && (
          <NumberSlider
            label="Dash Ratio"
            value={params.dash}
            onChange={(val) => updateParam('dash', val)}
            min={0}
            max={1}
            step={0.1}
            help="Visible portion of dash (0-1)"
          />
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
          <GradientGrid
            value={params.gradient}
            onValueChange={(value) => updateParam('gradient', value as any)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="multicolor">Multi-color Mode</Label>
          <Switch
            id="multicolor"
            checked={params.multicolor}
            onCheckedChange={(checked) => updateParam('multicolor', checked)}
          />
        </div>
        <p className="text-xs text-dark-muted -mt-2">Cycle through all gradients</p>

        <div className="flex items-center justify-between">
          <Label htmlFor="colorshift">Color Shift</Label>
          <Switch
            id="colorshift"
            checked={params.colorshift}
            onCheckedChange={(checked) => updateParam('colorshift', checked)}
          />
        </div>
        <p className="text-xs text-dark-muted -mt-2">Smooth color transitions</p>

        {(params.multicolor || params.colorshift) && (
          <NumberSlider
            label="Shift Speed"
            value={params.shiftspeed}
            onChange={(val) => updateParam('shiftspeed', val)}
            min={1}
            max={30}
            unit="s"
            help="Color cycle duration"
          />
        )}

        <ColorArrayInput
          label="Custom Colors"
          colors={params.colors}
          onChange={(colors) => updateParam('colors', colors)}
          maxColors={5}
        />

        <div className="flex items-center justify-between">
          <Label htmlFor="random">Random Gradient</Label>
          <Switch
            id="random"
            checked={params.random}
            onCheckedChange={(checked) => updateParam('random', checked)}
          />
        </div>
        <p className="text-xs text-dark-muted -mt-2">Randomize gradient on load</p>
      </CollapsibleSection>

      {/* Section 3: Visual Effects */}
      <CollapsibleSection title="Visual Effects" defaultOpen={false} storageKey="border-effects">
        <div className="flex items-center justify-between">
          <Label htmlFor="glow">Glow Effect</Label>
          <Switch
            id="glow"
            checked={params.glow}
            onCheckedChange={(checked) => updateParam('glow', checked)}
          />
        </div>

        {params.glow && (
          <NumberSlider
            label="Glow Size"
            value={params.glowsize}
            onChange={(val) => updateParam('glowsize', val)}
            min={0}
            max={20}
            unit="px"
            help="Glow blur radius"
          />
        )}

        <NumberSlider
          label="Opacity"
          value={params.opacity * 100}
          onChange={(val) => updateParam('opacity', val / 100)}
          min={0}
          max={100}
          unit="%"
          help="Border opacity (0-100%)"
        />
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
