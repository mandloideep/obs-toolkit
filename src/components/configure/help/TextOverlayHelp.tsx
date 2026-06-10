/**
 * Text Overlay Help Section
 * Contextual guides for text overlay parameters
 */

export function TextOverlayHelp() {
  return (
    <div className="space-y-4">
      {/* Understanding Presets */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Understanding Presets</h4>
        <p className="text-sm text-dark-muted mb-2">
          Quick presets provide pre-configured combinations for common streaming scenarios:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>BRB:</strong> "Be Right Back" with casual styling
          </li>
          <li>
            <strong>Chatting:</strong> "Just Chatting" for talk streams
          </li>
          <li>
            <strong>Starting Soon:</strong> Pre-stream countdown screen
          </li>
          <li>
            <strong>Ending:</strong> "Thanks for Watching" outro screen
          </li>
          <li>
            <strong>Technical Difficulties:</strong> Emergency message with alert styling
          </li>
        </ul>
      </div>

      {/* Signature Line Explained */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Signature Line</h4>
        <p className="text-sm text-dark-muted mb-2">
          Add a secondary line below your main text for extra context or branding.
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Position:</strong> Below or Above main text
          </li>
          <li>
            <strong>Style:</strong> Independent font, size, and color
          </li>
          <li>
            <strong>Animation:</strong> Can animate separately from main text
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Example: Main text "Starting Soon" with signature "Stream begins at 3pm EST"
        </p>
      </div>

      {/* Loop Mode Guide */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Loop Mode</h4>
        <p className="text-sm text-dark-muted mb-2">Control how your text behaves in OBS:</p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Once:</strong> Show text once, then stay visible (default for static screens)
          </li>
          <li>
            <strong>Loop:</strong> Repeat entrance animation indefinitely (attention-grabbing)
          </li>
          <li>
            <strong>Hold:</strong> Show for X seconds, then exit (timed messages)
          </li>
          <li>
            <strong>Pause:</strong> Show, exit, wait, then repeat (intermittent alerts)
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2">
          <strong>Timing Tips:</strong> Hold time = how long text displays. Pause time = break
          between repeats.
        </p>
      </div>

      {/* Color vs Gradient */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Colors & Gradients</h4>
        <p className="text-sm text-dark-muted mb-2">
          Choose between solid colors or animated gradients:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Solid Color:</strong> Use Text Color field for simple, readable text
          </li>
          <li>
            <strong>Gradient:</strong> Enable Text Gradient for animated, eye-catching effects
          </li>
          <li>
            <strong>Custom Gradient:</strong> Define your own colors in the Colors array
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
          ⚠️ <strong>Note:</strong> When Text Gradient is enabled, the Text Color field is ignored.
        </p>
      </div>

      {/* Spacing Parameters */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Understanding Spacing</h4>
        <p className="text-sm text-dark-muted mb-2">
          Fine-tune text positioning with these parameters:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Padding:</strong> Space inside the text container (affects background)
          </li>
          <li>
            <strong>Margin:</strong> Space outside the text (affects overall position)
          </li>
          <li>
            <strong>Offset:</strong> Shift text from its alignment point (X/Y coordinates)
          </li>
          <li>
            <strong>Line Spacing:</strong> Vertical gap between main text and signature
          </li>
        </ul>
      </div>
    </div>
  )
}
