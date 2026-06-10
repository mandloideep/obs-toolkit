/**
 * CTA Overlay Help Section
 * Contextual guides for CTA (Call-to-Action) overlay parameters
 */

export function CTAOverlayHelp() {
  return (
    <div className="space-y-4">
      {/* Icon Selection Guide */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Icon Selection</h4>
        <p className="text-sm text-dark-muted mb-2">
          Choose icons that match your call-to-action intent:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>bell:</strong> Notifications, alerts, subscribe reminders
          </li>
          <li>
            <strong>heart:</strong> Like, favorite, support actions
          </li>
          <li>
            <strong>thumbsup:</strong> Approval, recommendations
          </li>
          <li>
            <strong>star:</strong> Ratings, highlights, featured content
          </li>
          <li>
            <strong>gift:</strong> Giveaways, rewards, donations
          </li>
          <li>
            <strong>play:</strong> Watch, start, begin actions
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          All icons from Lucide Icons - see full list at{' '}
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

      {/* Icon Animation Best Practices */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Icon Animation Best Practices</h4>
        <p className="text-sm text-dark-muted mb-2">
          Different animations convey different urgency levels:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>bounce:</strong> Playful, attention-grabbing (best for fun CTAs like giveaways)
          </li>
          <li>
            <strong>pulse:</strong> Gentle, rhythmic (good for subscribe/follow buttons)
          </li>
          <li>
            <strong>spin:</strong> High energy (use sparingly for urgent actions)
          </li>
          <li>
            <strong>wave:</strong> Friendly, inviting (great for welcome messages)
          </li>
          <li>
            <strong>none:</strong> Professional, minimal (for subtle CTAs)
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
          ⚠️ <strong>Tip:</strong> Match animation speed to urgency - slower (2-3s) for casual,
          faster (0.5-1s) for time-sensitive CTAs
        </p>
      </div>

      {/* Decoration Styles */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Decoration Styles</h4>
        <p className="text-sm text-dark-muted mb-2">
          Visual decorations enhance your CTA's prominence:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Border:</strong> Clean outline around the entire CTA
          </li>
          <li>
            <strong>Underline:</strong> Subtle emphasis below text
          </li>
          <li>
            <strong>Shadow:</strong> Depth effect, makes CTA "pop" from background
          </li>
          <li>
            <strong>Glow:</strong> Luminous effect, draws maximum attention
          </li>
          <li>
            <strong>None:</strong> Minimal styling, relies on colors and text
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Combine decorations with gradients for modern, eye-catching designs
        </p>
      </div>

      {/* Effective Button Text */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Effective Button Text</h4>
        <p className="text-sm text-dark-muted mb-2">Writing compelling CTAs that drive action:</p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Be Specific:</strong> "Subscribe for Weekly Updates" beats "Subscribe"
          </li>
          <li>
            <strong>Create Urgency:</strong> "Join Now" or "Limited Time"
          </li>
          <li>
            <strong>Use Action Verbs:</strong> Start with "Get", "Join", "Unlock", "Discover"
          </li>
          <li>
            <strong>Keep it Short:</strong> 2-5 words is ideal for readability
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2">
          <strong>Examples:</strong> "Follow for More" • "Click to Support" • "Join the Community" •
          "Get Notified"
        </p>
      </div>

      {/* Sizing Guidelines */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Sizing Guidelines</h4>
        <p className="text-sm text-dark-muted mb-2">
          Recommended sizes based on stream resolution:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>1080p Streams:</strong> Font size 32-48px, Icon size 40-60px
          </li>
          <li>
            <strong>720p Streams:</strong> Font size 24-36px, Icon size 32-48px
          </li>
          <li>
            <strong>Mobile:</strong> Larger text (48-64px) for better visibility
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Test visibility in OBS preview - text should be readable at actual stream size
        </p>
      </div>

      {/* Positioning Tips */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Positioning Tips</h4>
        <p className="text-sm text-dark-muted mb-2">
          Strategic placement improves CTA effectiveness:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Bottom Third:</strong> Standard for "Subscribe" buttons (doesn't block content)
          </li>
          <li>
            <strong>Top Right:</strong> Good for follow/notification CTAs
          </li>
          <li>
            <strong>Center:</strong> Maximum visibility for urgent announcements
          </li>
          <li>
            <strong>Above Chat:</strong> If you have visible chat overlay
          </li>
        </ul>
      </div>
    </div>
  )
}
