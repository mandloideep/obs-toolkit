/**
 * ConfigLayout Component
 * Fixed split-pane layout that keeps preview always visible while scrolling config
 */

import { useState } from 'react'

interface ConfigLayoutProps {
  configContent: React.ReactNode
  previewUrl: string
  overlayTitle: string
  urlGeneratorComponent: React.ReactNode
}

type PreviewSize = '640x360' | '1280x720' | '1920x1080'
type PreviewBackground = 'black' | 'green' | 'transparent'

const PREVIEW_SIZES: Record<PreviewSize, { width: number; height: number }> = {
  '640x360': { width: 640, height: 360 },
  '1280x720': { width: 1280, height: 720 },
  '1920x1080': { width: 1920, height: 1080 },
}

export function ConfigLayout({
  configContent,
  previewUrl,
  overlayTitle,
  urlGeneratorComponent,
}: ConfigLayoutProps) {
  const [previewSize, setPreviewSize] = useState<PreviewSize>('1280x720')
  const [previewBg, setPreviewBg] = useState<PreviewBackground>('black')

  const bgColors: Record<PreviewBackground, string> = {
    black: 'bg-black',
    green: 'bg-green-500',
    transparent: 'bg-[#1a1a1a]',
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left Column: Scrollable Configuration */}
      <div className="flex-1 overflow-y-auto p-8 lg:h-screen">
        <div className="max-w-3xl space-y-6">{configContent}</div>
      </div>

      {/* Right Column: Fixed Preview & URL Generator */}
      <div className="lg:w-[520px] lg:sticky lg:top-0 lg:h-screen flex flex-col border-l border-dark-border bg-dark-bg">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preview Section */}
          <div className="config-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Live Preview</h3>
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="text-sm text-brand-indigo hover:text-brand-indigo/80 transition-colors"
                title="Open in new window"
              >
                Fullscreen
              </button>
            </div>

            {/* Preview Controls */}
            <div className="space-y-3 mb-4">
              {/* Size Selector */}
              <div>
                <label className="text-xs text-dark-muted mb-1 block">Preview Size</label>
                <div className="flex gap-2">
                  {(['640x360', '1280x720', '1920x1080'] as PreviewSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPreviewSize(size)}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        previewSize === size
                          ? 'bg-brand-indigo border-brand-indigo text-white'
                          : 'border-dark-border text-dark-muted hover:border-dark-muted'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Selector */}
              <div>
                <label className="text-xs text-dark-muted mb-1 block">Background</label>
                <div className="flex gap-2">
                  {(['black', 'green', 'transparent'] as PreviewBackground[]).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setPreviewBg(bg)}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                        previewBg === bg
                          ? 'bg-brand-indigo border-brand-indigo text-white'
                          : 'border-dark-border text-dark-muted hover:border-dark-muted'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Container */}
            <div className="relative w-full overflow-hidden rounded-xl border border-dark-border">
              {/* Aspect ratio container based on selected size */}
              <div
                style={{
                  paddingBottom: `${(PREVIEW_SIZES[previewSize].height / PREVIEW_SIZES[previewSize].width) * 100}%`,
                }}
                className={`relative ${bgColors[previewBg]}`}
              >
                <iframe
                  src={previewUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  title={`${overlayTitle} Preview`}
                  allow="autoplay"
                />
              </div>
            </div>

            {/* Size Info */}
            <p className="text-xs text-dark-muted mt-2 text-center">
              {PREVIEW_SIZES[previewSize].width} × {PREVIEW_SIZES[previewSize].height}
            </p>
          </div>

          {/* URL Generator Section */}
          {urlGeneratorComponent}
        </div>
      </div>
    </div>
  )
}
