import { Link } from '@tanstack/react-router'
import { Home, Github, ExternalLink } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-dark-surface/80 backdrop-blur-md border-b border-dark-border">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              OT
            </div>
            OBS Toolkit
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
              <ExternalLink size={12} />
            </a>

            <Link
              to="/overlays/border"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              <ExternalLink size={14} />
              <span>View Demo</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
