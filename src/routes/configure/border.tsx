/**
 * Border Overlay Configurator
 * Visual configuration UI for border overlay parameters
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ConfigLayout } from '../../components/configure/ConfigLayout'
import { URLGenerator } from '../../components/configure/URLGenerator'
import { BORDER_DEFAULTS } from '../../types/border.types'
import type { BorderOverlayParams } from '../../types/border.types'

export const Route = createFileRoute('/configure/border')({
  component: BorderConfigurator,
})

function BorderConfigurator() {
  const [params, setParams] = useState<BorderOverlayParams>(BORDER_DEFAULTS)

  const updateParam = <K extends keyof BorderOverlayParams>(
    key: K,
    value: BorderOverlayParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  // Generate preview URL
  const previewUrl = `${window.location.origin}/overlays/border?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== BORDER_DEFAULTS[key as keyof BorderOverlayParams]) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()}`

  const configSections = (
    <>
      <div className="config-section">
          <h2 className="text-2xl font-semibold mb-6">Border Configuration</h2>

          <div className="space-y-5">
            <div>
              <label className="config-label">Shape</label>
              <select
                className="config-select"
                value={params.shape}
                onChange={(e) => updateParam('shape', e.target.value as any)}
              >
                <option value="rect">Rectangle</option>
                <option value="circle">Circle</option>
              </select>
            </div>

            <div>
              <label className="config-label">Style</label>
              <select
                className="config-select"
                value={params.style}
                onChange={(e) => updateParam('style', e.target.value as any)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="neon">Neon</option>
              </select>
            </div>

            <div>
              <label className="config-label">Animation</label>
              <select
                className="config-select"
                value={params.animation}
                onChange={(e) => updateParam('animation', e.target.value as any)}
              >
                <option value="none">None</option>
                <option value="dash">Dash</option>
                <option value="rotate">Rotate</option>
                <option value="pulse">Pulse</option>
                <option value="breathe">Breathe</option>
              </select>
            </div>

            <div>
              <label className="config-label">Gradient</label>
              <select
                className="config-select"
                value={params.gradient}
                onChange={(e) => updateParam('gradient', e.target.value as any)}
              >
                <option value="indigo">Indigo</option>
                <option value="cyan">Cyan</option>
                <option value="sunset">Sunset</option>
                <option value="emerald">Emerald</option>
                <option value="neon">Neon</option>
                <option value="fire">Fire</option>
                <option value="ocean">Ocean</option>
                <option value="purple">Purple</option>
              </select>
            </div>

            <div>
              <label className="config-label">Thickness (px)</label>
              <input
                className="config-input"
                type="number"
                value={params.thickness}
                onChange={(e) => updateParam('thickness', Number(e.target.value))}
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="config-label">Speed</label>
              <input
                className="config-input"
                type="number"
                value={params.speed}
                onChange={(e) => updateParam('speed', Number(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>

            <div>
              <label className="config-label">Corner Radius (0-50)</label>
              <input
                className="config-input"
                type="number"
                value={params.r}
                onChange={(e) => updateParam('r', Number(e.target.value))}
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>
    </>
  )

  return (
    <ConfigLayout
      configContent={configSections}
      previewUrl={previewUrl}
      overlayTitle="Border Overlay"
      urlGeneratorComponent={
        <URLGenerator
          overlayPath="/overlays/border"
          params={params}
          defaults={BORDER_DEFAULTS}
        />
      }
    />
  )
}
