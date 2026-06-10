/**
 * Counter Overlay Help Section
 * Contextual guides for counter overlay parameters
 */

export function CounterOverlayHelp() {
  return (
    <div className="space-y-4">
      {/* Number Formatting Guide */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Number Formatting</h4>
        <p className="text-sm text-dark-muted mb-2">
          Customize how large numbers appear in your counter:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Separator:</strong> Add commas for readability (1,234,567 vs 1234567)
          </li>
          <li>
            <strong>Abbreviate:</strong> Show compact format (1.2M instead of 1,234,567)
          </li>
          <li>
            <strong>Notation:</strong> Choose between standard (1.2M), compact (1M), or scientific
            (1.2e6)
          </li>
          <li>
            <strong>Decimal Places:</strong> Control precision (1.23M vs 1.2M vs 1M)
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2">
          <strong>Examples:</strong>
          <br />• 1,234: separator only
          <br />• 1.2K: abbreviated with 1 decimal
          <br />• 1M: abbreviated, no decimals
        </p>
      </div>

      {/* Trend Arrows Guide */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Trend Arrows & Update Timing</h4>
        <p className="text-sm text-dark-muted mb-2">Show growth indicators with trend arrows:</p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Update Timing:</strong> Arrow appears when counter value changes
          </li>
          <li>
            <strong>Arrow Duration:</strong> How long the ↑ or ↓ arrow stays visible
          </li>
          <li>
            <strong>Threshold:</strong> Only show arrow if change exceeds X (prevents jitter)
          </li>
          <li>
            <strong>Colors:</strong> Green for growth (↑), red for decline (↓), gray for no change
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
          ⚠️ <strong>Tip:</strong> Set poll rate slower than arrow duration to avoid overlap (e.g.,
          30s poll, 5s arrow)
        </p>
      </div>

      {/* Poll Rate Best Practices */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Poll Rate Best Practices</h4>
        <p className="text-sm text-dark-muted mb-2">
          Balance freshness with API limits and performance:
        </p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>YouTube:</strong> 30-60s (strict rate limits, slow-changing data)
          </li>
          <li>
            <strong>Twitch:</strong> 15-30s (moderate limits, updates during streams)
          </li>
          <li>
            <strong>GitHub:</strong> 60-300s (stars don't change rapidly)
          </li>
          <li>
            <strong>Custom APIs:</strong> Check your API's rate limit documentation
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 italic">
          Lower poll rates (longer intervals) = fewer API calls = less likely to hit rate limits
        </p>
      </div>

      {/* Custom API JSON Examples */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Custom API JSON Examples</h4>
        <p className="text-sm text-dark-muted mb-2">Understanding JSON Path for custom APIs:</p>
        <div className="text-xs font-mono bg-dark-bg border border-dark-border rounded p-3 mb-2">
          <div className="text-green-400">// Example API Response:</div>
          <div className="text-white">{'{'}</div>
          <div className="text-white ml-4">"data": {'{'}</div>
          <div className="text-white ml-8">"count": 1234,</div>
          <div className="text-white ml-8">
            "stats": {'{'} "total": 5678 {'}'}
          </div>
          <div className="text-white ml-4">{'}'}</div>
          <div className="text-white">{'}'}</div>
        </div>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <code className="bg-dark-bg px-1.5 py-0.5 rounded">data.count</code> → extracts 1234
          </li>
          <li>
            <code className="bg-dark-bg px-1.5 py-0.5 rounded">data.stats.total</code> → extracts
            5678
          </li>
          <li>
            <code className="bg-dark-bg px-1.5 py-0.5 rounded">count</code> → if count is at root
            level
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2">
          <strong>Test Your API:</strong> Use browser DevTools → Network tab to inspect JSON
          responses
        </p>
      </div>

      {/* API Key Setup Guides */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">How to Get API Keys</h4>
        <p className="text-sm text-dark-muted mb-4">
          Step-by-step instructions for obtaining API keys from each service:
        </p>

        {/* YouTube Guide */}
        <div className="bg-dark-bg/30 border border-dark-border rounded-lg p-3 mb-3">
          <h5 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-red-400">▶</span> YouTube Data API
          </h5>
          <ol className="text-xs text-dark-muted space-y-1.5 ml-4 list-decimal">
            <li>
              Go to{' '}
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-indigo hover:underline"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create a new project (name it "OBS Stream Counter")</li>
            <li>
              Enable the <strong>YouTube Data API v3</strong>
            </li>
            <li>Create Credentials → API Key</li>
            <li>Restrict to YouTube Data API v3 only</li>
            <li>
              Metric: <code className="bg-dark-bg px-1 py-0.5 rounded">subscriberCount</code>
            </li>
          </ol>
        </div>

        {/* Twitch Guide */}
        <div className="bg-dark-bg/30 border border-dark-border rounded-lg p-3 mb-3">
          <h5 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-purple-400">◆</span> Twitch API
          </h5>
          <ol className="text-xs text-dark-muted space-y-1.5 ml-4 list-decimal">
            <li>
              Go to{' '}
              <a
                href="https://dev.twitch.tv/console/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-indigo hover:underline"
              >
                Twitch Developer Console
              </a>
            </li>
            <li>Register a new application</li>
            <li>
              OAuth Redirect:{' '}
              <code className="bg-dark-bg px-1 py-0.5 rounded">http://localhost</code>
            </li>
            <li>
              Copy the <strong>Client ID</strong> (your API key)
            </li>
            <li>Get User ID from username converter tool</li>
            <li>
              Metric: <code className="bg-dark-bg px-1 py-0.5 rounded">followers</code>
            </li>
          </ol>
        </div>

        {/* GitHub Guide */}
        <div className="bg-dark-bg/30 border border-dark-border rounded-lg p-3">
          <h5 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-gray-400">◉</span> GitHub API
          </h5>
          <p className="text-xs text-green-400 mb-2 italic">
            ✓ API key optional (works without, but lower rate limits)
          </p>
          <ol className="text-xs text-dark-muted space-y-1.5 ml-4 list-decimal">
            <li>
              (Optional){' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-indigo hover:underline"
              >
                Create Personal Access Token
              </a>
            </li>
            <li>No scopes needed for public repos</li>
            <li>
              Use repo format: <code className="bg-dark-bg px-1 py-0.5 rounded">username/repo</code>
            </li>
            <li>
              Metric: <code className="bg-dark-bg px-1 py-0.5 rounded">stargazers_count</code>
            </li>
          </ol>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-brand-indigo">Security Best Practices</h4>
        <p className="text-sm text-dark-muted mb-2">Protect your API keys and accounts:</p>
        <ul className="text-sm text-dark-muted space-y-1 list-disc list-inside">
          <li>
            <strong>Read-Only Keys:</strong> Only request minimum permissions needed
          </li>
          <li>
            <strong>Restrict Keys:</strong> Limit to specific APIs, not all services
          </li>
          <li>
            <strong>Rotate Keys:</strong> Generate new keys every few months
          </li>
          <li>
            <strong>Browser Storage:</strong> Keys stored in localStorage (not visible in stream,
            but visible in URL)
          </li>
          <li>
            <strong>Persistence Toggle:</strong> Disable "Remember API Keys" for shared computers
          </li>
        </ul>
        <p className="text-xs text-dark-muted mt-2 bg-red-500/10 border border-red-500/30 rounded p-2">
          ⚠️ <strong>Warning:</strong> Never share your OBS overlay URLs containing API keys
          publicly. Use the persistence toggle to save keys locally instead.
        </p>
      </div>
    </div>
  )
}
