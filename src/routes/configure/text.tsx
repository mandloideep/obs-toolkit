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
            <select
              className="config-select"
              value={params.preset}
              onChange={(e) => updateParam('preset', e.target.value as any)}
            >
              <option value="custom">Custom</option>
              <option value="brb">Be Right Back</option>
              <option value="chatting">Just Chatting</option>
              <option value="starting">Starting Soon</option>
              <option value="ending">Thanks for Watching</option>
              <option value="technical">Technical Difficulties</option>
            </select>
          </div>
        </div>

        {/* Section 2: Content */}
        <CollapsibleSection title="Content" defaultOpen={true} storageKey="text-content">
            <div>
              <label className="config-label">Main Text</label>
              <input
                className="config-input"
                type="text"
                value={params.text}
                onChange={(e) => updateParam('text', e.target.value)}
                placeholder="Enter main text"
              />
            </div>
            <div>
              <label className="config-label">Subtitle</label>
              <input
                className="config-input"
                type="text"
                value={params.sub}
                onChange={(e) => updateParam('sub', e.target.value)}
                placeholder="Enter subtitle (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="config-label">Text Size (px)</label>
                <input
                  className="config-input"
                  type="number"
                  value={params.size}
                  onChange={(e) => updateParam('size', Number(e.target.value))}
                  min="12"
                  max="200"
                />
              </div>
              <div>
                <label className="config-label">Subtitle Size (px)</label>
                <input
                  className="config-input"
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
            <select
              className="config-select"
              value={params.font}
              onChange={(e) => updateParam('font', e.target.value as any)}
            >
              <option value="display">Display</option>
              <option value="body">Body</option>
              <option value="mono">Mono</option>
              <option value="custom1">Custom 1</option>
              <option value="custom2">Custom 2</option>
              <option value="custom3">Custom 3</option>
              <option value="custom4">Custom 4</option>
              <option value="custom5">Custom 5</option>
            </select>
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
              <input
                className="config-input"
                type="text"
                value={params.textcolor}
                onChange={(e) => updateParam('textcolor', e.target.value)}
                placeholder="Leave empty for gradient"
              />
            </div>
            <div>
              <label className="config-label">Subtitle Color</label>
              <input
                className="config-input"
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
            <input
              className="config-input"
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
                <select
                  className="config-select"
                  value={params.align}
                  onChange={(e) => updateParam('align', e.target.value as any)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label className="config-label">Vertical Align</label>
                <select
                  className="config-select"
                  value={params.valign}
                  onChange={(e) => updateParam('valign', e.target.value as any)}
                >
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="bg"
                className="w-4 h-4 rounded"
                checked={params.bg}
                onChange={(e) => updateParam('bg', e.target.checked)}
              />
              <label htmlFor="bg" className="text-sm text-dark-muted cursor-pointer">
                Show background panel
              </label>
            </div>
        </CollapsibleSection>

        {/* Section 6: Signature Line */}
        <CollapsibleSection title="Signature Line" defaultOpen={true} storageKey="text-line">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="line"
                className="w-4 h-4 rounded"
                checked={params.line}
                onChange={(e) => updateParam('line', e.target.checked)}
              />
              <label htmlFor="line" className="text-sm text-dark-muted cursor-pointer">
                Show signature line
              </label>
            </div>
            {params.line && (
              <>
                <div>
                  <label className="config-label">Line Style</label>
                  <select
                    className="config-select"
                    value={params.linestyle}
                    onChange={(e) => updateParam('linestyle', e.target.value as any)}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
                <div>
                  <label className="config-label">Line Position</label>
                  <select
                    className="config-select"
                    value={params.linepos}
                    onChange={(e) => updateParam('linepos', e.target.value as any)}
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </>
            )}
        </CollapsibleSection>

        {/* Section 7: Animations */}
        <CollapsibleSection title="Animations" defaultOpen={true} storageKey="text-animations">
            <div>
              <label className="config-label">Entrance Animation</label>
              <select
                className="config-select"
                value={params.entrance}
                onChange={(e) => updateParam('entrance', e.target.value as any)}
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slideUp">Slide Up</option>
                <option value="slideDown">Slide Down</option>
                <option value="slideLeft">Slide Left</option>
                <option value="slideRight">Slide Right</option>
                <option value="scale">Scale</option>
                <option value="bounce">Bounce</option>
                <option value="typewriter">Typewriter</option>
              </select>
            </div>
            <div>
              <label className="config-label">Exit Animation</label>
              <select
                className="config-select"
                value={params.exit}
                onChange={(e) => updateParam('exit', e.target.value as any)}
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slideDown">Slide Down</option>
                <option value="slideUp">Slide Up</option>
                <option value="scale">Scale</option>
              </select>
            </div>
            {params.exit !== 'none' && (
              <div>
                <label className="config-label">Exit After (seconds)</label>
                <input
                  className="config-input"
                  type="number"
                  value={params.exitafter}
                  onChange={(e) => updateParam('exitafter', Number(e.target.value))}
                  min="0"
                  max="300"
                />
              </div>
            )}
        </CollapsibleSection>

        {/* Section 8: Loop Mode */}
        <CollapsibleSection title="Loop Mode" defaultOpen={false} storageKey="text-loop">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="loop"
                className="w-4 h-4 rounded"
                checked={params.loop}
                onChange={(e) => updateParam('loop', e.target.checked)}
              />
              <label htmlFor="loop" className="text-sm text-dark-muted cursor-pointer">
                Enable loop mode (appear → hold → disappear → pause → repeat)
              </label>
            </div>
            {params.loop && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="config-label">Hold Visible (s)</label>
                  <input
                    className="config-input"
                    type="number"
                    value={params.hold}
                    onChange={(e) => updateParam('hold', Number(e.target.value))}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="config-label">Pause Hidden (s)</label>
                  <input
                    className="config-input"
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
              <select
                className="config-select"
                value={params.gradient}
                onChange={(e) => updateParam('gradient', e.target.value as any)}
              >
                <option value="indigo">Indigo</option>
                <option value="cyan">Cyan</option>
                <option value="sunset">Sunset</option>
                <option value="emerald">Emerald</option>
                <option value="purple">Purple</option>
                <option value="neon">Neon</option>
                <option value="fire">Fire</option>
                <option value="ocean">Ocean</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="textgradient"
                className="w-4 h-4 rounded"
                checked={params.textgradient}
                onChange={(e) => updateParam('textgradient', e.target.checked)}
              />
              <label htmlFor="textgradient" className="text-sm text-dark-muted cursor-pointer">
                Apply gradient to text
              </label>
            </div>
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
