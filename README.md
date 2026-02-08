# OBS Overlay Toolkit

Professional stream overlays built with React, TypeScript, and TanStack Router. Configure visually through the dashboard or use URLs directly in OBS Browser Sources.

## ✨ Features

- **5 Overlay Types**: Border, Text, Counter, CTA, Socials
- **140+ Parameters**: Complete customization control
- **21 Gradient Presets**: Beautiful color schemes
- **60fps Animations**: GPU-accelerated smooth animations
- **Type-Safe**: Full TypeScript support throughout
- **Visual Configuration**: Interactive dashboard for easy setup
- **API Integration**: Live data polling (YouTube, Twitch, GitHub)
- **Zero Dependencies**: Client-side only, no server required

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:5173` to access the dashboard.

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📦 Overlays

### 1. Border Overlay

Animated borders with various shapes, styles, and effects.

**Key Features:**
- 2 shapes (rect, circle)
- 5 styles (solid, dashed, dotted, double, neon)
- 4 animations (dash, rotate, pulse, breathe)
- Multicolor & colorshift modes

**Usage:**
```
/overlays/border?gradient=sunset&animation=rotate&thickness=8
```

### 2. Text Overlay

Name plates, lower thirds, and stream screens with presets.

**Key Features:**
- 6 presets (brb, chatting, starting, ending, technical, custom)
- Loop mode with hold/pause timing
- Typewriter effect
- Signature lines with animations

**Usage:**
```
/overlays/text?preset=brb&loop=true&hold=8&pause=20
```

### 3. Counter Overlay

Live counters with API polling and smooth animations.

**Key Features:**
- API polling (YouTube, Twitch, GitHub, custom)
- Count-up animations with cubic easing
- Trend indicators (up/down arrows)
- Number formatting (abbreviation, decimals, separators)

**Usage:**
```
/overlays/counter?value=1000&animate=true&trend=true
```

### 4. CTA Overlay

Call-to-action overlays with animated icons.

**Key Features:**
- 5 presets (subscribe, like, follow, share, notify)
- 7 icon animations (bounce, shake, pulse, spin, wiggle, flip, heartbeat)
- Decorations (line, slant, swirl)
- Loop mode

**Usage:**
```
/overlays/cta?preset=subscribe&loop=true&iconanim=bounce
```

### 5. Socials Overlay

Social media links with flexible display modes.

**Key Features:**
- 9 platforms (GitHub, Twitter, LinkedIn, YouTube, Instagram, Twitch, Kick, Discord, Website)
- 4 color modes (brand, platform, white, gradient)
- Stagger entrance animations
- One-by-one cycling mode

**Usage:**
```
/overlays/socials?show=github,linkedin,youtube&iconcolor=platform
```

## 🎨 Configuration

### Visual Dashboard

Visit the root URL to access the interactive dashboard. Each overlay has a dedicated configurator with:
- Real-time preview
- Form controls for all parameters
- Auto-generated URLs
- One-click copy to clipboard

### URL Parameters

All overlays support direct URL configuration. Parameters:

**Common Parameters:**
- `theme` - dark | light
- `gradient` - indigo | cyan | sunset | emerald | neon | fire | ocean | purple | ... (21 total)
- `bg` - true | false (show background panel)
- `align` - left | center | right
- `valign` - top | center | bottom

**Animation Parameters:**
- `entrance` - fade | slideUp | slideDown | slideLeft | slideRight | scale | bounce | ...
- `exit` - fade | slideDown | slideUp | scale | ...
- `delay` - Initial delay in seconds
- `speed` - Animation speed in seconds

See [features.md](features.md) for complete parameter documentation.

## 🛠️ Architecture

### Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **Vite** - Build tool
- **Lucide React** - Icon library

### Project Structure

```
src/
├── components/
│   ├── animations/       # Entrance/exit animation wrappers
│   ├── configure/        # Dashboard UI components
│   ├── overlays/         # Overlay components
│   └── svg/              # SVG utilities
├── config/
│   ├── brand.config.ts   # Brand configuration
│   ├── text-presets.ts   # Text overlay presets
│   ├── cta-presets.ts    # CTA overlay presets
│   └── platform-icons.ts # Social platform icons
├── contexts/
│   └── BrandContext.tsx  # Brand configuration context
├── hooks/
│   ├── useBrand.ts       # Brand access hooks
│   ├── useOverlayParams.ts # URL parameter parsing
│   ├── useRAFAnimation.ts  # RequestAnimationFrame hooks
│   ├── useCountUp.ts     # Count-up animation
│   └── useAPIPolling.ts  # API polling
├── routes/
│   ├── overlays/         # Overlay routes
│   └── configure/        # Configuration routes
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Key Concepts

**URL Parameter Parsing:**
All overlays use the `useOverlayParams` hook for type-safe URL parameter parsing with automatic type coercion.

**Brand System:**
Centralized brand configuration (colors, gradients, fonts, socials) accessible via React Context and custom hooks.

**Animation System:**
RAF-based animations with proper cleanup, GPU-accelerated transforms, and 60fps performance.

**Type Safety:**
Full TypeScript coverage with strict mode enabled. All parameters have proper type definitions.

## 🧪 Testing

Run the overlays in OBS Browser Source:

1. Add a **Browser Source** to your scene
2. Set URL to: `https://[your-domain]/obs-toolkit/overlays/[overlay-name]?[params]`
3. Set Width: `1920`, Height: `1080`
4. Check: **Shutdown source when not visible**
5. Check: **Refresh browser when scene becomes active**

## 📝 Development

### Adding a New Overlay

1. Create types in `src/types/[overlay].types.ts`
2. Create component in `src/components/overlays/[Overlay].tsx`
3. Create route in `src/routes/overlays/[overlay].tsx`
4. Add configurator in `src/routes/configure/[overlay].tsx`
5. Update dashboard cards in `src/routes/index.tsx`

### Code Style

- Use functional components with hooks
- Prefer CSS-in-JS for overlay components (inline styles)
- Use `CSSProperties` type for style objects
- Clean up side effects (RAF, timers, intervals)
- Follow existing naming conventions

## 🚢 Deployment

### GitHub Pages

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

**Configuration:**
- Base path: `/obs-toolkit/` (set in `vite.config.ts`)
- Deploy workflow: `.github/workflows/deploy.yml`
- Build command: `npm run build`
- Output directory: `dist/`

**Manual Deployment:**
```bash
npm run build
# Upload dist/ contents to your hosting provider
```

## 📚 Documentation

- [features.md](features.md) - Complete feature documentation with all 140+ parameters
- [react.md](react.md) - Migration plan and architecture decisions

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Please open an issue to discuss any changes.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Built with [TanStack Router](https://tanstack.com/router)
- Icons from [Lucide](https://lucide.dev)
- Inspired by the streaming community

---

**Made with ❤️ for streamers**

Visit the [live demo](https://deepmandloi.github.io/obs-toolkit/) to see it in action!
