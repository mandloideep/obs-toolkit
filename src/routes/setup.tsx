/**
 * Onboarding Setup Wizard
 * Multi-step setup for global brand settings (theme, gradient, font, colormode).
 * Settings saved to localStorage and applied as defaults across all configurators.
 */

import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Check, Moon, Sun } from 'lucide-react'
import { Button } from '../components/ui/button'
import { cn } from '@/lib/utils'
import { GradientGrid } from '../components/configure/form/GradientGrid'
import { FontSelect } from '../components/configure/form/FontSelect'
import { FormSelectInput } from '../components/configure/form/FormSelectInput'
import { useGlobalSettings } from '../hooks/useGlobalSettings'
import { useGradient, useTheme } from '../hooks/useBrand'
import { GRADIENT_TYPE_OPTIONS, COLOR_MODE_OPTIONS } from '../lib/constants'
import type { GradientName, GradientType, ColorMode, ThemeName } from '../types/brand.types'

export const Route = createFileRoute('/setup')({ component: SetupWizard })

const STEPS = ['Theme', 'Colors', 'Typography', 'Preview'] as const
type StepName = (typeof STEPS)[number]

function SetupWizard() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useGlobalSettings()

  // Local wizard state (committed on final save)
  const [step, setStep] = useState(0)
  const [theme, setTheme] = useState<ThemeName>(settings.theme)
  const [gradient, setGradient] = useState<GradientName>(settings.gradient)
  const [gradienttype, setGradienttype] = useState<GradientType>(settings.gradienttype)
  const [colormode, setColormode] = useState<ColorMode>(settings.colormode)
  const [font, setFont] = useState<string>(settings.font)

  const currentStep = STEPS[step]
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      // Save and redirect
      updateSettings({
        theme,
        gradient,
        gradienttype,
        font,
        colormode,
        setupComplete: true,
      })
      navigate({ to: '/' })
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (!isFirst) setStep((s) => s - 1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Brand Setup</h1>
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length} — {currentStep}
          </p>
        </div>
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < step ? 'bg-primary' : i === step ? 'bg-primary/70' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Left: Step content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {currentStep === 'Theme' && <ThemeStep value={theme} onChange={setTheme} />}
          {currentStep === 'Colors' && (
            <ColorsStep
              gradient={gradient}
              gradienttype={gradienttype}
              colormode={colormode}
              onGradientChange={setGradient}
              onGradientTypeChange={setGradienttype}
              onColormodeChange={setColormode}
            />
          )}
          {currentStep === 'Typography' && <TypographyStep value={font} onChange={setFont} />}
          {currentStep === 'Preview' && (
            <PreviewStep
              theme={theme}
              gradient={gradient}
              gradienttype={gradienttype}
              colormode={colormode}
              font={font}
            />
          )}
        </div>

        {/* Right: Live preview swatch */}
        <div className="w-80 border-l border-border p-6 flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Preview
          </h3>
          <LivePreview theme={theme} gradient={gradient} colormode={colormode} font={font} />
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-border px-8 py-4 flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isFirst}>
          <ChevronLeft size={16} />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            Skip
          </Button>
          <Button variant="indigo" onClick={handleNext}>
            {isLast ? (
              <>
                <Check size={16} />
                Save & Go
              </>
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ===== Step Components =====

function ThemeStep({ value, onChange }: { value: ThemeName; onChange: (v: ThemeName) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Choose your theme</h2>
      <p className="text-muted-foreground mb-8">
        This sets the default background for all your overlays.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange('dark')}
          className={cn(
            'p-6 h-auto rounded-xl border-2 text-left transition-all flex flex-col items-start gap-0 whitespace-normal justify-start',
            value === 'dark'
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Moon size={32} className="mb-3 text-indigo-400" />
          <div className="text-lg font-semibold">Dark</div>
          <div className="text-sm text-muted-foreground mt-1">
            Dark backgrounds with light text. Best for stream overlays.
          </div>
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange('light')}
          className={cn(
            'p-6 h-auto rounded-xl border-2 text-left transition-all flex flex-col items-start gap-0 whitespace-normal justify-start',
            value === 'light'
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Sun size={32} className="mb-3 text-amber-400" />
          <div className="text-lg font-semibold">Light</div>
          <div className="text-sm text-muted-foreground mt-1">
            Light backgrounds with dark text. Clean and minimal.
          </div>
        </Button>
      </div>
    </div>
  )
}

function ColorsStep({
  gradient,
  gradienttype,
  colormode,
  onGradientChange,
  onGradientTypeChange,
  onColormodeChange,
}: {
  gradient: GradientName
  gradienttype: GradientType
  colormode: ColorMode
  onGradientChange: (v: GradientName) => void
  onGradientTypeChange: (v: GradientType) => void
  onColormodeChange: (v: ColorMode) => void
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Pick your accent colors</h2>
      <p className="text-muted-foreground mb-8">
        Choose a gradient for text highlights, lines, and accents across all overlays.
      </p>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Accent Gradient</label>
          <GradientGrid
            value={gradient}
            onValueChange={(v) => onGradientChange(v as GradientName)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelectInput
            label="Gradient Type"
            value={gradienttype}
            onChange={(v) => onGradientTypeChange(v as GradientType)}
            options={GRADIENT_TYPE_OPTIONS}
          />
          <FormSelectInput
            label="Color Mode"
            value={colormode}
            onChange={(v) => onColormodeChange(v as ColorMode)}
            options={COLOR_MODE_OPTIONS}
          />
        </div>
      </div>
    </div>
  )
}

function TypographyStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Choose your font</h2>
      <p className="text-muted-foreground mb-8">
        This will be the default display font for text, counters, and CTAs.
      </p>

      <div className="max-w-md">
        <FontSelect
          value={value}
          onValueChange={onChange}
          showGoogleFonts
          placeholder="Select a font..."
        />
      </div>
    </div>
  )
}

function PreviewStep({
  theme,
  gradient,
  gradienttype,
  colormode,
  font,
}: {
  theme: ThemeName
  gradient: GradientName
  gradienttype: GradientType
  colormode: ColorMode
  font: string
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Looking good!</h2>
      <p className="text-muted-foreground mb-8">
        Here's a summary of your brand settings. You can always change these later in each
        configurator.
      </p>

      <div className="space-y-4 max-w-lg">
        <SummaryRow label="Theme" value={theme === 'dark' ? 'Dark Mode' : 'Light Mode'} />
        <SummaryRow label="Accent Gradient" value={gradient} />
        <SummaryRow label="Gradient Type" value={gradienttype} />
        <SummaryRow label="Color Mode" value={colormode} />
        <SummaryRow label="Font" value={font} />
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border border-border">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium capitalize">{value}</span>
    </div>
  )
}

// ===== Live Preview Swatch =====

function LivePreview({
  theme,
  gradient,
  colormode,
  font,
}: {
  theme: ThemeName
  gradient: GradientName
  colormode: ColorMode
  font: string
}) {
  const themeColors = useTheme(theme)
  const gradientColors = useGradient(gradient, undefined, undefined, colormode)

  const gradientCss = useMemo(
    () => `linear-gradient(135deg, ${gradientColors.join(', ')})`,
    [gradientColors]
  )

  return (
    <div className="space-y-4">
      {/* Mini text overlay preview */}
      <div
        className="rounded-lg p-5 border"
        style={{ background: themeColors.bg, borderColor: themeColors.border }}
      >
        <div
          className="text-lg font-bold bg-clip-text text-transparent mb-1"
          style={{
            backgroundImage: gradientCss,
            fontFamily:
              font === 'display' || font === 'body' || font === 'mono'
                ? undefined
                : `'${font}', sans-serif`,
          }}
        >
          Starting Soon
        </div>
        <div className="text-xs" style={{ color: themeColors.textMuted }}>
          Stream begins in a moment...
        </div>
        <div className="h-0.5 mt-3 rounded-full" style={{ background: gradientCss }} />
      </div>

      {/* Mini CTA preview */}
      <div
        className="rounded-lg p-4 border flex items-center gap-3"
        style={{ background: themeColors.surface, borderColor: themeColors.border }}
      >
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold"
          style={{ background: gradientColors[0] }}
        >
          S
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: themeColors.text }}>
            Subscribe
          </div>
          <div className="text-xs" style={{ color: themeColors.textMuted }}>
            Don't miss out!
          </div>
        </div>
      </div>

      {/* Gradient swatch */}
      <div className="rounded-lg h-8" style={{ background: gradientCss }} />

      {/* Theme info */}
      <div className="text-xs text-muted-foreground text-center">
        Live preview with your settings
      </div>
    </div>
  )
}
