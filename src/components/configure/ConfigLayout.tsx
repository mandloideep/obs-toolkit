/**
 * ConfigLayout Component
 * Fixed split-pane layout that keeps preview always visible while scrolling config
 */

import { useState } from 'react'
import { Button } from '../ui/button'

interface ConfigLayoutProps {
  configContent: React.ReactNode
  previewUrl: string
  fullscreenUrl?: string // Optional URL for fullscreen (defaults to previewUrl for backward compatibility)
  overlayTitle: string
  urlGeneratorComponent: React.ReactNode
  onReset?: () => void // Optional callback to reset params to defaults
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
  fullscreenUrl,
  overlayTitle,
  urlGeneratorComponent,
  onReset,
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
        <div className="max-w-3xl space-y-6">
          {/* Header with Reset Button */}
          {onReset && (
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Configuration</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-dark-muted hover:text-dark-text"
              >
                Reset to Defaults
              </Button>
            </div>
          )}

          {configContent}
        </div>
      </div>

      {/* Right Column: Fixed Preview & URL Generator */}
      <div className="lg:w-[520px] lg:sticky lg:top-0 lg:h-screen flex flex-col border-l border-dark-border bg-dark-bg">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preview Section */}
          <div className="config-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Live Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(fullscreenUrl || previewUrl, '_blank')}
                className="text-brand-indigo hover:text-brand-indigo/80"
                title="Open in new window"
              >
                Fullscreen
              </Button>
            </div>

            {/* Preview Controls */}
            <div className="space-y-3 mb-4">
              {/* Size Selector */}
              <div>
                <label className="text-xs text-dark-muted mb-1 block">Preview Size</label>
                <div className="flex gap-2">
                  {(['640x360', '1280x720', '1920x1080'] as PreviewSize[]).map((size) => (
                    <Button
                      key={size}
                      variant={previewSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewSize(size)}
                      className={
                        previewSize === size ? 'bg-brand-indigo border-brand-indigo flex-1' : 'flex-1'
                      }
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Background Selector */}
              <div>
                <label className="text-xs text-dark-muted mb-1 block">Background</label>
                <div className="flex gap-2">
                  {(['black', 'green', 'transparent'] as PreviewBackground[]).map((bg) => (
                    <Button
                      key={bg}
                      variant={previewBg === bg ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewBg(bg)}
                      className={
                        previewBg === bg ? 'bg-brand-indigo border-brand-indigo flex-1 capitalize' : 'flex-1 capitalize'
                      }
                    >
                      {bg}
                    </Button>
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
                className="relative"
              >
                {/* Background layer */}
                <div className={`absolute inset-0 ${bgColors[previewBg]}`} />
                {/* Iframe layer */}
                <iframe
                  src={previewUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  title={`${overlayTitle} Preview`}
                  allow="autoplay"
                  style={{ backgroundColor: 'transparent' }}
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
