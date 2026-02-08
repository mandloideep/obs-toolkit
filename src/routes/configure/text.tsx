/**
 * Text Overlay Configurator
 * Visual configuration UI for text overlay parameters
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
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { TEXT_DEFAULTS } from '../../types/text.types'
import type { TextOverlayParams } from '../../types/text.types'

export const Route = createFileRoute('/configure/text')({
  component: TextConfigurator,
})

function TextConfigurator() {
  const [params, setParams] = useState<TextOverlayParams>(TEXT_DEFAULTS)

  const updateParam = <K extends keyof TextOverlayParams>(
    key: K,
    value: TextOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const previewUrl = `${window.location.origin}/overlays/text?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== TEXT_DEFAULTS[key as keyof TextOverlayParams]) {
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
                { value: 'brb', label: 'Be Right Back' },
                { value: 'chatting', label: 'Just Chatting' },
                { value: 'starting', label: 'Starting Soon' },
                { value: 'ending', label: 'Thanks for Watching' },
                { value: 'technical', label: 'Technical Difficulties' },
              ]}
            />
          </div>
        </div>

        {/* Section 2: Content */}
        <CollapsibleSection title="Content" defaultOpen={true} storageKey="text-content">
            <div>
              <label className="config-label">Main Text</label>
              <FormInput
                type="text"
                value={params.text}
                onChange={(e) => updateParam('text', e.target.value)}
                placeholder="Enter main text"
              />
            </div>
            <div>
              <label className="config-label">Subtitle</label>
              <FormInput
                type="text"
                value={params.sub}
                onChange={(e) => updateParam('sub', e.target.value)}
                placeholder="Enter subtitle (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="config-label">Text Size (px)</label>
                <FormInput
                  type="number"
                  value={params.size}
                  onChange={(e) => updateParam('size', Number(e.target.value))}
                  min="12"
                  max="200"
                />
              </div>
              <div>
                <label className="config-label">Subtitle Size (px)</label>
                <FormInput
                  type="number"
                  value={params.subsize}
                  onChange={(e) => updateParam('subsize', Number(e.target.value))}
                  min="8"
                  max="100"
                />
              </div>
            </div>
        </CollapsibleSection>

        {/* Section 3: Typography (Hidden Parameters) */}
        <CollapsibleSection title="Typography" defaultOpen={false} storageKey="text-typography">
          <div>
            <label className="config-label">Font Family</label>
            <FormSelect
              value={params.font}
              onValueChange={(value) => updateParam('font', value as any)}
              options={[
                { value: 'display', label: 'Display' },
                { value: 'body', label: 'Body' },
                { value: 'mono', label: 'Mono' },
                { value: 'custom1', label: 'Custom 1' },
                { value: 'custom2', label: 'Custom 2' },
                { value: 'custom3', label: 'Custom 3' },
                { value: 'custom4', label: 'Custom 4' },
                { value: 'custom5', label: 'Custom 5' },
              ]}
            />
          </div>

          <NumberSlider
            label="Font Weight"
            value={params.weight}
            onChange={(val) => updateParam('weight', val)}
            min={100}
            max={900}
            step={100}
            help="Controls the boldness of the text (100 = thin, 900 = black)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="config-label">Text Color</label>
              <FormInput
                type="text"
                value={params.textcolor}
                onChange={(e) => updateParam('textcolor', e.target.value)}
                placeholder="Leave empty for gradient"
              />
            </div>
            <div>
              <label className="config-label">Subtitle Color</label>
              <FormInput
                type="text"
                value={params.subcolor}
                onChange={(e) => updateParam('subcolor', e.target.value)}
                placeholder="Leave empty for gradient"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 4: Spacing & Position (Hidden Parameters) */}
        <CollapsibleSection title="Spacing & Position" defaultOpen={false} storageKey="text-spacing">
          <div className="grid grid-cols-2 gap-4">
            <NumberSlider
              label="Padding X"
              value={params.padx || params.pad}
              onChange={(val) => updateParam('padx', val)}
              min={0}
              max={100}
              unit="px"
              help="Horizontal padding around text"
            />
            <NumberSlider
              label="Padding Y"
              value={params.pady || params.pad}
              onChange={(val) => updateParam('pady', val)}
              min={0}
              max={100}
              unit="px"
              help="Vertical padding around text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberSlider
              label="Margin X"
              value={params.marginx}
              onChange={(val) => updateParam('marginx', val)}
              min={0}
              max={200}
              unit="px"
              help="Horizontal margin from edge"
            />
            <NumberSlider
              label="Margin Y"
              value={params.marginy}
              onChange={(val) => updateParam('marginy', val)}
              min={0}
              max={200}
              unit="px"
              help="Vertical margin from edge"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberSlider
              label="Offset X"
              value={params.offsetx}
              onChange={(val) => updateParam('offsetx', val)}
              min={-500}
              max={500}
              unit="px"
              help="Fine-tune horizontal position"
            />
            <NumberSlider
              label="Offset Y"
              value={params.offsety}
              onChange={(val) => updateParam('offsety', val)}
              min={-500}
              max={500}
              unit="px"
              help="Fine-tune vertical position"
            />
          </div>

          <div>
            <label className="config-label">Max Width</label>
            <FormInput
              type="text"
              value={params.maxwidth}
              onChange={(e) => updateParam('maxwidth', e.target.value)}
              placeholder="auto, 500px, 80%, etc."
            />
          </div>
        </CollapsibleSection>

        {/* Section 5: Layout */}
        <CollapsibleSection title="Layout" defaultOpen={true} storageKey="text-layout">
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
            <div className="flex items-center gap-3">
              <Switch
                id="bg"
                checked={params.bg}
                onCheckedChange={(checked) => updateParam('bg', checked)}
              />
              <label htmlFor="bg" className="text-sm text-dark-muted cursor-pointer">
                Show background panel
              </label>
            </div>
        </CollapsibleSection>

        {/* Section 6: Signature Line */}
        <CollapsibleSection title="Signature Line" defaultOpen={true} storageKey="text-line">
            <div className="flex items-center gap-3">
              <Switch
                id="line"
                checked={params.line}
                onCheckedChange={(checked) => updateParam('line', checked)}
              />
              <label htmlFor="line" className="text-sm text-dark-muted cursor-pointer">
                Show signature line
              </label>
            </div>
            {params.line && (
              <>
                <div>
                  <label className="config-label">Line Style</label>
                  <FormSelect
                    value={params.linestyle}
                    onValueChange={(value) => updateParam('linestyle', value as any)}
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
                  />
                </div>

                <div>
                  <label className="config-label">Line Animation</label>
                  <FormSelect
                    value={params.lineanim}
                    onValueChange={(value) => updateParam('lineanim', value as any)}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'slide', label: 'Slide' },
                      { value: 'grow', label: 'Grow' },
                      { value: 'pulse', label: 'Pulse' },
                    ]}
                  />
                </div>

                <div>
                  <label className="config-label">Line Position</label>
                  <FormSelect
                    value={params.linepos}
                    onValueChange={(value) => updateParam('linepos', value as any)}
                    options={[
                      { value: 'top', label: 'Top' },
                      { value: 'bottom', label: 'Bottom' },
                      { value: 'both', label: 'Both' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <NumberSlider
                    label="Line Length"
                    value={params.linelength}
                    onChange={(val) => updateParam('linelength', val)}
                    min={0}
                    max={100}
                    unit="%"
                    help="Line length as percentage of container width"
                  />
                  <NumberSlider
                    label="Line Width"
                    value={params.linewidth}
                    onChange={(val) => updateParam('linewidth', val)}
                    min={1}
                    max={10}
                    unit="px"
                    help="Line stroke thickness"
                  />
                </div>

                <NumberSlider
                  label="Line Speed"
                  value={params.linespeed}
                  onChange={(val) => updateParam('linespeed', val)}
                  min={0.5}
                  max={5}
                  step={0.1}
                  unit="s"
                  help="Animation speed in seconds"
                />
              </>
            )}
        </CollapsibleSection>

        {/* Section 7: Animations */}
        <CollapsibleSection title="Animations" defaultOpen={true} storageKey="text-animations">
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
                  { value: 'typewriter', label: 'Typewriter' },
                  { value: 'flipIn', label: 'Flip In' },
                  { value: 'zoomBounce', label: 'Zoom Bounce' },
                  { value: 'rotateIn', label: 'Rotate In' },
                  { value: 'zoomIn', label: 'Zoom In' },
                  { value: 'stagger', label: 'Stagger' },
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
                  { value: 'slideLeft', label: 'Slide Left' },
                  { value: 'slideRight', label: 'Slide Right' },
                  { value: 'scale', label: 'Scale' },
                  { value: 'fadeLeft', label: 'Fade Left' },
                  { value: 'zoomOut', label: 'Zoom Out' },
                  { value: 'rotateOut', label: 'Rotate Out' },
                  { value: 'flipOut', label: 'Flip Out' },
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
        <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="text-loop">
            <div className="flex items-center gap-3">
              <Switch
                id="loop"
                checked={params.loop}
                onCheckedChange={(checked) => updateParam('loop', checked)}
              />
              <label htmlFor="loop" className="text-sm text-dark-muted cursor-pointer">
                Enable loop mode (appear → hold → disappear → pause → repeat)
              </label>
            </div>
            {params.loop && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="config-label">Hold Visible (s)</label>
                  <FormInput
                    type="number"
                    value={params.hold}
                    onChange={(e) => updateParam('hold', Number(e.target.value))}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="config-label">Pause Hidden (s)</label>
                  <FormInput
                    type="number"
                    value={params.pause}
                    onChange={(e) => updateParam('pause', Number(e.target.value))}
                    min="0"
                    max="60"
                  />
                </div>
              </div>
            )}
        </CollapsibleSection>

        {/* Section 9: Theme & Colors */}
        <CollapsibleSection title="Theme & Colors" defaultOpen={true} storageKey="text-theme">
            <div>
              <label className="config-label">Gradient Preset</label>
              <FormSelect
                value={params.gradient}
                onValueChange={(value) => updateParam('gradient', value as any)}
                options={[
                  { value: 'indigo', label: 'Indigo' },
                  { value: 'cyan', label: 'Cyan' },
                  { value: 'sunset', label: 'Sunset' },
                  { value: 'emerald', label: 'Emerald' },
                  { value: 'purple', label: 'Purple' },
                  { value: 'neon', label: 'Neon' },
                  { value: 'fire', label: 'Fire' },
                  { value: 'ocean', label: 'Ocean' },
                ]}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="textgradient"
                checked={params.textgradient}
                onCheckedChange={(checked) => updateParam('textgradient', checked)}
              />
              <label htmlFor="textgradient" className="text-sm text-dark-muted cursor-pointer">
                Apply gradient to text
              </label>
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
      overlayTitle="Text Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/text"
          params={params}
          defaults={TEXT_DEFAULTS}
        />
      }
    />
  )
}
