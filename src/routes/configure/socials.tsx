/**
 * Socials Overlay Configurator
 * Visual configuration UI for social media overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { NumberSlider } from '../../components/configure/form/NumberSlider'
import { ColorArrayInput } from '../../components/configure/form/ColorArrayInput'
import { FormInput } from '../../components/configure/form/FormInput'
import { FormSelect } from '../../components/configure/form/FormSelect'
import { GradientGrid } from '../../components/configure/form/GradientGrid'
import { PresetManager } from '../../components/configure/PresetManager'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { SOCIALS_DEFAULTS } from '../../types/socials.types'
import type { SocialsOverlayParams } from '../../types/socials.types'
import { useHistory } from '../../hooks/useHistory'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { usePresets } from '../../hooks/usePresets'

export const Route = createFileRoute('/configure/socials')({
  component: SocialsConfigurator,
})

type PlatformData = {
  enabled: boolean
  handle: string
}

type AllPlatforms = {
  github: PlatformData
  twitter: PlatformData
  linkedin: PlatformData
  youtube: PlatformData
  instagram: PlatformData
  twitch: PlatformData
  kick: PlatformData
  discord: PlatformData
  website: PlatformData
}

function SocialsConfigurator() {
  const { state: params, setState: setParams, updateState, undo, redo, canUndo, canRedo } = useHistory<SocialsOverlayParams>(SOCIALS_DEFAULTS)

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

  const handleLoadPreset = (name: string) => {
    const presetParams = loadPreset(name)
    if (presetParams) {
      // Use updateState for immediate history entry
      // Platforms will sync via useEffect
      updateState(presetParams)
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

  const updateParam = <K extends keyof SocialsOverlayParams>(
    key: K,
    value: SocialsOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
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

  const previewUrl = `${window.location.origin}/overlays/socials?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== SOCIALS_DEFAULTS[key as keyof SocialsOverlayParams]) {
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                <FormInput
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

      {/* Section 2: Platform Ordering (Hidden Parameters) */}
      <CollapsibleSection title="Platform Ordering" defaultOpen={false} storageKey="socials-ordering">
        <div>
          <label className="config-label">Order Mode</label>
          <FormSelect
            value={params.order}
            onValueChange={(value) => updateParam('order', value as any)}
            options={[
              { value: 'default', label: 'Default Order' },
              { value: 'priority', label: 'Priority Order' },
            ]}
          />
        </div>

        {params.order === 'priority' && (
          <div>
            <label className="config-label">Platform Priority</label>
            <FormInput
              type="text"
              value={params.priority}
              onChange={(e) => updateParam('priority', e.target.value)}
              placeholder="e.g., youtube:1,github:2,twitter:3"
            />
            <p className="text-xs text-dark-muted mt-1">
              Set priority: platform:rank,platform:rank (lower rank appears first)
            </p>
          </div>
        )}
      </CollapsibleSection>

      {/* Section 3: Layout */}
      <CollapsibleSection title="Layout" defaultOpen={true} storageKey="socials-layout">
        <div>
          <label className="config-label">Layout Direction</label>
          <FormSelect
            value={params.layout}
            onValueChange={(value) => updateParam('layout', value as any)}
            options={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
              { value: 'grid', label: 'Grid' },
            ]}
          />
        </div>

        <div>
          <label className="config-label">Size Preset</label>
          <FormSelect
            value={params.size}
            onValueChange={(value) => updateParam('size', value as any)}
            options={[
              { value: 'sm', label: 'Small (icon: 20px, text: 13px)' },
              { value: 'md', label: 'Medium (icon: 24px, text: 15px)' },
              { value: 'lg', label: 'Large (icon: 32px, text: 18px)' },
              { value: 'xl', label: 'Extra Large (icon: 40px, text: 22px)' },
            ]}
          />
        </div>

        <NumberSlider
          label="Gap Between Items"
          value={params.gap}
          onChange={(val) => updateParam('gap', val)}
          min={0}
          max={100}
          unit="px"
          help="Spacing between platform items"
        />

        <div className="flex items-center justify-between">
          <Label htmlFor="showtext">Show Platform Handles</Label>
          <Switch
            id="showtext"
            checked={params.showtext}
            onCheckedChange={(checked) => updateParam('showtext', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bg">Show Background Panels</Label>
          <Switch
            id="bg"
            checked={params.bg}
            onCheckedChange={(checked) => updateParam('bg', checked)}
          />
        </div>

        {params.bg && (
          <NumberSlider
            label="Border Radius"
            value={params.borderradius}
            onChange={(val) => updateParam('borderradius', val)}
            min={0}
            max={32}
            unit="px"
            help="Corner radius for background panels"
          />
        )}
      </CollapsibleSection>

      {/* Section 4: Icon Customization (Hidden Parameters) */}
      <CollapsibleSection title="Icon Customization" defaultOpen={false} storageKey="socials-icons">
        <div>
          <label className="config-label">Icon Color Mode</label>
          <FormSelect
            value={params.iconcolor}
            onValueChange={(value) => updateParam('iconcolor', value as any)}
            options={[
              { value: 'brand', label: "Brand Colors (each platform's color)" },
              { value: 'platform', label: 'Platform Colors' },
              { value: 'gradient', label: 'Gradient' },
              { value: 'white', label: 'White' },
            ]}
          />
        </div>

        <NumberSlider
          label="Icon Size Override"
          value={params.iconsize}
          onChange={(val) => updateParam('iconsize', val)}
          min={0}
          max={64}
          unit="px"
          help="0 = use size preset, otherwise custom size"
        />

        <NumberSlider
          label="Icon Padding"
          value={params.iconpadding}
          onChange={(val) => updateParam('iconpadding', val)}
          min={0}
          max={32}
          unit="px"
          help="Padding around icons"
        />

        <div>
          <label className="config-label">Custom Icons</label>
          <FormInput
            type="text"
            value={params.icons}
            onChange={(e) => updateParam('icons', e.target.value)}
            placeholder="e.g., github:star,twitter:bird"
          />
          <p className="text-xs text-dark-muted mt-1">
            Override icons: platform:iconname,platform:iconname (Lucide icon names)
          </p>
        </div>
      </CollapsibleSection>

      {/* Section 5: Text Styling (Hidden Parameters) */}
      <CollapsibleSection title="Text Styling" defaultOpen={false} storageKey="socials-text">
        <NumberSlider
          label="Font Size Override"
          value={params.fontsize}
          onChange={(val) => updateParam('fontsize', val)}
          min={0}
          max={32}
          unit="px"
          help="0 = use size preset, otherwise custom size"
        />

        <NumberSlider
          label="Font Weight"
          value={params.fontweight}
          onChange={(val) => updateParam('fontweight', val)}
          min={100}
          max={900}
          step={100}
          help="Boldness of text (400 = normal, 700 = bold)"
        />

        <NumberSlider
          label="Letter Spacing"
          value={params.letterspacing}
          onChange={(val) => updateParam('letterspacing', val)}
          min={-2}
          max={4}
          step={0.1}
          unit="px"
          help="Space between letters"
        />
      </CollapsibleSection>

      {/* Section 6: Entrance Animation */}
      <CollapsibleSection title="Entrance Animation" defaultOpen={false} storageKey="socials-entrance">
        <div>
          <label className="config-label">Animation Type</label>
          <FormSelect
            value={params.entrance}
            onValueChange={(value) => updateParam('entrance', value as any)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'fade', label: 'Fade' },
              { value: 'slideUp', label: 'Slide Up' },
              { value: 'slideDown', label: 'Slide Down' },
              { value: 'slideLeft', label: 'Slide Left' },
              { value: 'slideRight', label: 'Slide Right' },
              { value: 'scale', label: 'Scale' },
              { value: 'stagger', label: 'Stagger (one by one)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberSlider
            label="Speed"
            value={params.speed}
            onChange={(val) => updateParam('speed', val)}
            min={0.1}
            max={5}
            step={0.1}
            unit="s"
            help="Animation duration"
          />
          <NumberSlider
            label="Delay"
            value={params.delay}
            onChange={(val) => updateParam('delay', val)}
            min={0}
            max={10}
            step={0.1}
            unit="s"
            help="Delay before animation starts"
          />
        </div>
      </CollapsibleSection>

      {/* Section 7: Exit Animation */}
      <CollapsibleSection title="Exit Animation" defaultOpen={false} storageKey="socials-exit">
        <div>
          <label className="config-label">Exit Animation</label>
          <FormSelect
            value={params.exit}
            onValueChange={(value) => updateParam('exit', value as any)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'fade', label: 'Fade' },
              { value: 'slideDown', label: 'Slide Down' },
              { value: 'slideUp', label: 'Slide Up' },
              { value: 'scale', label: 'Scale' },
            ]}
          />
        </div>

        {params.exit !== 'none' && (
          <div className="grid grid-cols-2 gap-4">
            <NumberSlider
              label="Exit Speed"
              value={params.exitspeed}
              onChange={(val) => updateParam('exitspeed', val)}
              min={0.1}
              max={5}
              step={0.1}
              unit="s"
              help="Duration of exit animation"
            />
            <NumberSlider
              label="Exit After"
              value={params.exitafter}
              onChange={(val) => updateParam('exitafter', val)}
              min={0}
              max={300}
              unit="s"
              help="Auto-exit after N seconds (0 = manual)"
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Section 8: Loop Mode */}
      <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="socials-loop">
        <div className="flex items-center justify-between">
          <Label htmlFor="loop">Enable Loop Mode</Label>
          <Switch
            id="loop"
            checked={params.loop}
            onCheckedChange={(checked) => updateParam('loop', checked)}
          />
        </div>
        <p className="text-xs text-dark-muted -mt-2">All appear → hold → all disappear → pause → repeat</p>

        {params.loop && (
          <div className="grid grid-cols-2 gap-4">
            <NumberSlider
              label="Hold Visible"
              value={params.hold}
              onChange={(val) => updateParam('hold', val)}
              min={1}
              max={60}
              unit="s"
              help="How long to stay visible"
            />
            <NumberSlider
              label="Pause Hidden"
              value={params.pause}
              onChange={(val) => updateParam('pause', val)}
              min={0}
              max={60}
              unit="s"
              help="How long to stay hidden"
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Section 9: One-by-One Mode */}
      <CollapsibleSection title="One-by-One Mode" defaultOpen={false} storageKey="socials-onebyone">
        <div className="flex items-center justify-between">
          <Label htmlFor="onebyone">Enable One-by-One Mode</Label>
          <Switch
            id="onebyone"
            checked={params.onebyone}
            onCheckedChange={(checked) => updateParam('onebyone', checked)}
          />
        </div>
        <p className="text-xs text-dark-muted -mt-2">Show one platform at a time (cycle through all)</p>

        {params.onebyone && (
          <div className="grid grid-cols-2 gap-4">
            <NumberSlider
              label="Show Each"
              value={params.each}
              onChange={(val) => updateParam('each', val)}
              min={1}
              max={30}
              unit="s"
              help="Display duration for each platform"
            />
            <NumberSlider
              label="Pause Between"
              value={params.eachpause}
              onChange={(val) => updateParam('eachpause', val)}
              min={0}
              max={10}
              step={0.1}
              unit="s"
              help="Pause between platforms"
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Section 10: Theme & Colors */}
      <CollapsibleSection
        title="Theme & Colors"
        defaultOpen={false}
        storageKey="socials-theme"
        onReset={resetThemeColors}
      >
        <div>
          <label className="config-label">Gradient Preset</label>
          <GradientGrid
            value={params.gradient}
            onValueChange={(value) => updateParam('gradient', value as any)}
          />
        </div>

        <ColorArrayInput
          label="Custom Colors"
          colors={params.colors}
          onChange={(colors) => updateParam('colors', colors)}
          maxColors={5}
        />
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
