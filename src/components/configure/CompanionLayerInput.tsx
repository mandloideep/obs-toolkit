/**
 * CompanionLayerInput
 * Lets the user compose the preview against last-used companion overlays.
 * Auto-fills from localStorage (`companion.mesh|border|text`), each field
 * can be overridden per session.
 */

import { useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { CollapsibleSection } from './form/CollapsibleSection'
import type { CompanionKind } from '../../hooks/useCompanionOverlays'

export interface CompanionLayerState {
  /** Whether this layer is rendered. */
  enabled: boolean
  /** Optional URL override (empty = use the saved companion URL). */
  override: string
}

export type CompanionLayerInputState = Record<CompanionKind, CompanionLayerState>

export const DEFAULT_COMPANION_STATE: CompanionLayerInputState = {
  mesh: { enabled: false, override: '' },
  border: { enabled: false, override: '' },
  text: { enabled: false, override: '' },
}

interface CompanionLayerInputProps {
  /** The kind of overlay the user is currently configuring (its field is hidden). */
  currentKind: CompanionKind
  /** URLs saved to localStorage by other configurators. */
  savedUrls: Record<CompanionKind, string>
  /** Current per-kind enabled/override state. */
  state: CompanionLayerInputState
  onChange: (state: CompanionLayerInputState) => void
}

const KIND_LABEL: Record<CompanionKind, string> = {
  mesh: 'Mesh background',
  border: 'Border',
  text: 'Text',
}

export function CompanionLayerInput({
  currentKind,
  savedUrls,
  state,
  onChange,
}: CompanionLayerInputProps) {
  const kinds = useMemo<CompanionKind[]>(
    () => (['mesh', 'border', 'text'] as CompanionKind[]).filter((k) => k !== currentKind),
    [currentKind]
  )

  const update = useCallback(
    (kind: CompanionKind, partial: Partial<CompanionLayerState>) => {
      onChange({ ...state, [kind]: { ...state[kind], ...partial } })
    },
    [state, onChange]
  )

  return (
    <CollapsibleSection title="Preview Layers" defaultOpen={false} storageKey="companion-layers">
      <p className="text-xs text-muted-foreground -mt-1">
        Stack your current preview against the last-saved mesh, border, or text overlay so you can
        see how they compose in OBS. Override URLs per session if needed.
      </p>

      {kinds.map((kind) => {
        const layer = state[kind]
        const saved = savedUrls[kind]
        const effective = layer.override || saved

        return (
          <div key={kind} className="space-y-2 rounded-md border border-dark-border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{KIND_LABEL[kind]}</Label>
              <Switch
                checked={layer.enabled}
                onCheckedChange={(checked) => update(kind, { enabled: checked })}
                aria-label={`Render ${KIND_LABEL[kind]} layer`}
                disabled={!effective && !layer.enabled}
              />
            </div>

            {!saved && !layer.override && (
              <p className="text-xs text-muted-foreground">
                No saved URL yet. Open the {kind} configurator once or paste a URL below.
              </p>
            )}

            <div className="flex items-center gap-2">
              <Input
                value={layer.override}
                onChange={(e) => update(kind, { override: e.target.value })}
                placeholder={saved || `Paste a ${kind} overlay URL`}
                className="text-xs font-mono flex-1"
                aria-label={`${KIND_LABEL[kind]} URL override`}
              />
              {layer.override && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update(kind, { override: '' })}
                  title="Clear override, use saved URL"
                >
                  Use saved
                </Button>
              )}
            </div>

            {layer.enabled && effective && (
              <p className="text-[10px] text-dark-muted truncate" title={effective}>
                Layer: {effective}
              </p>
            )}
          </div>
        )
      })}
    </CollapsibleSection>
  )
}
