/**
 * Dashboard Home Page
 * Landing page with overlay cards and quick navigation
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, Palette, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { OVERLAYS } from '../lib/constants'

export const Route = createFileRoute('/')({ component: Dashboard })

function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-16 px-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          OBS Overlay Toolkit
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Professional stream overlays with React, TypeScript, and 189 customizable parameters.
          Configure visually with live preview or copy URLs directly to OBS.
        </p>

        <div className="flex justify-center gap-8 mt-8 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Palette size={16} />
            <span>8 Gradient Presets</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap size={16} />
            <span>Fixed Preview Panel</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles size={16} />
            <span>Collapsible Sections</span>
          </div>
        </div>
      </div>

      {/* Overlay Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-7xl mx-auto">
        {OVERLAYS.map((overlay) => (
          <Link
            key={overlay.name}
            to={overlay.configurePath}
            className="overlay-card group"
            style={{ borderColor: overlay.color + '33' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: overlay.color + '22',
                  borderColor: overlay.color + '44',
                  borderWidth: '1px',
                }}
              >
                <overlay.icon size={24} color={overlay.color} />
              </div>
              <ArrowRight
                size={20}
                className="text-gray-400 transition-transform group-hover:translate-x-1"
              />
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">{overlay.name} Overlay</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{overlay.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {overlay.features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {feature}
                </span>
              ))}
            </div>

            <Button variant="indigo">
              Configure
              <ArrowRight size={16} />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
