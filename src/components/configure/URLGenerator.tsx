/**
 * URL Generator Component
 * Generates OBS-ready URLs from overlay parameters
 * Shows only non-default parameters for clean URLs
 */

import React, { useMemo, useState, useCallback } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

interface URLGeneratorProps {
  overlayPath: string
  params: Record<string, any>
  defaults: Record<string, any>
  baseUrl?: string
  sensitiveParams?: string[] // Parameters to exclude from displayed URL (e.g., ['apikey'])
}

export function URLGenerator({ overlayPath, params, defaults, baseUrl, sensitiveParams = [] }: URLGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [copiedWithKey, setCopiedWithKey] = useState(false)

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
    </div>
  )
}
