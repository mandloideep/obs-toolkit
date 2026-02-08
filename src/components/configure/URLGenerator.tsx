/**
 * URL Generator Component
 * Generates OBS-ready URLs from overlay parameters
 * Shows only non-default parameters for clean URLs
 */

import React, { useMemo, useState, useCallback, useRef } from 'react'
import { Copy, Check, ExternalLink, Download, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import { useConfigExport } from '@/hooks/useConfigExport'

interface URLGeneratorProps {
  overlayPath: string
  params: Record<string, any>
  defaults: Record<string, any>
  baseUrl?: string
  sensitiveParams?: string[] // Parameters to exclude from displayed URL (e.g., ['apikey'])
  overlayType: string // Type of overlay (text, border, counter, etc.)
  onImportConfig: (params: Record<string, any>) => void // Callback when config is imported
}

export function URLGenerator({ overlayPath, params, defaults, baseUrl, sensitiveParams = [], overlayType, onImportConfig }: URLGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [copiedWithKey, setCopiedWithKey] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { exportConfig, importConfig, validateConfig } = useConfigExport()

  // Helper function to generate URL with optional param exclusions
  const generateUrl = useCallback((excludeParams: string[] = []) => {
    const base = baseUrl || window.location.origin
    const searchParams = new URLSearchParams()

    // Only add parameters that differ from defaults
    Object.keys(params).forEach((key) => {
      // Skip if this param should be excluded
      if (excludeParams.includes(key)) {
        return
      }

      const value = params[key]
      const defaultValue = defaults[key]

      // Skip if value matches default
      if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
        return
      }

      // Skip empty strings, empty arrays, null, undefined
      if (value === '' || value === null || value === undefined) {
        return
      }
      if (Array.isArray(value) && value.length === 0) {
        return
      }

      // Convert value to string
      let stringValue: string
      if (Array.isArray(value)) {
        stringValue = value.join(',')
      } else if (typeof value === 'boolean') {
        stringValue = value ? 'true' : 'false'
      } else {
        stringValue = String(value)
      }

      searchParams.set(key, stringValue)
    })

    const queryString = searchParams.toString()
    return `${base}${overlayPath}${queryString ? `?${queryString}` : ''}`
  }, [overlayPath, params, defaults, baseUrl])

  // Display URL: Excludes sensitive params (for security)
  const displayUrl = useMemo(() => generateUrl(sensitiveParams), [generateUrl, sensitiveParams])

  // Full URL: Includes all params (for OBS usage)
  const fullUrl = useMemo(() => generateUrl([]), [generateUrl])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyFullUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedWithKey(true)
      setTimeout(() => setCopiedWithKey(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openPreview = () => {
    window.open(displayUrl, '_blank', 'width=1920,height=1080')
  }

  const handleExport = () => {
    // Create params without sensitive data for export
    const exportParams = { ...params }
    sensitiveParams.forEach(key => {
      delete exportParams[key]
    })
    exportConfig(exportParams, overlayType)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError(null)
    setImportSuccess(false)

    try {
      const json = await importConfig(file)
      const validation = validateConfig(json, defaults, overlayType)

      if (validation.valid && validation.params) {
        onImportConfig(validation.params)
        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 3000)
      } else {
        setImportError(validation.error || 'Invalid configuration file')
        setTimeout(() => setImportError(null), 5000)
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import configuration')
      setTimeout(() => setImportError(null), 5000)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="config-section">
      <label className="config-label">OBS Browser Source URL</label>
      <div className="bg-black/30 border border-dark-border rounded-lg p-3 text-sm text-indigo-200 break-all font-mono mb-4">
        {displayUrl}
      </div>

      <div className="flex gap-3">
        {/* Copy URL (without sensitive params) */}
        <Button
          variant={copied ? 'default' : 'indigo'}
          onClick={copyToClipboard}
          className={copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : ''}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy URL'}
        </Button>

        {/* Copy with API Key (includes sensitive params) - only show if there are sensitive params */}
        {sensitiveParams.length > 0 && (
          <Button
            variant={copiedWithKey ? 'default' : 'indigo'}
            onClick={copyFullUrlToClipboard}
            className={copiedWithKey ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : ''}
          >
            {copiedWithKey ? <Check size={16} /> : <Copy size={16} />}
            {copiedWithKey ? 'Copied with Key!' : 'Copy with API Key'}
          </Button>
        )}

        {/* Preview (without sensitive params) */}
        <Button variant="indigo" onClick={openPreview}>
          <ExternalLink size={16} />
          Preview
        </Button>
      </div>

      {/* Helper text */}
      {sensitiveParams.length > 0 && (
        <p className="text-xs text-dark-muted mt-3 leading-relaxed">
          💡 Use <strong>Copy with API Key</strong> for OBS. Regular URL is for sharing configs.
        </p>
      )}

      {/* Divider */}
      <div className="my-4 border-t border-dark-border" />

      {/* Import/Export Section */}
      <label className="config-label">Configuration Backup</label>
      <div className="flex gap-3 mb-3">
        <Button variant="outline" onClick={handleExport}>
          <Download size={16} />
          Export Config
        </Button>
        <Button variant="outline" onClick={handleImportClick}>
          <Upload size={16} />
          Import Config
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

      {/* Import feedback messages */}
      {importSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg p-3 text-sm">
          ✓ Configuration imported successfully!
        </div>
      )}
      {importError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm">
          ✗ {importError}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-dark-muted mt-3 leading-relaxed">
        💾 Export saves your current configuration as a JSON file. Import loads a previously saved configuration.
        {sensitiveParams.length > 0 && ' Sensitive data (API keys) are excluded from exports.'}
      </p>
    </div>
  )
}
