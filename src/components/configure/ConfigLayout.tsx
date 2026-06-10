/**
 * ConfigLayout Component
 * Fixed split-pane layout that keeps preview always visible while scrolling config
 */

import { useState } from 'react'
import { Button } from '../ui/button'
import { Undo2, Redo2 } from 'lucide-react'
import { CompanionLayerInput, type CompanionLayerInputState } from './CompanionLayerInput'
import { useCompanionOverlays, type CompanionKind } from '../../hooks/useCompanionOverlays'

interface UndoRedoControls {
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

interface ConfigLayoutProps {
  configContent: React.ReactNode
  previewUrl: string
  fullscreenUrl?: string // Optional URL for fullscreen (defaults to previewUrl for backward compatibility)
  overlayTitle: string
  urlGeneratorComponent: React.ReactNode
  undoRedoControls?: UndoRedoControls // Optional undo/redo controls
  /**
   * The kind of overlay currently being configured. When provided, the layout
   * renders companion overlay controls so the preview can be stacked against
   * the last-saved mesh/border/text overlays.
   */
  companionKind?: CompanionKind
}

type PreviewSize = '640x360' | '1280x720' | '1920x1080'
type PreviewBackground = 'black' | 'green' | 'transparent'

const PREVIEW_SIZES: Record<PreviewSize, { width: number; height: number }> = {
  '640x360': { width: 640, height: 360 },
  '1280x720': { width: 1280, height: 720 },
  '1920x1080': { width: 1920, height: 1080 },
}

const DEFAULT_COMPANION_STATE: CompanionLayerInputState = {
  mesh: { enabled: false, override: '' },
  border: { enabled: false, override: '' },
  text: { enabled: false, override: '' },
}

// Render order behind/above the current preview iframe.
const LAYER_ORDER: CompanionKind[] = ['mesh', 'border', 'text']

export function ConfigLayout({
  configContent,
  previewUrl,
  fullscreenUrl,
  overlayTitle,
  urlGeneratorComponent,
  undoRedoControls,
  companionKind,
}: ConfigLayoutProps) {
  const [previewSize, setPreviewSize] = useState<PreviewSize>('1280x720')
  const [previewBg, setPreviewBg] = useState<PreviewBackground>('black')
  const [companionState, setCompanionState] =
    useState<CompanionLayerInputState>(DEFAULT_COMPANION_STATE)
  const { urls: savedCompanionUrls } = useCompanionOverlays()

  // Resolve which companion layers to actually render: enabled + has effective URL +
  // not the current kind (you never overlay yourself with yourself).
  const activeCompanionLayers = LAYER_ORDER.filter((kind) => {
    if (!companionKind || kind === companionKind) return false
    const layer = companionState[kind]
    if (!layer.enabled) return false
    return Boolean(layer.override || savedCompanionUrls[kind])
  }).map((kind) => ({
    kind,
    url: companionState[kind].override || savedCompanionUrls[kind],
  }))

  // Composite z-order — mesh always behind, current iframe in middle, others on top.
  const currentZIndex = LAYER_ORDER.indexOf(companionKind ?? 'border') + 1

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
          {/* Undo/Redo Header */}
          {undoRedoControls && (
            <div className="flex items-center gap-2 pb-4 border-b border-dark-border">
              <Button
                variant="outline"
                size="sm"
                onClick={undoRedoControls.undo}
                disabled={!undoRedoControls.canUndo}
                title="Undo (Cmd/Ctrl+Z)"
                className="gap-2"
              >
                <Undo2 size={16} />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={undoRedoControls.redo}
                disabled={!undoRedoControls.canRedo}
                title="Redo (Cmd/Ctrl+Shift+Z)"
                className="gap-2"
              >
                <Redo2 size={16} />
                Redo
              </Button>
              <span className="text-xs text-dark-muted ml-2">
                {undoRedoControls.canUndo ? 'Cmd/Ctrl+Z to undo' : 'No undo history'}
              </span>
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
                        previewSize === size
                          ? 'bg-brand-indigo border-brand-indigo flex-1'
                          : 'flex-1'
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
                        previewBg === bg
                          ? 'bg-brand-indigo border-brand-indigo flex-1 capitalize'
                          : 'flex-1 capitalize'
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

                {/* Companion layers behind the current preview (mesh, sometimes border) */}
                {activeCompanionLayers
                  .filter((l) => LAYER_ORDER.indexOf(l.kind) < currentZIndex - 1)
                  .map((layer) => (
                    <iframe
                      key={`under-${layer.kind}`}
                      src={layer.url}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      title={`${layer.kind} layer`}
                      allow="autoplay"
                      style={{
                        backgroundColor: 'transparent',
                        zIndex: LAYER_ORDER.indexOf(layer.kind) + 1,
                      }}
                    />
                  ))}

                {/* The active preview iframe */}
                <iframe
                  src={previewUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  title={`${overlayTitle} Preview`}
                  allow="autoplay"
                  style={{
                    backgroundColor: 'transparent',
                    zIndex: currentZIndex,
                  }}
                />

                {/* Companion layers above the current preview */}
                {activeCompanionLayers
                  .filter((l) => LAYER_ORDER.indexOf(l.kind) >= currentZIndex - 1)
                  .map((layer) => (
                    <iframe
                      key={`over-${layer.kind}`}
                      src={layer.url}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      title={`${layer.kind} layer`}
                      allow="autoplay"
                      style={{
                        backgroundColor: 'transparent',
                        zIndex: LAYER_ORDER.indexOf(layer.kind) + 1,
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* Size Info */}
            <p className="text-xs text-dark-muted mt-2 text-center">
              {PREVIEW_SIZES[previewSize].width} × {PREVIEW_SIZES[previewSize].height}
            </p>
          </div>

          {/* Companion Layer controls */}
          {companionKind && (
            <CompanionLayerInput
              currentKind={companionKind}
              savedUrls={savedCompanionUrls}
              state={companionState}
              onChange={setCompanionState}
            />
          )}

          {/* URL Generator Section */}
          {urlGeneratorComponent}
        </div>
      </div>
    </div>
  )
}
