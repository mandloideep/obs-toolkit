/**
 * Border Overlay Help Section
 * Contextual guides for border overlay parameters
 */

export function BorderOverlayHelp() {
  return (
    <div className="space-y-4">
      {/* Animation Types */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Animation Types</h4>
        <p className="text-sm text-dark-muted mb-2">
          Different animation styles create unique visual effects:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Rotate:</strong> Continuous spinning motion around the border perimeter
          </li>
          <li>
            <strong>Pulse:</strong> Rhythmic expansion and contraction effect
          </li>
          <li>
            <strong>Draw:</strong> Progressive reveal animation, drawing the border line-by-line
          </li>
          <li>
            <strong>Glow:</strong> Pulsating brightness effect on the border
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Tip: Use slower speeds (2-4s) for subtle backgrounds, faster (0.5-1s) for
          attention-grabbing alerts
        </p>
      </div>

      {/* Color Shift vs Multicolor */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Color Shift vs Multicolor</h4>
        <p className="text-sm text-dark-muted mb-2">Two different approaches to animated colors:</p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Color Shift:</strong> Smoothly transitions between colors over time (hue
            rotation)
          </li>
          <li>
            <strong>Multicolor:</strong> Distributes multiple colors around the border
            simultaneously
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
          ⚠️ <strong>Note:</strong> These effects work differently - Color Shift animates a single
          color through the spectrum, while Multicolor creates a rainbow-like gradient that can
          rotate.
        </p>
      </div>

      {/* Glow Effects Guide */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Glow Effects</h4>
        <p className="text-sm text-dark-muted mb-2">
          Add depth and visual prominence with glow settings:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Glow Radius:</strong> Size of the glow effect (larger = more diffused)
          </li>
          <li>
            <strong>Glow Intensity:</strong> Brightness of the glow (0-1 range)
          </li>
          <li>
            <strong>Glow Color:</strong> Independent color for the glow effect
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Best Practice: Match glow color to your brand or theme for cohesive visuals
        </p>
      </div>

      {/* Dash Patterns Explained */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Dash Patterns</h4>
        <p className="text-sm text-dark-muted mb-2">
          Create dashed or dotted borders with dash settings:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Dash Length:</strong> Length of each dash segment
          </li>
          <li>
            <strong>Gap Length:</strong> Space between dashes
          </li>
          <li>
            <strong>Animation:</strong> Dashes can move along the border path
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2">
          <strong>Examples:</strong> Equal dash/gap (10/10) creates uniform pattern. Longer dash
          (20/5) creates dominant lines with small gaps.
        </p>
      </div>

      {/* Performance Tips */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Performance Tips</h4>
        <p className="text-sm text-dark-muted mb-2">
          Optimize your border overlay for smooth streaming:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>Simpler animations (rotate, pulse) use less CPU than complex effects</li>
          <li>Reduce glow radius if you notice frame drops</li>
          <li>Use solid colors instead of gradients for better performance</li>
          <li>Consider disabling animations for static "Starting Soon" screens</li>
        </ul>
      </div>
    </div>
  )
}
