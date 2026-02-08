/**
 * Counter Overlay Configurator
 * Visual configuration UI for counter overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { COUNTER_DEFAULTS } from '../../types/counter.types'
import type { CounterOverlayParams } from '../../types/counter.types'

export const Route = createFileRoute('/configure/counter')({
  component: CounterConfigurator,
})

function CounterConfigurator() {
  const [params, setParams] = useState<CounterOverlayParams>(COUNTER_DEFAULTS)

  const updateParam = <K extends keyof CounterOverlayParams>(
    key: K,
    value: CounterOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const previewUrl = `${window.location.origin}/overlays/counter?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== COUNTER_DEFAULTS[key as keyof CounterOverlayParams]) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()}`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto">
      {/* Configuration Form - Left Column */}
      <div className="space-y-6">
        {/* Section 1: Display */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Display</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Value</label>
              <input
                className="config-input"
                type="number"
                value={params.value}
                onChange={(e) => updateParam('value', Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <label className="config-label">Label</label>
              <input
                className="config-input"
                type="text"
                value={params.label}
                onChange={(e) => updateParam('label', e.target.value)}
                placeholder="e.g., Subscribers"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="config-label">Prefix</label>
                <input
                  className="config-input"
                  type="text"
                  value={params.prefix}
                  onChange={(e) => updateParam('prefix', e.target.value)}
                  placeholder="e.g., $"
                />
              </div>
              <div>
                <label className="config-label">Suffix</label>
                <input
                  className="config-input"
                  type="text"
                  value={params.suffix}
                  onChange={(e) => updateParam('suffix', e.target.value)}
                  placeholder="e.g., K"
                />
              </div>
            </div>
            <div>
              <label className="config-label">Icon</label>
              <select
                className="config-select"
                value={params.icon}
                onChange={(e) => updateParam('icon', e.target.value as any)}
              >
                <option value="none">None</option>
                <option value="star">Star</option>
                <option value="heart">Heart</option>
                <option value="fire">Fire</option>
                <option value="trophy">Trophy</option>
                <option value="users">Users</option>
                <option value="eye">Eye</option>
                <option value="trending">Trending</option>
                <option value="zap">Zap</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="config-label">Number Size (px)</label>
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
                <label className="config-label">Label Size (px)</label>
                <input
                  className="config-input"
                  type="number"
                  value={params.labelsize}
                  onChange={(e) => updateParam('labelsize', Number(e.target.value))}
                  min="8"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Layout */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Layout</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Layout Style</label>
              <select
                className="config-select"
                value={params.layout}
                onChange={(e) => updateParam('layout', e.target.value as any)}
              >
                <option value="stack">Stack (vertical)</option>
                <option value="inline">Inline (horizontal)</option>
              </select>
            </div>
            <div>
              <label className="config-label">Alignment</label>
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

        {/* Section 3: Number Formatting */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Number Formatting</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="separator"
                className="w-4 h-4 rounded"
                checked={params.separator}
                onChange={(e) => updateParam('separator', e.target.checked)}
              />
              <label htmlFor="separator" className="text-sm text-dark-muted cursor-pointer">
                Use thousands separator (e.g., 1,000)
              </label>
            </div>
            <div>
              <label className="config-label">Decimal Places</label>
              <input
                className="config-input"
                type="number"
                value={params.decimals}
                onChange={(e) => updateParam('decimals', Number(e.target.value))}
                min="0"
                max="3"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="abbreviate"
                className="w-4 h-4 rounded"
                checked={params.abbreviate}
                onChange={(e) => updateParam('abbreviate', e.target.checked)}
              />
              <label htmlFor="abbreviate" className="text-sm text-dark-muted cursor-pointer">
                Abbreviate large numbers (1K, 1M, 1B)
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Animation */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Animation</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="animate"
                className="w-4 h-4 rounded"
                checked={params.animate}
                onChange={(e) => updateParam('animate', e.target.checked)}
              />
              <label htmlFor="animate" className="text-sm text-dark-muted cursor-pointer">
                Animate count-up when value changes
              </label>
            </div>
            {params.animate && (
              <div>
                <label className="config-label">Animation Duration (seconds)</label>
                <input
                  className="config-input"
                  type="number"
                  value={params.duration}
                  onChange={(e) => updateParam('duration', Number(e.target.value))}
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trend"
                className="w-4 h-4 rounded"
                checked={params.trend}
                onChange={(e) => updateParam('trend', e.target.checked)}
              />
              <label htmlFor="trend" className="text-sm text-dark-muted cursor-pointer">
                Show trend arrow (up/down)
              </label>
            </div>
          </div>
        </div>

        {/* Section 5: API Integration */}
        <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">API Integration</h2>
          <div className="space-y-5">
            <div>
              <label className="config-label">Service</label>
              <select
                className="config-select"
                value={params.service}
                onChange={(e) => updateParam('service', e.target.value as any)}
              >
                <option value="custom">Custom (manual value)</option>
                <option value="youtube">YouTube</option>
                <option value="twitch">Twitch</option>
                <option value="github">GitHub</option>
                <option value="poll">Custom API (polling)</option>
              </select>
            </div>
            {params.service !== 'custom' && (
              <>
                <div>
                  <label className="config-label">User ID / Username</label>
                  <input
                    className="config-input"
                    type="text"
                    value={params.userid}
                    onChange={(e) => updateParam('userid', e.target.value)}
                    placeholder="Enter username or channel ID"
                  />
                </div>
                {params.service === 'poll' && (
                  <div>
                    <label className="config-label">Custom API URL</label>
                    <input
                      className="config-input"
                      type="text"
                      value={params.poll}
                      onChange={(e) => updateParam('poll', e.target.value)}
                      placeholder="https://api.example.com/stats"
                    />
                  </div>
                )}
                <div>
                  <label className="config-label">Poll Rate (seconds)</label>
                  <input
                    className="config-input"
                    type="number"
                    value={params.pollrate}
                    onChange={(e) => updateParam('pollrate', Number(e.target.value))}
                    min="5"
                    max="300"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 6: Theme & Colors */}
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
            title="Counter Overlay Preview"
          />
        </div>

        <URLGenerator
          overlayPath="/overlays/counter"
          params={params}
          defaults={COUNTER_DEFAULTS}
        />
      </div>
    </div>
  )
}
