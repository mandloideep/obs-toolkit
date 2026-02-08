/**
 * CTA Overlay Configurator
 * Visual configuration UI for call-to-action overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { CollapsibleSection } from '../../components/configure/form/CollapsibleSection'
import { NumberSlider } from '../../components/configure/form/NumberSlider'
import { ColorArrayInput } from '../../components/configure/form/ColorArrayInput'
import { FormInput } from '../../components/configure/form/FormInput'
import { FormSelect } from '../../components/configure/form/FormSelect'
import { GradientSelect } from '../../components/configure/form/GradientSelect'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { CTA_DEFAULTS } from '../../types/cta.types'
import type { CTAOverlayParams } from '../../types/cta.types'

export const Route = createFileRoute('/configure/cta')({
  component: CTAConfigurator,
})

function CTAConfigurator() {
  const [params, setParams] = useState<CTAOverlayParams>(CTA_DEFAULTS)

  const updateParam = <K extends keyof CTAOverlayParams>(
    key: K,
    value: CTAOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setParams(CTA_DEFAULTS)
  }

  const previewUrl = `${window.location.origin}/overlays/cta?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== CTA_DEFAULTS[key as keyof CTAOverlayParams]) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()}`

  const configSections = (
    <>
      {/* Section 1: Quick Presets */}
      <div className="config-section">
        <h2 className="text-2xl font-semibold mb-6">Quick Presets</h2>
        <div>
          <label className="config-label">Preset</label>
          <FormSelect
            value={params.preset}
            onValueChange={(value) => updateParam('preset', value as any)}
            options={[
              { value: 'custom', label: 'Custom' },
              { value: 'subscribe', label: 'Subscribe' },
              { value: 'like', label: 'Like & Subscribe' },
              { value: 'follow', label: 'Follow' },
              { value: 'share', label: 'Share' },
              { value: 'notify', label: 'Turn on Notifications' },
            ]}
          />
        </div>
      </div>

      {/* Section 2: Content */}
      <CollapsibleSection title="Content" defaultOpen={true} storageKey="cta-content">
        <div>
          <label className="config-label">Main Text</label>
          <FormInput
            type="text"
            value={params.text}
            onChange={(e) => updateParam('text', e.target.value)}
            placeholder="e.g., Subscribe"
          />
        </div>

        <div>
          <label className="config-label">Subtitle</label>
          <FormInput
            type="text"
            value={params.sub}
            onChange={(e) => updateParam('sub', e.target.value)}
            placeholder="e.g., for more content!"
          />
        </div>

        <NumberSlider
          label="Text Size"
          value={params.size}
          onChange={(val) => updateParam('size', val)}
          min={12}
          max={100}
          unit="px"
          help="Font size for main text"
        />
      </CollapsibleSection>

      {/* Section 3: Icon Customization */}
      <CollapsibleSection title="Icon Customization" defaultOpen={true} storageKey="cta-icon">
        <div>
          <label className="config-label">Icon Type</label>
          <FormSelect
            value={params.icon}
            onValueChange={(value) => updateParam('icon', value as any)}
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
        </div>

        {params.icon !== 'none' && (
          <>
            <div>
              <label className="config-label">Custom Icon (Lucide name)</label>
              <FormInput
                type="text"
                value={params.customicon}
                onChange={(e) => updateParam('customicon', e.target.value)}
                placeholder="Leave empty to use preset icon"
              />
              <p className="text-xs text-dark-muted mt-1">
                Override with any Lucide icon name (e.g., 'heart', 'star', 'bell')
              </p>
            </div>

            <div>
              <label className="config-label">Icon Position</label>
              <FormSelect
                value={params.iconpos}
                onValueChange={(value) => updateParam('iconpos', value as any)}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                ]}
              />
            </div>

            <div>
              <label className="config-label">Icon Animation</label>
              <FormSelect
                value={params.iconanim}
                onValueChange={(value) => updateParam('iconanim', value as any)}
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
            </div>

            <NumberSlider
              label="Icon Size Override"
              value={params.iconsize}
              onChange={(val) => updateParam('iconsize', val)}
              min={0}
              max={100}
              unit="px"
              help="0 = auto size, otherwise custom size"
            />

            <div>
              <label className="config-label">Icon Color</label>
              <FormInput
                type="text"
                value={params.iconcolor}
                onChange={(e) => updateParam('iconcolor', e.target.value)}
                placeholder="Leave empty for auto color"
              />
              <p className="text-xs text-dark-muted mt-1">
                Hex color (e.g., FF0000) or leave empty for gradient color
              </p>
            </div>
          </>
        )}
      </CollapsibleSection>

      {/* Section 4: Text Styling (Hidden Parameters) */}
      <CollapsibleSection title="Text Styling" defaultOpen={false} storageKey="cta-text">
        <div className="grid grid-cols-2 gap-4">
          <NumberSlider
            label="Text Padding X"
            value={params.textpadx}
            onChange={(val) => updateParam('textpadx', val)}
            min={0}
            max={100}
            unit="px"
            help="Horizontal padding around text"
          />
          <NumberSlider
            label="Text Padding Y"
            value={params.textpady}
            onChange={(val) => updateParam('textpady', val)}
            min={0}
            max={100}
            unit="px"
            help="Vertical padding around text"
          />
        </div>

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

        <NumberSlider
          label="Line Height"
          value={params.lineheight}
          onChange={(val) => updateParam('lineheight', val)}
          min={0.8}
          max={2}
          step={0.1}
          help="Line height multiplier (1.2 = 120%)"
        />
      </CollapsibleSection>

      {/* Section 5: Decoration */}
      <CollapsibleSection title="Decoration" defaultOpen={false} storageKey="cta-decoration">
        <div>
          <label className="config-label">Decoration Style</label>
          <FormSelect
            value={params.decoration}
            onValueChange={(value) => updateParam('decoration', value as any)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'line', label: 'Line' },
              { value: 'slant', label: 'Slant' },
              { value: 'swirl', label: 'Swirl' },
            ]}
          />
        </div>

        {params.decoration !== 'none' && (
          <div>
            <label className="config-label">Decoration Color</label>
            <FormInput
              type="text"
              value={params.decorationcolor}
              onChange={(e) => updateParam('decorationcolor', e.target.value)}
              placeholder="Leave empty for auto color"
            />
            <p className="text-xs text-dark-muted mt-1">
              Hex color or leave empty for gradient color
            </p>
          </div>
        )}
      </CollapsibleSection>

      {/* Section 6: Layout */}
      <CollapsibleSection title="Layout" defaultOpen={false} storageKey="cta-layout">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="config-label">Horizontal Align</label>
            <FormSelect
              value={params.align}
              onValueChange={(value) => updateParam('align', value as any)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />
          </div>

          <div>
            <label className="config-label">Vertical Align</label>
            <FormSelect
              value={params.valign}
              onValueChange={(value) => updateParam('valign', value as any)}
              options={[
                { value: 'top', label: 'Top' },
                { value: 'center', label: 'Center' },
                { value: 'bottom', label: 'Bottom' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bg">Show Background Panel</Label>
          <Switch
            id="bg"
            checked={params.bg}
            onCheckedChange={(checked) => updateParam('bg', checked)}
          />
        </div>
      </CollapsibleSection>

      {/* Section 7: Animations */}
      <CollapsibleSection title="Animations" defaultOpen={false} storageKey="cta-animations">
        <div>
          <label className="config-label">Entrance Animation</label>
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
              { value: 'bounce', label: 'Bounce' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberSlider
            label="Entrance Speed"
            value={params.entrancespeed}
            onChange={(val) => updateParam('entrancespeed', val)}
            min={0.1}
            max={5}
            step={0.1}
            unit="s"
            help="Duration of entrance animation"
          />
          <NumberSlider
            label="Entrance Delay"
            value={params.delay}
            onChange={(val) => updateParam('delay', val)}
            min={0}
            max={10}
            step={0.1}
            unit="s"
            help="Delay before animation starts"
          />
        </div>

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
        )}
      </CollapsibleSection>

      {/* Section 8: Loop Mode */}
      <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="cta-loop">
        <div className="flex items-center justify-between">
          <Label htmlFor="loop">Enable Loop Mode</Label>
          <Switch
            id="loop"
            checked={params.loop}
            onCheckedChange={(checked) => updateParam('loop', checked)}
          />
        </div>
        <p className="text-xs text-dark-muted -mt-2">Appear → hold → disappear → pause → repeat</p>

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

      {/* Section 9: Theme & Colors */}
      <CollapsibleSection title="Theme & Colors" defaultOpen={false} storageKey="cta-theme">
        <div>
          <label className="config-label">Gradient Preset</label>
          <GradientSelect
            value={params.gradient}
            onValueChange={(value) => updateParam('gradient', value as any)}
            showAll={true}
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
      overlayTitle="CTA Overlay"
      onReset={handleReset}
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/cta"
          params={params}
          defaults={CTA_DEFAULTS}
        />
      }
    />
  )
}
