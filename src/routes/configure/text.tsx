/**
 * Text Overlay Configurator
 * Visual configuration UI for text overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { URLGenerator } from '../../components/configure/URLGenerator'
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto">
      {/* Configuration Form - Left Column */}
      <div className="space-y-6">
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
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Content</h2>
          <div className="space-y-5">
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
          </div>
        </div>

        {/* Section 3: Layout */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Layout</h2>
          <div className="space-y-5">
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
          </div>
        </div>

        {/* Section 4: Signature Line */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Signature Line</h2>
          <div className="space-y-5">
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
          </div>
        </div>

        {/* Section 5: Animations */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Animations</h2>
          <div className="space-y-5">
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
          </div>
        </div>

        {/* Section 6: Loop Mode */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Loop Mode</h2>
          <div className="space-y-5">
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
          </div>
        </div>

        {/* Section 7: Theme & Colors */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Theme & Colors</h2>
          <div className="space-y-5">
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
          </div>
        </div>
      </div>

      {/* Preview & URL Generator - Right Column */}
      <div className="lg:sticky lg:top-8 space-y-6">
        <div className="config-section">
          <h3 className="text-xl font-semibold mb-6">Live Preview</h3>
          <iframe
            src={previewUrl}
            className="w-full h-96 border border-dark-border rounded-xl bg-black"
            title="Text Overlay Preview"
          />
        </div>

        <URLGenerator
          overlayPath="/overlays/text"
          params={params}
          defaults={TEXT_DEFAULTS}
        />
      </div>
    </div>
  )
}
