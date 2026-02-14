/**
 * Socials Overlay Configurator
 * Visual configuration UI for social media overlay parameters
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
import { FontSelect } from '../../components/configure/form/FontSelect'
import { AnimationSelect } from '../../components/configure/form/AnimationSelect'
import { AnimationTimeline } from '../../components/configure/form/AnimationTimeline'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import {
  LAYOUT_OPTIONS,
  SIZE_PRESET_OPTIONS,
  ICON_COLOR_MODE_OPTIONS,
  PLATFORM_ORDER_OPTIONS,
  ENTRANCE_ANIMATION_OPTIONS,
  EXIT_ANIMATION_OPTIONS,
  BG_SHADOW_OPTIONS,
  COLOR_MODE_OPTIONS,
  BG_PANEL_DEFAULTS,
} from '../../lib/constants'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { SOCIALS_DEFAULTS } from '../../types/socials.types'
import type { SocialsOverlayParams } from '../../types/socials.types'
import { useHistory } from '../../hooks/useHistory'
import { useFormWithHistory } from '../../hooks/useFormWithHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'
import { SocialsOverlayHelp } from '../../components/configure/help/SocialsOverlayHelp'
import { socialsOverlaySchema } from '../../lib/validation/schemas'
import type { SocialPlatform } from '../../types/brand.types'

export const Route = createFileRoute('/configure/socials')({
  component: SocialsConfigurator,
})

type PlatformData = {
  enabled: boolean
  handle: string
}

type AllPlatforms = Record<SocialPlatform, PlatformData>

function SocialsConfigurator() {
  // History management (undo/redo + debouncing)
  const history = useHistory<SocialsOverlayParams>(SOCIALS_DEFAULTS)
  const { state: params, setState: setParams, updateState, undo, redo, canUndo, canRedo } = history

  // TanStack Form with Zod validation
  const form = useFormWithHistory({
    history,
    schema: socialsOverlaySchema,
  })

  // Parse show and handles into individual platform states
  const [platforms, setPlatforms] = useState<AllPlatforms>(() => {
    const showList = SOCIALS_DEFAULTS.show.split(',').filter(Boolean)
    const handlesMap = SOCIALS_DEFAULTS.handles.split(',').reduce((acc, pair) => {
      const [platform, handle] = pair.split(':')
      if (platform && handle) acc[platform] = handle
      return acc
    }, {} as Record<string, string>)

    return {
      github: { enabled: showList.includes('github'), handle: handlesMap.github || '' },
      twitter: { enabled: showList.includes('twitter'), handle: handlesMap.twitter || '' },
      linkedin: { enabled: showList.includes('linkedin'), handle: handlesMap.linkedin || '' },
      youtube: { enabled: showList.includes('youtube'), handle: handlesMap.youtube || '' },
      instagram: { enabled: showList.includes('instagram'), handle: handlesMap.instagram || '' },
      twitch: { enabled: showList.includes('twitch'), handle: handlesMap.twitch || '' },
      kick: { enabled: showList.includes('kick'), handle: handlesMap.kick || '' },
      discord: { enabled: showList.includes('discord'), handle: handlesMap.discord || '' },
      website: { enabled: showList.includes('website'), handle: handlesMap.website || '' },
    }
  })

  // Sync platforms state when params change (from undo/redo)
  useEffect(() => {
    const showList = params.show.split(',').filter(Boolean)
    const handlesMap = params.handles.split(',').reduce((acc, pair) => {
      const [platform, handle] = pair.split(':')
      if (platform && handle) acc[platform] = handle
      return acc
    }, {} as Record<string, string>)

    setPlatforms({
      github: { enabled: showList.includes('github'), handle: handlesMap.github || '' },
      twitter: { enabled: showList.includes('twitter'), handle: handlesMap.twitter || '' },
      linkedin: { enabled: showList.includes('linkedin'), handle: handlesMap.linkedin || '' },
      youtube: { enabled: showList.includes('youtube'), handle: handlesMap.youtube || '' },
      instagram: { enabled: showList.includes('instagram'), handle: handlesMap.instagram || '' },
      twitch: { enabled: showList.includes('twitch'), handle: handlesMap.twitch || '' },
      kick: { enabled: showList.includes('kick'), handle: handlesMap.kick || '' },
      discord: { enabled: showList.includes('discord'), handle: handlesMap.discord || '' },
      website: { enabled: showList.includes('website'), handle: handlesMap.website || '' },
    })
  }, [params.show, params.handles])

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
  } = usePresets<SocialsOverlayParams>('socials', SOCIALS_DEFAULTS)

  // Load preset with validation
  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      // Validate preset before loading
      const result = socialsOverlaySchema.safeParse(presetParams)
      if (result.success) {
        updateState(result.data)
      } else {
        console.error('Invalid preset:', result.error)
        // Still load it but show warning
        updateState(presetParams)
      }
      // Platforms will sync via useEffect
    }
  }

  // Update params when platforms change
  const updatePlatforms = (newPlatforms: AllPlatforms) => {
    setPlatforms(newPlatforms)

    // Build show string
    const show = Object.entries(newPlatforms)
      .filter(([_, data]) => data.enabled)
      .map(([platform, _]) => platform)
      .join(',')

    // Build handles string
    const handles = Object.entries(newPlatforms)
      .filter(([_, data]) => data.enabled && data.handle)
      .map(([platform, data]) => `${platform}:${data.handle}`)
      .join(',')

    setParams((prev) => ({ ...prev, show, handles }))
  }

  const togglePlatform = (platform: keyof AllPlatforms) => {
    updatePlatforms({
      ...platforms,
      [platform]: { ...platforms[platform], enabled: !platforms[platform].enabled },
    })
  }

  const updateHandle = (platform: keyof AllPlatforms, handle: string) => {
    updatePlatforms({
      ...platforms,
      [platform]: { ...platforms[platform], handle },
    })
  }

  // Section-specific reset handlers (use updateState for immediate history entry)
  const resetThemeColors = () => {
    updateState({
      ...params,
      theme: SOCIALS_DEFAULTS.theme,
      gradient: SOCIALS_DEFAULTS.gradient,
      colors: SOCIALS_DEFAULTS.colors,
    })
  }

  const previewUrl = useMemo(() => {
    // Guard against undefined params during initialization
    if (!params) {
      return `${getBaseUrl()}/overlays/socials`
    }

    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== SOCIALS_DEFAULTS[key as keyof SocialsOverlayParams]) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    )
    return `${getBaseUrl()}/overlays/socials?${searchParams.toString()}`
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

      {/* Section 1: Platforms */}
      <CollapsibleSection title="Platforms" defaultOpen={true} storageKey="socials-platforms">
        <p className="text-sm text-dark-muted mb-4">
          Enable platforms and set custom handles for each social media account
        </p>

        <div className="space-y-3">
          {/* GitHub */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-github"
              checked={platforms.github.enabled}
              onCheckedChange={() => togglePlatform('github')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-github" className="text-sm font-medium mb-1 block">
                GitHub
              </Label>
              {platforms.github.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.github.handle}
                  onChange={(e) => updateHandle('github', e.target.value)}
                  placeholder="username"
                />
              )}
            </div>
          </div>

          {/* Twitter/X */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-twitter"
              checked={platforms.twitter.enabled}
              onCheckedChange={() => togglePlatform('twitter')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-twitter" className="text-sm font-medium mb-1 block">
                Twitter / X
              </Label>
              {platforms.twitter.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.twitter.handle}
                  onChange={(e) => updateHandle('twitter', e.target.value)}
                  placeholder="@username"
                />
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-linkedin"
              checked={platforms.linkedin.enabled}
              onCheckedChange={() => togglePlatform('linkedin')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-linkedin" className="text-sm font-medium mb-1 block">
                LinkedIn
              </Label>
              {platforms.linkedin.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.linkedin.handle}
                  onChange={(e) => updateHandle('linkedin', e.target.value)}
                  placeholder="username"
                />
              )}
            </div>
          </div>

          {/* YouTube */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-youtube"
              checked={platforms.youtube.enabled}
              onCheckedChange={() => togglePlatform('youtube')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-youtube" className="text-sm font-medium mb-1 block">
                YouTube
              </Label>
              {platforms.youtube.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.youtube.handle}
                  onChange={(e) => updateHandle('youtube', e.target.value)}
                  placeholder="@channelname"
                />
              )}
            </div>
          </div>

          {/* Instagram */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-instagram"
              checked={platforms.instagram.enabled}
              onCheckedChange={() => togglePlatform('instagram')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-instagram" className="text-sm font-medium mb-1 block">
                Instagram
              </Label>
              {platforms.instagram.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.instagram.handle}
                  onChange={(e) => updateHandle('instagram', e.target.value)}
                  placeholder="@username"
                />
              )}
            </div>
          </div>

          {/* Twitch */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-twitch"
              checked={platforms.twitch.enabled}
              onCheckedChange={() => togglePlatform('twitch')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-twitch" className="text-sm font-medium mb-1 block">
                Twitch
              </Label>
              {platforms.twitch.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.twitch.handle}
                  onChange={(e) => updateHandle('twitch', e.target.value)}
                  placeholder="username"
                />
              )}
            </div>
          </div>

          {/* Kick */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-kick"
              checked={platforms.kick.enabled}
              onCheckedChange={() => togglePlatform('kick')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-kick" className="text-sm font-medium mb-1 block">
                Kick
              </Label>
              {platforms.kick.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.kick.handle}
                  onChange={(e) => updateHandle('kick', e.target.value)}
                  placeholder="username"
                />
              )}
            </div>
          </div>

          {/* Discord */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-discord"
              checked={platforms.discord.enabled}
              onCheckedChange={() => togglePlatform('discord')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-discord" className="text-sm font-medium mb-1 block">
                Discord
              </Label>
              {platforms.discord.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.discord.handle}
                  onChange={(e) => updateHandle('discord', e.target.value)}
                  placeholder="server invite or username"
                />
              )}
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface/30 border border-dark-border">
            <Switch
              id="platform-website"
              checked={platforms.website.enabled}
              onCheckedChange={() => togglePlatform('website')}
            />
            <div className="flex-1">
              <Label htmlFor="platform-website" className="text-sm font-medium mb-1 block">
                Website
              </Label>
              {platforms.website.enabled && (
                <Input
                  className="h-8 text-sm"
                  type="text"
                  value={platforms.website.handle}
                  onChange={(e) => updateHandle('website', e.target.value)}
                  placeholder="example.com"
                />
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 2: Platform Ordering */}
      <CollapsibleSection title="Platform Ordering" defaultOpen={false} storageKey="socials-ordering">
        <form.Field name="order">
          {(field) => (
            <FormSelectInput
              label="Order Mode"
              value={params.order}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, order: val as any })
              }}
              options={PLATFORM_ORDER_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.order === 'priority' && (
          <form.Field name="priority">
            {(field) => (
              <FormTextInput
                label="Platform Priority"
                value={params.priority}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, priority: val })
                }}
                onBlur={field.handleBlur}
                placeholder="e.g., youtube:1,github:2,twitter:3"
                help="Set priority: platform:rank,platform:rank (lower rank appears first)"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Section 3: Layout */}
      <CollapsibleSection title="Layout" defaultOpen={true} storageKey="socials-layout">
        <form.Field name="layout">
          {(field) => (
            <FormSelectInput
              label="Layout Direction"
              value={params.layout}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, layout: val as any })
              }}
              options={LAYOUT_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="size">
          {(field) => (
            <FormSelectInput
              label="Size Preset"
              value={params.size}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, size: val as any })
              }}
              options={SIZE_PRESET_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="gap">
          {(field) => (
            <FormNumberSlider
              label="Gap Between Items"
              value={params.gap}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, gap: val })
              }}
              onBlur={field.handleBlur}
              min={0}
              max={100}
              unit="px"
              help="Spacing between platform items"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="showtext">
          {(field) => (
            <FormSwitch
              label="Show Platform Handles"
              checked={params.showtext}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, showtext: checked })
              }}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="bg">
          {(field) => (
            <FormSwitch
              label="Show Background Panels"
              checked={params.bg}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, bg: checked })
              }}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.bg && (
          <form.Field name="borderradius">
            {(field) => (
              <FormNumberSlider
                label="Border Radius"
                value={params.borderradius}
                onChange={(val) => {
                  field.handleChange(val)
                  updateState({ ...params, borderradius: val })
                }}
                onBlur={field.handleBlur}
                min={0}
                max={32}
                unit="px"
                help="Corner radius for background panels"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>
        )}
      </CollapsibleSection>

      {/* Background Panel */}
      {params.bg && (
        <CollapsibleSection title="Background Panel" defaultOpen={false} storageKey="socials-bgpanel">
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

      {/* Section 4: Icon Customization */}
      <CollapsibleSection title="Icon Customization" defaultOpen={false} storageKey="socials-icons">
        <form.Field name="iconcolor">
          {(field) => (
            <FormSelectInput
              label="Icon Color Mode"
              value={params.iconcolor}
              onChange={(val) => {
                field.handleChange(val as any)
                updateState({ ...params, iconcolor: val as any })
              }}
              options={ICON_COLOR_MODE_OPTIONS}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

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
              max={64}
              unit="px"
              help="0 = use size preset, otherwise custom size"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="iconpadding">
          {(field) => (
            <FormNumberSlider
              label="Icon Padding"
              value={params.iconpadding}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, iconpadding: val })
              }}
              onBlur={field.handleBlur}
              min={0}
              max={32}
              unit="px"
              help="Padding around icons"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="icons">
          {(field) => (
            <FormTextInput
              label="Custom Icons"
              value={params.icons}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, icons: val })
              }}
              onBlur={field.handleBlur}
              placeholder="e.g., github:star,twitter:bird"
              help="Override icons: platform:iconname,platform:iconname (Lucide icon names)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>
      </CollapsibleSection>

      {/* Section 5: Text Styling */}
      <CollapsibleSection title="Text Styling" defaultOpen={false} storageKey="socials-text">
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

        <form.Field name="fontsize">
          {(field) => (
            <FormNumberSlider
              label="Font Size Override"
              value={params.fontsize}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, fontsize: val })
              }}
              onBlur={field.handleBlur}
              min={0}
              max={32}
              unit="px"
              help="0 = use size preset, otherwise custom size"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="fontweight">
          {(field) => (
            <FormNumberSlider
              label="Font Weight"
              value={params.fontweight}
              onChange={(val) => {
                field.handleChange(val)
                updateState({ ...params, fontweight: val })
              }}
              onBlur={field.handleBlur}
              min={100}
              max={900}
              step={100}
              help="Boldness of text (400 = normal, 700 = bold)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

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
      </CollapsibleSection>

      {/* Section 6: Entrance Animation */}
      <CollapsibleSection title="Entrance Animation" defaultOpen={false} storageKey="socials-entrance">
        <div>
          <label className="config-label">Animation Type</label>
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
                max={5}
                step={0.1}
                unit="s"
                help="Animation duration"
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field name="delay">
            {(field) => (
              <FormNumberSlider
                label="Delay"
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
      </CollapsibleSection>

      {/* Section 7: Exit Animation */}
      <CollapsibleSection title="Exit Animation" defaultOpen={false} storageKey="socials-exit">
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
      <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="socials-loop">
        <form.Field name="loop">
          {(field) => (
            <FormSwitch
              label="Enable Loop Mode"
              checked={params.loop}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, loop: checked })
              }}
              help="All appear → hold → all disappear → pause → repeat"
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

      {/* Section 9: One-by-One Mode */}
      <CollapsibleSection title="One-by-One Mode" defaultOpen={false} storageKey="socials-onebyone">
        <form.Field name="onebyone">
          {(field) => (
            <FormSwitch
              label="Enable One-by-One Mode"
              checked={params.onebyone}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                updateState({ ...params, onebyone: checked })
              }}
              help="Show one platform at a time (cycle through all)"
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        {params.onebyone && (
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="each">
              {(field) => (
                <FormNumberSlider
                  label="Show Each"
                  value={params.each}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, each: val })
                  }}
                  onBlur={field.handleBlur}
                  min={1}
                  max={30}
                  unit="s"
                  help="Display duration for each platform"
                  error={field.state.meta.errors?.[0]}
                />
              )}
            </form.Field>

            <form.Field name="eachpause">
              {(field) => (
                <FormNumberSlider
                  label="Pause Between"
                  value={params.eachpause}
                  onChange={(val) => {
                    field.handleChange(val)
                    updateState({ ...params, eachpause: val })
                  }}
                  onBlur={field.handleBlur}
                  min={0}
                  max={10}
                  step={0.1}
                  unit="s"
                  help="Pause between platforms"
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
        entrancespeed={params.speed}
        hold={params.hold}
        exitspeed={params.exitspeed}
        pause={params.pause}
        loop={params.loop}
        entrance={params.entrance}
        exit={params.exit}
        exitafter={params.exitafter}
      />

      {/* Section 10: Theme & Colors */}
      <CollapsibleSection
        title="Theme & Colors"
        defaultOpen={false}
        storageKey="socials-theme"
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
        storageKey="socials-help"
      >
        <SocialsOverlayHelp />
      </CollapsibleSection>
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      overlayTitle="Socials Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/socials"
          params={params}
          defaults={SOCIALS_DEFAULTS}
          overlayType="socials"
          onImportConfig={(importedParams) => {
            // Use updateState for immediate history entry
            // Platforms will sync via useEffect
            updateState(importedParams as SocialsOverlayParams)
          }}
        />
      }
      undoRedoControls={{ undo, redo, canUndo, canRedo }}
    />
  )
}
