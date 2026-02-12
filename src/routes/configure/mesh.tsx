/**
 * Mesh Background Configurator
 * Visual configuration UI for mesh background overlay parameters
 */

import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { getBaseUrl } from '../../lib/baseUrl'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { FormNumberSlider } from '../../components/configure/form/FormNumberSlider'
import { FormSelectInput } from '../../components/configure/form/FormSelectInput'
import { FormTextInput } from '../../components/configure/form/FormTextInput'
import { PresetManager } from '../../components/configure/PresetManager'
import { Button } from '../../components/ui/button'
import {
  MESH_ANIMATION_OPTIONS,
  MESH_PALETTE_OPTIONS,
  MESH_POINT_OPTIONS,
  MESH_BLEND_MODE_OPTIONS,
} from '../../lib/constants'
import { MESH_DEFAULTS } from '../../types/mesh.types'
import type { MeshOverlayParams } from '../../types/mesh.types'
import { useHistory } from '../../hooks/useHistory'
import { useFormWithHistory } from '../../hooks/useFormWithHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'
import { meshOverlaySchema } from '../../lib/validation/schemas'
import { Shuffle } from 'lucide-react'

export const Route = createFileRoute('/configure/mesh')({
  component: MeshConfigurator,
})

function MeshConfigurator() {
  // History management (undo/redo + debouncing)
  const history = useHistory<MeshOverlayParams>(MESH_DEFAULTS)
  const { state: params, updateState, undo, redo, canUndo, canRedo } = history

  // TanStack Form with Zod validation
  const form = useFormWithHistory({
    history,
    schema: meshOverlaySchema,
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
  } = usePresets<MeshOverlayParams>('mesh', MESH_DEFAULTS)

  // Load preset with validation
  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      const result = meshOverlaySchema.safeParse(presetParams)
      if (result.success) {
        updateState(result.data)
      } else {
        console.error('Invalid preset:', result.error)
        updateState(presetParams)
      }
    }
  }

  // Section reset handlers
  const resetSeedMesh = () => {
    updateState({
      ...params,
      seed: MESH_DEFAULTS.seed,
      points: MESH_DEFAULTS.points,
      palette: MESH_DEFAULTS.palette,
    })
  }

  const resetAnimation = () => {
    updateState({
      ...params,
      animation: MESH_DEFAULTS.animation,
      speed: MESH_DEFAULTS.speed,
    })
  }

  const resetAppearance = () => {
    updateState({
      ...params,
      blur: MESH_DEFAULTS.blur,
      scale: MESH_DEFAULTS.scale,
      opacity: MESH_DEFAULTS.opacity,
      blend: MESH_DEFAULTS.blend,
      bg: MESH_DEFAULTS.bg,
    })
  }

  // Randomize seed
  const randomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 999999) + 1
    updateState({ ...params, seed: newSeed })
  }

  // Generate preview URL
  const previewUrl = useMemo(() => {
    if (!params) {
      return `${getBaseUrl()}/overlays/mesh`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== MESH_DEFAULTS[key as keyof MeshOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${getBaseUrl()}/overlays/mesh?${searchParams.toString()}`
  }, [params])

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

      {/* Section 1: Seed & Mesh */}
      <CollapsibleSection
        title="Seed & Mesh"
        defaultOpen={true}
        storageKey="mesh-seed"
        onReset={resetSeedMesh}
      >
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <form.Field name="seed">
                {(field) => (
                  <FormNumberSlider
                    label="Seed"
                    value={params.seed}
                    onChange={(val) => {
                      field.handleChange(val)
                      updateState({ ...params, seed: val })
                    }}
                    onBlur={field.handleBlur}
                    min={1}
                    max={999999}
                    step={1}
                    help="Same seed = same background every time"
                    error={field.state.meta.errors?.[0]}
                  />
                )}
              </form.Field>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={randomizeSeed}
              className="mb-1 shrink-0"
            >
              <Shuffle size={14} />
              Randomize
            </Button>
          </div>

          <form.Field name="points">
            {(field) => (
              <FormSelectInput
                label="Mesh Points"
                value={String(params.points)}
                onChange={(val) => {
                  const num = Number(val) as 2 | 3 | 4
                  field.handleChange(num)
                  updateState({ ...params, points: num })
                }}
                options={MESH_POINT_OPTIONS}
                help="Number of gradient blobs"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="palette">
            {(field) => (
              <FormSelectInput
                label="Color Palette"
                value={params.palette}
                onChange={(val) => {
                  field.handleChange(val as any)
                  updateState({ ...params, palette: val as any })
                }}
                options={MESH_PALETTE_OPTIONS}
                help="Color category for generated colors"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>
      </CollapsibleSection>

      {/* Section 2: Animation */}
      <CollapsibleSection
        title="Animation"
        defaultOpen={true}
        storageKey="mesh-animation"
        onReset={resetAnimation}
      >
        <form.Field name="animation">
          {(field) => (
            <FormSelectInput
              label="Animation Mode"
              value={params.animation}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, animation: val as any })
              }}
              options={MESH_ANIMATION_OPTIONS}
              help="How the mesh control points move"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.animation !== 'none' && (
          <form.Field name="speed">
            {(field) => (
              <FormNumberSlider
                label="Speed"
                value={params.speed}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, speed: val })
                }}
                onBlur={field.handleBlur}
                min={0.1}
                max={3}
                step={0.1}
                unit="x"
                help="Animation speed multiplier"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 3: Appearance */}
      <CollapsibleSection
        title="Appearance"
        defaultOpen={false}
        storageKey="mesh-appearance"
        onReset={resetAppearance}
      >
        <form.Field name="blur">
          {(field) => (
            <FormNumberSlider
              label="Blur"
              value={params.blur}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, blur: val })
              }}
              onBlur={field.handleBlur}
              min={20}
              max={200}
              unit="px"
              help="Color blending smoothness (low = distinct regions, high = even blend)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="scale">
          {(field) => (
            <FormNumberSlider
              label="Scale"
              value={params.scale}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, scale: val })
              }}
              onBlur={field.handleBlur}
              min={0.5}
              max={2}
              step={0.1}
              unit="x"
              help="How spread apart the control points are"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="opacity">
          {(field) => (
            <FormNumberSlider
              label="Opacity"
              value={params.opacity * 100}
              onChange={(val) => {
                field.handleChange(val / 100)
                updateState({ ...params, opacity: val / 100 })
              }}
              onBlur={field.handleBlur}
              min={0}
              max={100}
              unit="%"
              help="Overall mesh opacity"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="blend">
          {(field) => (
            <FormSelectInput
              label="Blend Mode"
              value={params.blend}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, blend: val as any })
              }}
              options={MESH_BLEND_MODE_OPTIONS}
              help="How overlapping blobs blend together"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="bg">
          {(field) => (
            <FormTextInput
              label="Background Color"
              value={params.bg}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, bg: val })
              }}
              onBlur={field.handleBlur}
              help="Hex color without # (e.g. 000000)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      overlayTitle="Mesh Background"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/mesh"
          params={params}
          defaults={MESH_DEFAULTS}
          overlayType="mesh"
          onImportConfig={(importedParams) => updateState(importedParams as MeshOverlayParams)}
        />
      }
      undoRedoControls={{ undo, redo, canUndo, canRedo }}
    />
  )
}
