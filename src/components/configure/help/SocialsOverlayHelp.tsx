/**
 * Socials Overlay Help Section
 * Contextual guides for socials overlay parameters
 */

export function SocialsOverlayHelp() {
  return (
    <div className="space-y-4">
      {/* Platform Ordering */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Platform Ordering & Priority</h4>
        <p className="text-sm text-dark-muted mb-2">
          The order you enable platforms determines their display sequence:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Priority Order:</strong> Most important platforms first (typically Twitter/X,
            YouTube, Twitch)
          </li>
          <li>
            <strong>Visual Balance:</strong> Aim for 3-5 platforms to avoid clutter
          </li>
          <li>
            <strong>Active Platforms:</strong> Only show platforms you actively use and monitor
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Tip: Reorder by toggling platforms off and back on in your preferred sequence
        </p>
      </div>

      {/* Display Modes */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Display Modes</h4>
        <p className="text-sm text-dark-muted mb-2">
          Choose how your social icons appear on stream:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>All at Once:</strong> Show all enabled platforms simultaneously in a row
          </li>
          <li>
            <strong>One by One:</strong> Cycle through platforms with entrance/exit animations
          </li>
          <li>
            <strong>Loop Mode:</strong> Continuously rotate through platforms (great for "Starting
            Soon" screens)
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
          ⚠️ <strong>Note:</strong> One-by-one mode requires setting hold time (how long each
          platform displays)
        </p>
      </div>

      {/* Icon Color Modes */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Icon Color Modes</h4>
        <p className="text-sm text-dark-muted mb-2">
          Different color approaches for different aesthetics:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Brand Colors:</strong> Use official platform colors (Twitter blue, YouTube red,
            etc.)
          </li>
          <li>
            <strong>Monochrome:</strong> Single color for all icons (matches your stream theme)
          </li>
          <li>
            <strong>Gradient:</strong> Animated gradient effect across all icons
          </li>
          <li>
            <strong>Platform Default:</strong> Each icon uses its official brand color
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Brand colors look professional; gradients create a cohesive, modern look
        </p>
      </div>

      {/* Handle Formats */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Platform Handle Formats</h4>
        <p className="text-sm text-dark-muted mb-2">Correct format for each platform:</p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Twitter/X:</strong> @username (e.g., @yourhandle)
          </li>
          <li>
            <strong>Twitch:</strong> Just username (no @)
          </li>
          <li>
            <strong>YouTube:</strong> @channelname or /c/channelname
          </li>
          <li>
            <strong>Instagram:</strong> @username
          </li>
          <li>
            <strong>Discord:</strong> Server invite code or username
          </li>
          <li>
            <strong>Website:</strong> Full URL (https://yourdomain.com)
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
          ⚠️ <strong>Important:</strong> Handles are display-only in the overlay. Add clickable
          links in your stream description.
        </p>
      </div>

      {/* Custom Icon Overrides */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Custom Icon Customization</h4>
        <p className="text-sm text-dark-muted mb-2">
          Advanced: Override default platform icons with custom ones:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Icon Size:</strong> Adjust size independently for each platform
          </li>
          <li>
            <strong>Icon Spacing:</strong> Control gap between icons in row layout
          </li>
          <li>
            <strong>Custom Icons:</strong> Use Lucide icon names for custom platforms
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2">
          Browse icons at{' '}
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noopener"
            className="text-brand-indigo hover:underline"
          >
            lucide.dev/icons
          </a>
        </p>
      </div>

      {/* Layout Recommendations */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Layout Recommendations</h4>
        <p className="text-sm text-dark-muted mb-2">
          Best practices for different stream scenarios:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Gaming Streams:</strong> Bottom-left corner, small icons (32-40px), all-at-once
            mode
          </li>
          <li>
            <strong>Talk Streams:</strong> Bottom-center, medium icons (48-56px), with handles
            visible
          </li>
          <li>
            <strong>Starting Soon:</strong> Center screen, large icons (64-80px), one-by-one loop
            mode
          </li>
          <li>
            <strong>Ending Screen:</strong> Top-center, medium icons with "Follow me on:" text
          </li>
        </ul>
      </div>

      {/* Animation Tips */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Animation Tips</h4>
        <p className="text-sm text-dark-muted mb-2">
          Effective animation usage for social overlays:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Subtle Entrance:</strong> fadeIn or slideUp for professional look
          </li>
          <li>
            <strong>Attention-Grabbing:</strong> bounce or zoom for starting screens
          </li>
          <li>
            <strong>Hold Time:</strong> 3-5 seconds per platform in one-by-one mode
          </li>
          <li>
            <strong>Loop Delay:</strong> 0.5-1 second pause between cycles
          </li>
        </ul>
      </div>
    </div>
  )
}
