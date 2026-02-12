import { Link, useLocation } from '@tanstack/react-router'
import { Github, ExternalLink } from 'lucide-react'
import { OVERLAYS } from '../lib/constants'

export default function Header() {
  const location = useLocation()

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

          {/* Overlay Navigation Links */}
          <div className="flex items-center gap-1">
            {OVERLAYS.map((overlay) => {
              const isActive = location.pathname.startsWith(overlay.configurePath)
              return (
                <Link
                  key={overlay.name}
                  to={overlay.configurePath}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: overlay.color + '20', color: overlay.color }
                      : undefined
                  }
                >
                  <overlay.icon size={16} />
                  <span>{overlay.name}</span>
                </Link>
              )
            })}
          </div>

          {/* External Links */}
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
        </div>
      </nav>
    </header>
  )
}
