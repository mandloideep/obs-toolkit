/**
 * Counter Overlay Configurator
 * Visual configuration UI for counter overlay parameters
 * Now with TanStack Form + Zod validation + ShadCN UI components
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
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
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import {
  COUNTER_LAYOUT_OPTIONS,
  COUNTER_ICON_OPTIONS,
  HORIZONTAL_ALIGN_OPTIONS,
  NUMBER_NOTATION_OPTIONS,
  API_SERVICE_OPTIONS,
  THEME_OPTIONS,
  BG_SHADOW_OPTIONS,
  COLOR_MODE_OPTIONS,
  BG_PANEL_DEFAULTS,
} from '../../lib/constants'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { COUNTER_DEFAULTS } from '../../types/counter.types'
import type { CounterOverlayParams } from '../../types/counter.types'
import { useHistory } from '../../hooks/useHistory'
import { useFormWithHistory } from '../../hooks/useFormWithHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'
import { CounterOverlayHelp } from '../../components/configure/help/CounterOverlayHelp'
import { counterOverlaySchema } from '../../lib/validation/schemas'

export const Route = createFileRoute('/configure/counter')({
  component: CounterConfigurator,
})

function CounterConfigurator() {
  // History management (undo/redo + debouncing)
  const history = useHistory<CounterOverlayParams>(COUNTER_DEFAULTS)
  const { state: params, updateState, undo, redo, canUndo, canRedo } = history

  // TanStack Form with Zod validation
  const form = useFormWithHistory({
    history,
    schema: counterOverlaySchema,
  })

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'z', ctrlOrCmd: true, shift: false, callback: undo },
    { key: 'z', ctrlOrCmd: true, shift: true, callback: redo },
  ])

  // API key persistence state (must be before presets management)
  const [persistApiKeys, setPersistApiKeys] = useState<boolean>(() => {
    return localStorage.getItem('obs-counter-persist-keys') === 'true'
  })

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
  } = usePresets<CounterOverlayParams>('counter', COUNTER_DEFAULTS)

  // Load preset with validation
  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      // Validate preset before loading
      const result = counterOverlaySchema.safeParse(presetParams)
      const dataToLoad = result.success ? result.data : presetParams

      // If persistApiKeys is enabled, preserve current API key
      if (persistApiKeys) {
        updateState({
          ...dataToLoad,
          apikey: params.apikey, // Keep current API key
        })
      } else {
        updateState(dataToLoad)
      }

      if (!result.success) {
        console.error('Invalid preset:', result.error)
      }
    }
  }

  // Section-specific reset handlers (use updateState for immediate history entry)
  const resetTheme = () => {
    updateState({
      ...params,
      theme: COUNTER_DEFAULTS.theme,
      gradient: COUNTER_DEFAULTS.gradient,
      colors: COUNTER_DEFAULTS.colors,
    })
  }

  // Load persisted keys on mount
  useEffect(() => {
    if (persistApiKeys) {
      const savedKey = localStorage.getItem('obs-counter-apikey')
      const savedUserId = localStorage.getItem('obs-counter-userid')
      const savedMetric = localStorage.getItem('obs-counter-metric')

      // Use form to update values
      if (savedKey) form.setFieldValue('apikey', savedKey)
      if (savedUserId) form.setFieldValue('userid', savedUserId)
      if (savedMetric) form.setFieldValue('metric', savedMetric)
    }
  }, []) // Run once on mount

  // Save/clear keys when params or persist toggle changes
  useEffect(() => {
    if (persistApiKeys) {
      // Save to localStorage
      if (params.apikey) localStorage.setItem('obs-counter-apikey', params.apikey)
      if (params.userid) localStorage.setItem('obs-counter-userid', params.userid)
      if (params.metric) localStorage.setItem('obs-counter-metric', params.metric)
      localStorage.setItem('obs-counter-persist-keys', 'true')
    } else {
      // Clear from localStorage
      localStorage.removeItem('obs-counter-apikey')
      localStorage.removeItem('obs-counter-userid')
      localStorage.removeItem('obs-counter-metric')
      localStorage.removeItem('obs-counter-persist-keys')
    }
  }, [params.apikey, params.userid, params.metric, persistApiKeys])

  const handlePersistToggle = (checked: boolean) => {
    setPersistApiKeys(checked)
    if (!checked) {
      // If turning off, immediately clear stored keys
      localStorage.removeItem('obs-counter-apikey')
      localStorage.removeItem('obs-counter-userid')
      localStorage.removeItem('obs-counter-metric')
      localStorage.removeItem('obs-counter-persist-keys')
    }
  }

  // Preview URL: Includes API key for live testing
  const previewUrl = useMemo(() => {
    // Guard against undefined params during initialization
    if (!params) {
      return `${getBaseUrl()}/overlays/counter`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== COUNTER_DEFAULTS[key as keyof CounterOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${getBaseUrl()}/overlays/counter?${searchParams.toString()}`
  }, [params])

  // Fullscreen URL: Excludes API key for security
  const fullscreenUrl = useMemo(() => {
    // Guard against undefined params during initialization
    if (!params) {
      return `${getBaseUrl()}/overlays/counter`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        // Skip API key for security
        if (key === 'apikey') {
          return acc
        }
        if (value !== COUNTER_DEFAULTS[key as keyof CounterOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${getBaseUrl()}/overlays/counter?${searchParams.toString()}`
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

      {/* Section 1: Display */}
      <CollapsibleSection title="Display" defaultOpen={true} storageKey="counter-display">
        <form.Field name="value">
          {(field) => (
            <FormTextInput
              label="Value"
              type="text"
              value={String(params.value)}
              onChange={(val) => {
                const numVal = Number(val) || 0
                field.handleChange(numVal)
                updateState({ ...params, value: numVal })
              }}
              onBlur={field.handleBlur}
              placeholder="0"
              help="Current counter value (used when service is 'Custom')"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="label">
          {(field) => (
            <FormTextInput
              label="Label"
              value={params.label}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, label: val })
              }}
              onBlur={field.handleBlur}
              placeholder="e.g., Subscribers"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="prefix">
            {(field) => (
              <FormTextInput
                label="Prefix"
                value={params.prefix}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, prefix: val })
                }}
                onBlur={field.handleBlur}
                placeholder="e.g., $"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="suffix">
            {(field) => (
              <FormTextInput
                label="Suffix"
                value={params.suffix}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, suffix: val })
                }}
                onBlur={field.handleBlur}
                placeholder="e.g., K"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="size">
            {(field) => (
              <FormNumberSlider
                label="Number Size"
                value={params.size}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, size: val })
                }}
                onBlur={field.handleBlur}
                min={12}
                max={200}
                unit="px"
                help="Font size for the counter number"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="labelsize">
            {(field) => (
              <FormNumberSlider
                label="Label Size"
                value={params.labelsize}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, labelsize: val })
                }}
                onBlur={field.handleBlur}
                min={8}
                max={100}
                unit="px"
                help="Font size for the label text"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>
      </CollapsibleSection>

      {/* Section 2: Icon Customization */}
      <CollapsibleSection title="Icon Customization" defaultOpen={true} storageKey="counter-icon">
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
                options={COUNTER_ICON_OPTIONS}
              />
            )}
          </form.Field>
        </div>

        {params.icon !== 'none' && (
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
                placeholder="Leave empty for gradient color"
                help="Leave empty for gradient color"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 3: Layout */}
      <CollapsibleSection title="Layout" defaultOpen={false} storageKey="counter-layout">
        <form.Field name="layout">
          {(field) => (
            <FormSelectInput
              label="Layout Style"
              value={params.layout}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, layout: val as any })
              }}
              options={COUNTER_LAYOUT_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="align">
          {(field) => (
            <FormSelectInput
              label="Alignment"
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

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="counterpadx">
            {(field) => (
              <FormNumberSlider
                label="Padding X"
                value={params.counterpadx}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, counterpadx: val })
                }}
                onBlur={field.handleBlur}
                min={0}
                max={100}
                unit="px"
                help="Horizontal padding around counter"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="counterpady">
            {(field) => (
              <FormNumberSlider
                label="Padding Y"
                value={params.counterpady}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, counterpady: val })
                }}
                onBlur={field.handleBlur}
                min={0}
                max={100}
                unit="px"
                help="Vertical padding around counter"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="width">
            {(field) => (
              <FormTextInput
                label="Width"
                value={params.width}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, width: val })
                }}
                onBlur={field.handleBlur}
                placeholder="auto"
                help="CSS width (auto, 200px, 50%, etc.)"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="height">
            {(field) => (
              <FormTextInput
                label="Height"
                value={params.height}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, height: val })
                }}
                onBlur={field.handleBlur}
                placeholder="auto"
                help="CSS height (auto, 100px, etc.)"
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
        <CollapsibleSection title="Background Panel" defaultOpen={false} storageKey="counter-bgpanel">
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

      {/* Section 4: Typography */}
      <CollapsibleSection title="Typography" defaultOpen={false} storageKey="counter-typography">
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

        <form.Field name="numbercolor">
          {(field) => (
            <FormColorPicker
              label="Number Color"
              value={params.numbercolor}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, numbercolor: val })
              }}
              onBlur={field.handleBlur}
              placeholder="Leave empty for gradient color"
              help="Leave empty for gradient color"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 5: Number Formatting */}
      <CollapsibleSection title="Number Formatting" defaultOpen={false} storageKey="counter-formatting">
        <form.Field name="separator">
          {(field) => (
            <FormSwitch
              label="Thousands Separator"
              checked={params.separator}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, separator: checked })
              }}
              help="Format as 1,000 instead of 1000"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="decimals">
          {(field) => (
            <FormNumberSlider
              label="Decimal Places"
              value={params.decimals}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, decimals: val })
              }}
              onBlur={field.handleBlur}
              min={0}
              max={3}
              help="Number of decimal places to show"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="notation">
          {(field) => (
            <FormSelectInput
              label="Notation Style"
              value={params.notation}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, notation: val as any })
              }}
              options={NUMBER_NOTATION_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="abbreviate">
          {(field) => (
            <FormSwitch
              label="Abbreviate Large Numbers"
              checked={params.abbreviate}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, abbreviate: checked })
              }}
              help="Display as 1K, 1M, 1B"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 6: Animation */}
      <CollapsibleSection title="Animation" defaultOpen={false} storageKey="counter-animation">
        <form.Field name="animate">
          {(field) => (
            <FormSwitch
              label="Animate Count-Up"
              checked={params.animate}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, animate: checked })
              }}
              help="Animate number changes with smooth counting"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.animate && (
          <form.Field name="duration">
            {(field) => (
              <FormNumberSlider
                label="Animation Duration"
                value={params.duration}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, duration: val })
                }}
                onBlur={field.handleBlur}
                min={0.1}
                max={10}
                step={0.1}
                unit="s"
                help="Duration of count-up animation"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}

        <form.Field name="trend">
          {(field) => (
            <FormSwitch
              label="Show Trend Arrow"
              checked={params.trend}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, trend: checked })
              }}
              help="Display up/down arrow for value changes"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.trend && (
          <form.Field name="trendcolor">
            {(field) => (
              <FormColorPicker
                label="Trend Arrow Color"
                value={params.trendcolor}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, trendcolor: val })
                }}
                onBlur={field.handleBlur}
                placeholder="10b981"
                help="Color for trend arrow indicator"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 7: API Integration */}
      <CollapsibleSection title="API Integration" defaultOpen={false} storageKey="counter-api">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-200 font-medium">⚠️ Security Notice</p>
          <p className="text-xs text-yellow-200/80 mt-2 mb-2">
            <strong>Important:</strong> API keys will be included in the generated URL and visible in:
          </p>
          <ul className="text-xs text-yellow-200/70 ml-4 list-disc space-y-1">
            <li>OBS Browser Source settings (plain text)</li>
            <li>Browser address bar and history</li>
            <li>OBS configuration files</li>
            <li>Screen recordings if you share your OBS setup</li>
          </ul>
          <p className="text-xs text-yellow-200/80 mt-3 mb-2">
            <strong>Best Practices:</strong>
          </p>
          <ul className="text-xs text-yellow-200/70 ml-4 list-disc space-y-1">
            <li>Create separate API keys specifically for streaming</li>
            <li>Use keys with minimal permissions (read-only access only)</li>
            <li>Set expiration dates when possible</li>
            <li>Never use your main account's API credentials</li>
            <li>Rotate keys regularly if you stream frequently</li>
          </ul>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
          <div className="flex-1">
            <Label htmlFor="persist-keys" className="text-sm font-medium">
              Remember API credentials on this device
            </Label>
            <p className="text-xs text-dark-muted mt-1">
              Store API key, username, and metric in browser storage. Disable if sharing this computer.
            </p>
          </div>
          <Switch
            id="persist-keys"
            checked={persistApiKeys}
            onCheckedChange={handlePersistToggle}
          />
        </div>

        <form.Field name="service">
          {(field) => (
            <FormSelectInput
              label="Service"
              value={params.service}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, service: val as any })
              }}
              options={API_SERVICE_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.service !== 'custom' && (
          <>
            <form.Field name="userid">
              {(field) => (
                <FormTextInput
                  label="User ID / Username"
                  value={params.userid}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, userid: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Enter username or channel ID"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="apikey">
              {(field) => (
                <FormTextInput
                  label="API Key"
                  type="password"
                  value={params.apikey}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, apikey: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Enter API key (if required)"
                  help="Required for YouTube and Twitch. GitHub works without API key but has rate limits."
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="metric">
              {(field) => (
                <FormTextInput
                  label="Metric"
                  value={params.metric}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, metric: val })
                  }}
                  onBlur={field.handleBlur}
                  placeholder="e.g., followers, subscribers, stars"
                  help="Specify which metric to track (service-dependent)"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            {params.service === 'poll' && (
              <>
                <form.Field name="poll">
                  {(field) => (
                    <FormTextInput
                      label="Custom API URL"
                      value={params.poll}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, poll: val })
                      }}
                      onBlur={field.handleBlur}
                      placeholder="https://api.example.com/stats"
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>

                <form.Field name="pollkey">
                  {(field) => (
                    <FormTextInput
                      label="JSON Path"
                      value={params.pollkey}
                      onChange={(val) => {
                        field.handleChange(val)
                        updateState({ ...params, pollkey: val })
                      }}
                      onBlur={field.handleBlur}
                      placeholder="e.g., data.count or value"
                      help="Path to extract value from JSON response (dot notation)"
                      error={field.state.meta.errors?.[0]}
                    />
                  )}
                </form.Field>
              </>
            )}

            <form.Field name="pollrate">
              {(field) => (
                <FormNumberSlider
                  label="Poll Rate"
                  value={params.pollrate}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, pollrate: val })
                  }}
                  onBlur={field.handleBlur}
                  min={5}
                  max={300}
                  unit="s"
                  help="How often to fetch new data from API"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>
          </>
        )}
      </CollapsibleSection>

      {/* Help & Guides */}
      <CollapsibleSection
        title="Help & Guides"
        defaultOpen={false}
        storageKey="counter-help"
      >
        <CounterOverlayHelp />
      </CollapsibleSection>

      {/* Section 9: Theme & Colors */}
      <CollapsibleSection
        title="Theme & Colors"
        defaultOpen={false}
        storageKey="counter-theme"
        onReset={resetTheme}
      >
        <form.Field name="theme">
          {(field) => (
            <FormSelectInput
              label="Theme"
              value={params.theme}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, theme: val as any })
              }}
              options={THEME_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

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
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      fullscreenUrl={fullscreenUrl}
      overlayTitle="Counter Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/counter"
          params={params}
          defaults={COUNTER_DEFAULTS}
          sensitiveParams={['apikey']}
          overlayType="counter"
          onImportConfig={(importedParams) => {
            // If persistApiKeys is enabled, preserve current API key
            if (persistApiKeys) {
              updateState({
                ...(importedParams as CounterOverlayParams),
                apikey: params.apikey, // Keep current API key
              })
            } else {
              updateState(importedParams as CounterOverlayParams)
            }
          }}
        />
      }
      undoRedoControls={{ undo, redo, canUndo, canRedo }}
    />
  )
}
