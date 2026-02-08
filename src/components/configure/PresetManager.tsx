/**
 * PresetManager Component
 * UI for saving, loading, and managing configuration presets
 */

import { useState, useRef } from 'react'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Save, Upload, Download, Trash2, Edit2 } from 'lucide-react'

interface PresetManagerProps<T> {
  presets: Array<{ name: string; params: T; createdAt: number; updatedAt: number }>
  currentPresetName: string | null
  currentParams: T
  onLoadPreset: (name: string) => void
  onSavePreset: (name: string, params: T) => void
  onDeletePreset: (name: string) => void
  onRenamePreset: (oldName: string, newName: string) => boolean
  onExportPreset: (name: string) => void
  onImportPreset: (file: File) => Promise<void>
}

export function PresetManager<T extends Record<string, unknown>>({
  presets,
  currentPresetName,
  currentParams,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  onRenamePreset,
  onExportPreset,
  onImportPreset,
}: PresetManagerProps<T>) {
  const [selectedPreset, setSelectedPreset] = useState<string>(currentPresetName || '')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [renameTarget, setRenameTarget] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLoadPreset = (name: string) => {
    setSelectedPreset(name)
    onLoadPreset(name)
  }

  const handleSave = () => {
    if (!newPresetName.trim()) {
      setError('Please enter a preset name')
      return
    }

    if (presets.some((p) => p.name === newPresetName.trim())) {
      // Overwrite existing
      if (!confirm(`Preset "${newPresetName.trim()}" already exists. Overwrite it?`)) {
        return
      }
    }

    onSavePreset(newPresetName.trim(), currentParams)
    setSelectedPreset(newPresetName.trim())
    setNewPresetName('')
    setShowSaveDialog(false)
    setSuccess('Preset saved successfully')
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleRename = () => {
    if (!newPresetName.trim()) {
      setError('Please enter a new name')
      return
    }

    const success = onRenamePreset(renameTarget, newPresetName.trim())
    if (success) {
      setSelectedPreset(newPresetName.trim())
      setNewPresetName('')
      setRenameTarget('')
      setShowRenameDialog(false)
      setSuccess('Preset renamed successfully')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError('A preset with that name already exists')
    }
  }

  const handleDelete = () => {
    if (!selectedPreset) return

    if (confirm(`Delete preset "${selectedPreset}"? This cannot be undone.`)) {
      onDeletePreset(selectedPreset)
      setSelectedPreset('')
      setSuccess('Preset deleted')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleExport = () => {
    if (!selectedPreset) return
    onExportPreset(selectedPreset)
    setSuccess('Preset exported')
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await onImportPreset(file)
      setSuccess('Preset imported successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to import preset')
      setTimeout(() => setError(null), 5000)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="config-section">
      <h2 className="text-2xl font-semibold mb-6">Presets</h2>

      {/* Feedback messages */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-3 text-sm mb-4">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm mb-4">
          ✗ {error}
        </div>
      )}

      {/* Preset Selector */}
      <div className="space-y-4">
        <div>
          <label className="config-label">Load Preset</label>
          <Select value={selectedPreset} onValueChange={handleLoadPreset}>
            <SelectTrigger className="bg-black/30">
              <SelectValue placeholder="Select a preset..." />
            </SelectTrigger>
            <SelectContent>
              {presets.length === 0 && (
                <div className="p-3 text-sm text-dark-muted">No presets saved yet</div>
              )}
              {presets.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Save New/Update */}
          <Button
            variant="indigo"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="gap-2"
          >
            <Save size={16} />
            Save As...
          </Button>

          {/* Rename */}
          {selectedPreset && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRenameTarget(selectedPreset)
                setNewPresetName(selectedPreset)
                setShowRenameDialog(true)
              }}
              className="gap-2"
            >
              <Edit2 size={16} />
              Rename
            </Button>
          )}

          {/* Delete */}
          {selectedPreset && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="gap-2 text-red-400 hover:text-red-300 border-red-500/30"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          )}

          {/* Export */}
          {selectedPreset && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download size={16} />
              Export
            </Button>
          )}

          {/* Import */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="gap-2"
          >
            <Upload size={16} />
            Import
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3">
            <label className="config-label">Preset Name</label>
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="config-input w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') setShowSaveDialog(false)
              }}
            />
            <div className="flex gap-2">
              <Button variant="indigo" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Rename Dialog */}
        {showRenameDialog && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3">
            <label className="config-label">New Name</label>
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Enter new name..."
              className="config-input w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') setShowRenameDialog(false)
              }}
            />
            <div className="flex gap-2">
              <Button variant="indigo" size="sm" onClick={handleRename}>
                Rename
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-dark-muted">
          Presets save all your current configuration settings for quick reuse.
        </p>
      </div>
    </div>
  )
}
