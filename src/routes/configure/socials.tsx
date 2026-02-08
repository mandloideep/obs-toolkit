/**
 * Socials Overlay Configurator
 * Visual configuration UI for social media overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { SOCIALS_DEFAULTS } from '../../types/socials.types'
import type { SocialsOverlayParams } from '../../types/socials.types'

export const Route = createFileRoute('/configure/socials')({
  component: SocialsConfigurator,
})

function SocialsConfigurator() {
  const [params, setParams] = useState<SocialsOverlayParams>(SOCIALS_DEFAULTS)

  const updateParam = <K extends keyof SocialsOverlayParams>(
    key: K,
    value: SocialsOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const previewUrl = `${window.location.origin}/overlays/socials?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== SOCIALS_DEFAULTS[key as keyof SocialsOverlayParams]) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()}`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto">
      {/* Configuration Form - Left Column */}
      <div className="space-y-6">
        {/* Section 1: Platforms */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Platforms</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Show Platforms (comma-separated)</label>
              <input
                className="config-input"
                type="text"
                value={params.show}
                onChange={(e) => updateParam('show', e.target.value)}
                placeholder="e.g., github,twitter,youtube"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: github, twitter, linkedin, youtube, instagram, twitch, kick, discord, website
              </p>
            </div>
            <div>
              <label className="config-label">Custom Handles (optional)</label>
              <input
                className="config-input"
                type="text"
                value={params.handles}
                onChange={(e) => updateParam('handles', e.target.value)}
                placeholder="e.g., github:user,youtube:@channel"
              />
              <p className="text-xs text-gray-500 mt-1">
                Override default handles: platform:handle,platform:handle
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Layout */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Layout</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Layout Direction</label>
              <select
                className="config-select"
                value={params.layout}
                onChange={(e) => updateParam('layout', e.target.value as any)}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            <div>
              <label className="config-label">Size Preset</label>
              <select
                className="config-select"
                value={params.size}
                onChange={(e) => updateParam('size', e.target.value as any)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showtext"
                className="w-4 h-4 rounded"
                checked={params.showtext}
                onChange={(e) => updateParam('showtext', e.target.checked)}
              />
              <label htmlFor="showtext" className="text-sm text-dark-muted cursor-pointer">
                Show platform handles
              </label>
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
                Show background panels
              </label>
            </div>
            <div>
              <label className="config-label">Gap Between Items (px)</label>
              <input
                className="config-input"
                type="number"
                value={params.gap}
                onChange={(e) => updateParam('gap', Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Icon Styling */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Icon Styling</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Icon Color Mode</label>
              <select
                className="config-select"
                value={params.iconcolor}
                onChange={(e) => updateParam('iconcolor', e.target.value as any)}
              >
                <option value="brand">Brand Colors (each platform's color)</option>
                <option value="gradient">Gradient</option>
                <option value="white">White</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Entrance Animation */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Entrance Animation</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Animation Type</label>
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
                <option value="stagger">Stagger (one by one)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="config-label">Speed (seconds)</label>
                <input
                  className="config-input"
                  type="number"
                  value={params.speed}
                  onChange={(e) => updateParam('speed', Number(e.target.value))}
                  min="0.1"
                  max="5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="config-label">Delay (seconds)</label>
                <input
                  className="config-input"
                  type="number"
                  value={params.delay}
                  onChange={(e) => updateParam('delay', Number(e.target.value))}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Exit Animation */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Exit Animation</h2>
          <div className="space-y-5">
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
                Enable loop mode (all appear → hold → all disappear → pause → repeat)
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

        {/* Section 7: One-by-One Mode */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">One-by-One Mode</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="onebyone"
                className="w-4 h-4 rounded"
                checked={params.onebyone}
                onChange={(e) => updateParam('onebyone', e.target.checked)}
              />
              <label htmlFor="onebyone" className="text-sm text-dark-muted cursor-pointer">
                Show one platform at a time (cycle through all platforms)
              </label>
            </div>
            {params.onebyone && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="config-label">Show Each (s)</label>
                  <input
                    className="config-input"
                    type="number"
                    value={params.each}
                    onChange={(e) => updateParam('each', Number(e.target.value))}
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="config-label">Pause Between (s)</label>
                  <input
                    className="config-input"
                    type="number"
                    value={params.eachpause}
                    onChange={(e) => updateParam('eachpause', Number(e.target.value))}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 8: Theme & Colors */}
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
            title="Socials Overlay Preview"
          />
        </div>

        <URLGenerator
          overlayPath="/overlays/socials"
          params={params}
          defaults={SOCIALS_DEFAULTS}
        />
      </div>
    </div>
  )
}
