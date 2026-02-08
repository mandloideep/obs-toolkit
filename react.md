# OBS Overlay Toolkit: HTML/CSS/JS to React Migration Plan

## Context

### Why This Migration?

The OBS Overlay Toolkit currently consists of 5 standalone HTML files (border.html, text.html, counter.html, cta.html, socials.html) with vanilla JavaScript implementations. While functional, this architecture has become difficult to maintain:

- **Code Duplication**: Each of the 5 overlays implements similar URL parameter parsing, brand configuration access, and animation patterns independently
- **No Type Safety**: Vanilla JS with 140+ parameters across components leads to runtime errors and unclear contracts
- **Hard to Test**: No component isolation, difficult to unit test
- **Maintenance Burden**: Changes to shared patterns require updating 5 separate files
- **Limited Reusability**: Common abstractions (animations, styling, parameter parsing) are copy-pasted across files

### The Goal

Migrate to a React + TypeScript architecture using TanStack Router while:
1. **Preserving all 140+ parameters** and their exact behavior
2. **Maintaining backward compatibility** with existing URLs
3. **Deploying to GitHub Pages** (client-side only, no server)
4. **Improving maintainability** through shared hooks and components
5. **Adding type safety** to prevent runtime errors

### Current State

- **5 HTML overlays**: 5,452 total lines of vanilla JS
- **Brand system**: brand.js (79 lines) + brand-helpers.js (241 lines)
- **Preview system**: preview-wrapper.js (275 lines)
- **TanStack Router**: Already initialized with demo routes (need cleanup)
- **Build tool**: Vite with TypeScript configured

### Migration Strategy

**Iterative approach**: Start with 2 overlays (border + text) to validate the architecture, then expand to the remaining 3 overlays (counter, CTA, socials). This reduces risk and allows us to refine patterns before full migration.

---

## PHASE 0: Cleanup & Configuration for GitHub Pages

**Goal**: Remove server-side dependencies and configure for static client-only deployment

**Critical Files**:
- [package.json](package.json)
- [vite.config.ts](vite.config.ts)
- [src/routes/__root.tsx](src/routes/__root.tsx)

### Tasks (can be done in parallel):

- [ ] **Remove TanStack Start dependencies**
  - Remove `@tanstack/react-start` from package.json
  - Remove `@tanstack/react-router-ssr-query` from package.json
  - Remove `tanstackStart()` plugin from vite.config.ts
  - Keep only `@vitejs/plugin-react` and `@tanstack/router-plugin`

- [ ] **Delete demo/SSR files**
  - Remove entire `src/routes/demo/` directory (8 SSR demo files)
  - Remove `src/data/demo.punk-songs.ts`
  - Remove demo-related CSS (`src/routes/demo/start.css`)

- [ ] **Configure Vite for GitHub Pages**
  - Set `base: '/obs-toolkit/'` in vite.config.ts (or appropriate repo name)
  - Ensure `build.outDir: 'dist'`
  - Remove any SSR-specific build options

- [ ] **Simplify root route for SPA mode**
  - Update `__root.tsx` to remove SSR components (`HeadContent`, `Scripts`, `shellComponent`)
  - Use standard React Router Outlet pattern
  - Keep TanStack DevTools for development only

- [ ] **Create GitHub Actions workflow**
  - Add `.github/workflows/deploy.yml` for automated deployment
  - Configure: build → deploy to GitHub Pages
  - Set up proper base path handling in workflow

- [ ] **Archive old HTML files**
  - Move border.html, text.html, counter.html, cta.html, socials.html to `archive/` directory
  - Keep index-old.html for reference
  - Keep brand.js, brand-helpers.js, preview-wrapper.js at root temporarily (will migrate in Phase 1)

### Success Criteria:
- ✓ `npm run build` creates static assets in `dist/`
- ✓ No server-side rendering dependencies remain
- ✓ Clean React SPA ready for overlay implementation
- ✓ GitHub Actions workflow ready for deployment

---

## PHASE 1: Core Brand System Migration

**Goal**: Convert brand configuration and helper utilities to TypeScript with React hooks

**Critical Files**:
- [src/types/brand.types.ts](src/types/brand.types.ts) - NEW
- [src/config/brand.config.ts](src/config/brand.config.ts) - NEW
- [src/contexts/BrandContext.tsx](src/contexts/BrandContext.tsx) - NEW
- [src/hooks/useBrand.ts](src/hooks/useBrand.ts) - NEW
- [src/hooks/useOverlayParams.ts](src/hooks/useOverlayParams.ts) - NEW

### Tasks (can be done in parallel):

- [ ] **Create TypeScript brand types**
  - File: `src/types/brand.types.ts`
  - Define: `BrandConfig`, `ThemeConfig`, `AccentColors`, `GradientMap`, `FontConfig`, `SocialHandles`
  - Create union types for animations: `EntranceAnimation`, `ExitAnimation`, `IconAnimation`, etc.
  - Export parameter enums: shapes, styles, layouts, etc.

- [ ] **Migrate brand configuration to TypeScript**
  - File: `src/config/brand.config.ts`
  - Convert `brand.js` to typed constant `BRAND_CONFIG`
  - Maintain exact structure: name, accent colors, themes (dark/light), 21 gradients, fonts, socials
  - Export with full type annotations

- [ ] **Create Brand Context**
  - File: `src/contexts/BrandContext.tsx`
  - React Context to provide `BRAND_CONFIG` globally
  - `BrandProvider` component wrapping app
  - Support runtime overrides via URL parameters (for preview)
  - Deep merge utility for fallback chain

- [ ] **Create brand access hooks**
  - File: `src/hooks/useBrand.ts`
  - `useBrand()` - Get full brand configuration
  - `useTheme()` - Get current theme object (dark/light) based on URL param
  - `useGradient(name?)` - Get gradient color array with custom color support
  - `useAccents()` - Get contrast-aware accent colors
  - `useFonts()` - Get font family strings

- [ ] **Create URL parameter parsing hook**
  - File: `src/hooks/useOverlayParams.ts`
  - Generic typed hook: `useOverlayParams<T extends Record<string, any>>(defaults: T)`
  - Parse URLSearchParams from `window.location.search`
  - Type coercion: strings, numbers, booleans, comma-separated arrays
  - Return typed object matching defaults structure
  - Implement fallback chain: URL param → default value

- [ ] **Create animation hooks**
  - File: `src/hooks/useRAFAnimation.ts`
  - `useRAFAnimation(callback, deps)` - RequestAnimationFrame wrapper with cleanup
  - `useAnimationCycle(duration)` - Returns normalized progress 0-1
  - Proper cleanup on unmount to prevent memory leaks

### Success Criteria:
- ✓ Brand system accessible via React hooks throughout app
- ✓ URL parameters parsed with full type safety
- ✓ No TypeScript errors, strict mode passes
- ✓ Hooks can be tested independently

---

## PHASE 2: Shared Components & Utilities

**Goal**: Build reusable abstractions to eliminate duplication across overlays

**Critical Files**:
- [src/utils/css.utils.ts](src/utils/css.utils.ts) - NEW
- [src/components/animations/EntranceAnimation.tsx](src/components/animations/EntranceAnimation.tsx) - NEW
- [src/components/overlays/OverlayContainer.tsx](src/components/overlays/OverlayContainer.tsx) - NEW
- [src/components/icons/Icon.tsx](src/components/icons/Icon.tsx) - NEW

### Tasks (can be done in parallel):

- [ ] **Create CSS utility functions**
  - File: `src/utils/css.utils.ts`
  - `setCSSVar(name: string, value: string)` - Set CSS custom property on document
  - `setCSSVars(vars: Record<string, string>)` - Batch set multiple CSS vars
  - `interpolateColor(color1, color2, factor)` - Linear RGB interpolation for smooth transitions
  - `hexToRgb(hex)`, `rgbToHex(r, g, b)` - Color conversion utilities

- [ ] **Create entrance animation component**
  - File: `src/components/animations/EntranceAnimation.tsx`
  - Props: `type: EntranceAnimation`, `delay?: number`, `speed?: number`, `children`
  - Supported types: fade, slideUp, slideDown, slideLeft, slideRight, scale, bounce, typewriter, flipIn, zoomBounce, rotateIn
  - Uses CSS classes + React state for animation triggering
  - Auto-trigger on mount with configurable delay

- [ ] **Create exit animation wrapper**
  - File: `src/components/animations/ExitAnimation.tsx`
  - Props: `type: ExitAnimation`, `duration?: number`, `trigger: boolean`, `onComplete?: () => void`, `children`
  - Supported types: none, fade, slideDown, slideUp, slideLeft, scale, fadeLeft, zoomOut, rotateOut, flipOut
  - Calls `onComplete` after animation finishes

- [ ] **Create overlay container component**
  - File: `src/components/overlays/OverlayContainer.tsx`
  - Props: `showBg?: boolean`, `padding?: number`, `align?: 'left' | 'center' | 'right'`, `valign?: 'top' | 'center' | 'bottom'`, `children`
  - Handles positioning (absolute with flex alignment)
  - Conditional background panel with blur and theme-aware colors
  - Inject theme CSS variables

- [ ] **Create overlay panel component**
  - File: `src/components/overlays/OverlayPanel.tsx`
  - Background panel with border, blur, shadow
  - Theme-aware: uses `bg`, `border` colors from current theme
  - Configurable border radius, padding

- [ ] **Create icon component system**
  - File: `src/components/icons/Icon.tsx`
  - Wrapper for Lucide React icons (already in package.json)
  - Props: `name: string`, `size?: number`, `color?: string`, `className?`
  - Dynamic icon import: `lucide-react` provides tree-shakable icons
  - File: `src/components/icons/icon-library.ts`
  - Export inline SVG strings for custom icons (from HTML files)
  - Social platform icons, CTA icons not in Lucide

- [ ] **Create SVG gradient utilities**
  - File: `src/components/svg/GradientDef.tsx`
  - Component to generate `<defs><linearGradient>` with stops
  - Props: `id: string`, `colors: string[]`, `direction?: number` (0-360 degrees)
  - Used by border overlay for dynamic gradients

### Success Criteria:
- ✓ All shared components have proper TypeScript types
- ✓ Entrance/exit animations smooth and GPU-accelerated
- ✓ CSS utilities handle color manipulation correctly
- ✓ Icon system supports both Lucide and custom SVGs
- ✓ No duplication of animation/styling logic

---

## PHASE 3: Migrate Border Overlay

**Goal**: Convert border.html (350 lines) to React component with full feature parity (27 parameters)

**Critical Files**:
- [src/types/border.types.ts](src/types/border.types.ts) - NEW
- [src/components/overlays/BorderOverlay.tsx](src/components/overlays/BorderOverlay.tsx) - NEW
- [src/routes/overlays/border.tsx](src/routes/overlays/border.tsx) - NEW

**Reference**: [archive/border.html](archive/border.html) (will be created in Phase 0)

### Tasks (sequential dependencies):

1. [ ] **Create border parameter types**
   - File: `src/types/border.types.ts`
   - Interface: `BorderOverlayParams` with 27 parameters:
     - Shape & style: `shape`, `style`, `animation`
     - Geometry: `r` (radius), `thickness`, `dash` (visible ratio)
     - Colors: `gradient`, `colors`, `random`
     - Appearance: `glow`, `glowsize`, `opacity`
     - Animation: `speed`, `multicolor`, `colorshift`, `shiftspeed`
     - Global: `theme`
   - Type each parameter with proper unions (e.g., `shape: 'rect' | 'circle'`)

2. [ ] **Create BorderOverlay component**
   - File: `src/components/overlays/BorderOverlay.tsx`
   - Use `useOverlayParams<BorderOverlayParams>()` with defaults
   - Use `useGradient()` for color resolution
   - Render SVG with dynamic `viewBox` based on shape
   - Generate `<linearGradient>` definitions with gradient colors
   - Apply shape: `<rect>` for rectangle, `<circle>` for circle

3. [ ] **Implement border styles**
   - Solid: standard stroke
   - Dashed: `strokeDasharray` calculated from perimeter
   - Dotted: short `strokeDasharray` for dots
   - Double: two `<rect>/<circle>` elements with gap
   - Neon: solid + heavy `filter: drop-shadow` for glow

4. [ ] **Implement border animations using RAF**
   - File: `src/components/overlays/BorderOverlay/animations.ts`
   - **Dash**: Animate `strokeDashoffset` from 0 to perimeter
   - **Rotate**: Rotate gradient direction (update `x1`, `y1`, `x2`, `y2` attributes)
   - **Pulse**: Sine wave opacity animation (0.3 to 1)
   - **Breathe**: Sine wave on glow `drop-shadow` blur radius
   - Use `useRAFAnimation` hook for all animations

5. [ ] **Implement advanced color features**
   - **Multicolor mode**: Cycle through all 21 brand gradients
   - **Colorshift mode**: Smooth transitions between gradients using color interpolation
   - Use `interpolateColor` utility from Phase 2
   - Update gradient `<stop>` colors in RAF loop

6. [ ] **Create border route**
   - File: `src/routes/overlays/border.tsx`
   - TanStack Router route: `/overlays/border`
   - No layout wrapper (transparent fullscreen)
   - Simply render `<BorderOverlay />`
   - Component reads all params from URL automatically

### Success Criteria:
- ✓ Border overlay renders identically to HTML version
- ✓ All 27 parameters functional and match documented behavior
- ✓ Animations run at 60fps (verify with performance profiler)
- ✓ URL parameter changes update component live (React hot reload)
- ✓ Works in OBS Browser Source with transparency

---

## PHASE 4: Migrate Text Overlay

**Goal**: Convert text.html (450+ lines) to React with presets and complex animations (30+ parameters)

**Critical Files**:
- [src/types/text.types.ts](src/types/text.types.ts) - NEW
- [src/config/text-presets.ts](src/config/text-presets.ts) - NEW
- [src/components/overlays/TextOverlay.tsx](src/components/overlays/TextOverlay.tsx) - NEW
- [src/components/overlays/TextOverlay/SignatureLine.tsx](src/components/overlays/TextOverlay/SignatureLine.tsx) - NEW
- [src/routes/overlays/text.tsx](src/routes/overlays/text.tsx) - NEW

**Reference**: [archive/text.html](archive/text.html)

### Tasks (sequential dependencies):

1. [ ] **Create text parameter types**
   - File: `src/types/text.types.ts`
   - Interface: `TextOverlayParams` with 30+ parameters:
     - Content: `text`, `sub`, `size`, `subsize`, `weight`, `font`, `preset`
     - Layout: `align`, `valign`, `maxwidth`, `pad`, `padx`, `pady`, `marginx`, `marginy`, `offsetx`, `offsety`, `bg`
     - Line: `line`, `linestyle`, `lineanim`, `linepos`, `linelength`, `linewidth`, `linespeed`
     - Entrance: `entrance`, `entrancespeed`, `delay`
     - Exit: `exit`, `exitafter`, `exitspeed`
     - Loop: `loop`, `hold`, `pause`
     - Colors: `textcolor`, `subcolor`, `textgradient`
     - Global: `theme`, `gradient`, `colors`
   - Interface: `TextPreset` for preset configurations

2. [ ] **Create preset system**
   - File: `src/config/text-presets.ts`
   - Port all 6 presets from HTML:
     - `brb`: Be Right Back, 48px, red accent, centered, scale entrance
     - `chatting`: Just Chatting, 36px, fade entrance, gradient line
     - `starting`: Starting Soon, 52px, green accent, slideUp entrance
     - `ending`: Thanks for Watching, 44px, fade entrance, gradient line
     - `technical`: Technical Difficulties, 40px, mono font, dashed line
     - `custom`: Empty preset for full manual control
   - Export as typed constant `TEXT_PRESETS`

3. [ ] **Create TextOverlay component**
   - File: `src/components/overlays/TextOverlay.tsx`
   - Resolve preset: load from `TEXT_PRESETS[preset]` if provided
   - Use `useOverlayParams` with fallback chain: URL → Preset → Default
   - Render main text `<h1>` with configurable size, weight, font family
   - Render subtitle `<p>` if provided
   - Apply gradient to text via CSS `background-clip: text` if `textgradient=true`
   - Wrap in `<OverlayContainer>` with alignment and background panel

4. [ ] **Implement signature line decorations**
   - File: `src/components/overlays/TextOverlay/SignatureLine.tsx`
   - Props: `style`, `animation`, `position`, `length`, `width`, `speed`, `gradient`
   - **Styles**:
     - `solid`, `dashed`, `dotted`: standard CSS borders
     - `gradient`: linear gradient background
     - `slant`, `wave`, `swirl`, `bracket`: SVG or CSS shapes
   - **Animations**:
     - `slide`: translate X from -100% to 100%
     - `grow`: width from 0 to full
     - `pulse`: opacity pulse
     - `none`: static line
   - **Position**: render above text, below text, or both

5. [ ] **Implement entrance animations**
   - Use `<EntranceAnimation>` component from Phase 2
   - Supported: fade, slideUp, slideLeft, slideDown, slideRight, scale, typewriter
   - **Typewriter**: custom implementation
     - Reveal text character-by-character using CSS `clip-path` or `max-width`
     - Calculate duration based on text length
     - Use RAF for smooth animation

6. [ ] **Implement exit and loop modes**
   - **Exit**: Use `<ExitAnimation>` wrapper
   - Trigger after `exitafter` seconds using `setTimeout`
   - **Loop mode**:
     - State machine: ENTERING → VISIBLE → EXITING → HIDDEN → (repeat)
     - Timings: entrance (entrancespeed) → hold (hold) → exit (exitspeed) → pause (pause) → restart
     - Use `useEffect` with state transitions

7. [ ] **Create text route**
   - File: `src/routes/overlays/text.tsx`
   - Route: `/overlays/text`
   - Render `<TextOverlay />`
   - No layout

### Success Criteria:
- ✓ All 6 presets work identically to HTML version
- ✓ 30+ parameters functional
- ✓ Entrance/exit animations smooth with correct timing
- ✓ Loop mode cycles correctly with accurate hold/pause durations
- ✓ Typewriter effect reveals text character-by-character
- ✓ Signature lines render with all styles and animations
- ✓ URL parameter overrides work on top of presets

---

## PHASE 5: Validation & Initial Testing

**Goal**: Validate the architecture with border + text overlays before proceeding to remaining overlays

**Critical Files**:
- Test files for Phase 1-4 components
- Example URLs for testing

### Tasks (can be done in parallel):

- [ ] **Create unit tests for hooks**
  - File: `src/tests/hooks/useBrand.test.ts`
  - Test `useBrand()`, `useTheme()`, `useGradient()`, `useAccents()`
  - Verify theme switching, gradient resolution, custom colors
  - File: `src/tests/hooks/useOverlayParams.test.ts`
  - Test URL parameter parsing for all types (string, number, boolean, array)
  - Verify fallback chain: URL → default
  - Test type coercion edge cases

- [ ] **Create component tests**
  - File: `src/tests/components/BorderOverlay.test.tsx`
  - Test rendering with different shapes, styles, animations
  - Verify parameter parsing
  - File: `src/tests/components/TextOverlay.test.tsx`
  - Test preset resolution
  - Test entrance/exit animations
  - Test loop mode state machine

- [ ] **Manual testing with OBS**
  - Load border overlay in OBS Browser Source
  - Test URL parameter changes (modify URL, see live updates)
  - Verify transparency works correctly
  - Test all animation types at 60fps
  - Load text overlay with different presets
  - Test loop mode timing accuracy

- [ ] **Cross-browser testing**
  - Test in Chrome, Firefox, Safari
  - Verify animations render consistently
  - Check for any browser-specific CSS issues

- [ ] **Performance profiling**
  - Use Chrome DevTools Performance tab
  - Record 10-second animation cycle
  - Verify 60fps maintained (16.6ms per frame)
  - Check for memory leaks with RAF timers
  - Profile React re-renders (should be minimal)

- [ ] **Backward compatibility testing**
  - Create test URLs matching old HTML format
  - Verify all parameters still work with same values
  - Test edge cases (missing params, invalid values, special characters)

### Success Criteria:
- ✓ All unit tests pass
- ✓ Border and text overlays work perfectly in OBS
- ✓ 60fps animation performance maintained
- ✓ No memory leaks detected
- ✓ All old HTML URLs work with new React routes
- ✓ Architecture validated - ready to proceed with remaining overlays

---

## PHASE 6: Migrate Counter Overlay

**Goal**: Convert counter.html (400+ lines) to React with API polling support (25+ parameters)

**Critical Files**:
- [src/types/counter.types.ts](src/types/counter.types.ts) - NEW
- [src/components/overlays/CounterOverlay.tsx](src/components/overlays/CounterOverlay.tsx) - NEW
- [src/hooks/useAPIPolling.ts](src/hooks/useAPIPolling.ts) - NEW
- [src/hooks/useCountUp.ts](src/hooks/useCountUp.ts) - NEW
- [src/routes/overlays/counter.tsx](src/routes/overlays/counter.tsx) - NEW

**Reference**: [archive/counter.html](archive/counter.html)

### Tasks (sequential dependencies):

1. [ ] **Create counter parameter types**
   - File: `src/types/counter.types.ts`
   - Interface: `CounterOverlayParams` with 25+ parameters
   - Interface: `APIServiceConfig` for API integrations

2. [ ] **Create count-up animation hook**
   - File: `src/hooks/useCountUp.ts`
   - Hook: `useCountUp(target: number, duration: number)`
   - Returns current animated value
   - Uses RAF with cubic ease-out easing
   - Triggers animation when target changes

3. [ ] **Create API polling hook**
   - File: `src/hooks/useAPIPolling.ts`
   - Hook: `useAPIPolling({ service, config, interval })`
   - Support services: YouTube, Twitch, GitHub, custom
   - JSON path navigation with dot notation (e.g., `items.0.statistics.subscriberCount`)
   - Returns: `{ data, error, loading }`
   - Auto-cleanup on unmount

4. [ ] **Create CounterOverlay component**
   - File: `src/components/overlays/CounterOverlay.tsx`
   - Layout modes: `stack` (vertical), `inline` (horizontal)
   - Icon support: heart, star, users, eye, zap, fire, trophy, bell (use Lucide icons)
   - Number formatting: thousands separator, decimals, abbreviation (1.2K), notation (compact/scientific)
   - Use `useCountUp` for smooth number animation
   - Integrate `useAPIPolling` if service configured
   - Trend indicator: up/down arrow based on previous value

5. [ ] **Create counter route**
   - File: `src/routes/overlays/counter.tsx`
   - Route: `/overlays/counter`
   - Render `<CounterOverlay />`

### Success Criteria:
- ✓ Counter displays and animates numbers correctly
- ✓ API polling works for YouTube, Twitch, GitHub
- ✓ Number formatting matches HTML version exactly
- ✓ Count-up animation smooth with cubic easing
- ✓ Trend indicators update correctly
- ✓ All 25+ parameters functional

---

## PHASE 7: Migrate CTA Overlay

**Goal**: Convert cta.html (400+ lines) to React with presets and icon animations (30+ parameters)

**Critical Files**:
- [src/types/cta.types.ts](src/types/cta.types.ts) - NEW
- [src/config/cta-presets.ts](src/config/cta-presets.ts) - NEW
- [src/components/overlays/CTAOverlay.tsx](src/components/overlays/CTAOverlay.tsx) - NEW
- [src/routes/overlays/cta.tsx](src/routes/overlays/cta.tsx) - NEW

**Reference**: [archive/cta.html](archive/cta.html)

### Tasks (sequential dependencies):

1. [ ] **Create CTA parameter types**
   - File: `src/types/cta.types.ts`
   - Interface: `CTAOverlayParams` with 30+ parameters
   - Interface: `CTAPreset` for preset configurations

2. [ ] **Create preset system**
   - File: `src/config/cta-presets.ts`
   - Port presets: subscribe, like, follow, share, notify, custom
   - Include default text, subtitle, icon, icon animation per preset

3. [ ] **Create CTAOverlay component**
   - File: `src/components/overlays/CTAOverlay.tsx`
   - Resolve preset similar to text overlay
   - Icon + text layout with configurable position (left, right, top, bottom)
   - Background panel with blur
   - Gradient line decoration (optional)
   - Icon animations: bounce, shake, pulse, spin, wiggle, flip, heartbeat
   - Use CSS keyframe animations for icons

4. [ ] **Implement entrance animations**
   - Use `<EntranceAnimation>` wrapper
   - Supported: bounce, slideUp, slideLeft, slideRight, fade, scale, flipIn, zoomIn

5. [ ] **Implement loop and exit**
   - Loop mode: appear → hold → disappear → pause → repeat
   - Exit animations: fade, slideDown, slideLeft, slideRight, scale, flipOut
   - State machine similar to text overlay

6. [ ] **Create CTA route**
   - File: `src/routes/overlays/cta.tsx`
   - Route: `/overlays/cta`
   - Render `<CTAOverlay />`

### Success Criteria:
- ✓ All presets match HTML version
- ✓ Icon animations smooth and timed correctly
- ✓ Loop cycling works with accurate timing
- ✓ 30+ parameters functional
- ✓ Icon and text layouts flexible (4 positions)

---

## PHASE 8: Migrate Socials Overlay

**Goal**: Convert socials.html (400+ lines) to React with platform-specific styling (35+ parameters)

**Critical Files**:
- [src/types/socials.types.ts](src/types/socials.types.ts) - NEW
- [src/config/platform-icons.ts](src/config/platform-icons.ts) - NEW
- [src/components/overlays/SocialsOverlay.tsx](src/components/overlays/SocialsOverlay.tsx) - NEW
- [src/routes/overlays/socials.tsx](src/routes/overlays/socials.tsx) - NEW

**Reference**: [archive/socials.html](archive/socials.html)

### Tasks (sequential dependencies):

1. [ ] **Create socials parameter types**
   - File: `src/types/socials.types.ts`
   - Interface: `SocialsOverlayParams` with 35+ parameters
   - Interface: `PlatformConfig` for platform-specific data

2. [ ] **Create platform configuration**
   - File: `src/config/platform-icons.ts`
   - Platform data: GitHub, Twitter/X, LinkedIn, YouTube, Instagram, Twitch, Kick, Discord, Website
   - Each platform: brand color, handle prefix (@), SVG icon
   - Export as typed constant `PLATFORMS`

3. [ ] **Create SocialsOverlay component**
   - File: `src/components/overlays/SocialsOverlay.tsx`
   - Parse `show` param (comma-separated platforms)
   - Filter platforms from `PLATFORMS` config
   - Layout: horizontal (flex-row), vertical (flex-col)
   - Size presets: sm (20px), md (24px), lg (32px), xl (40px)
   - Show/hide text handles based on `showtext` param

4. [ ] **Implement icon color modes**
   - `brand`: use brand accent colors
   - `platform`: use platform-specific colors (PLATFORMS config)
   - `white`: white icons
   - `gradient`: apply brand gradient to icons

5. [ ] **Implement entrance animations**
   - `stagger`: sequential reveal with configurable delay between items
   - `fade`, `slideUp`: simultaneous entrance for all items
   - Use `<EntranceAnimation>` for each social item

6. [ ] **Implement advanced features**
   - **One-by-one mode**: Show one platform at a time, cycle through all
   - **Loop mode**: All appear → hold → all disappear → pause → repeat
   - **Exit animations**: fade, slideDown, slideUp
   - **Platform ordering**: custom priority via `priority` param
   - **Custom icons**: override platform icons via `icons` param

7. [ ] **Create socials route**
   - File: `src/routes/overlays/socials.tsx`
   - Route: `/overlays/socials`
   - Render `<SocialsOverlay />`

### Success Criteria:
- ✓ All 9 platforms render correctly with proper icons
- ✓ Icons match HTML version exactly
- ✓ Staggered entrance smooth with configurable delay
- ✓ One-by-one cycling works accurately
- ✓ 35+ parameters functional
- ✓ Handle overrides from URL work correctly

---

## PHASE 9: Dashboard & Configuration UI

**Goal**: Build interactive dashboard for easy overlay configuration without manual URL editing

**Critical Files**:
- [src/routes/index.tsx](src/routes/index.tsx) - Dashboard home
- [src/routes/configure/\_layout.tsx](src/routes/configure/_layout.tsx) - Configuration layout
- [src/routes/configure/border.tsx](src/routes/configure/border.tsx) - Border configurator
- [src/routes/configure/text.tsx](src/routes/configure/text.tsx) - Text configurator
- [src/components/forms/ParameterControl.tsx](src/components/forms/ParameterControl.tsx) - Dynamic form controls
- [src/components/preview/OverlayPreview.tsx](src/components/preview/OverlayPreview.tsx) - Live preview

### Tasks (can be done in parallel):

- [ ] **Create dashboard home page**
  - File: `src/routes/index.tsx`
  - Hero section with project description
  - Grid of cards linking to each overlay configurator
  - Quick start guide
  - Links to documentation (features.md)

- [ ] **Create configuration layout**
  - File: `src/routes/configure/_layout.tsx`
  - Two-column layout: form (left), preview (right)
  - Sticky preview that updates in real-time
  - Responsive: stack on mobile

- [ ] **Create overlay configurators**
  - File: `src/routes/configure/border.tsx` - Border overlay form
  - File: `src/routes/configure/text.tsx` - Text overlay form
  - File: `src/routes/configure/counter.tsx` - Counter overlay form
  - File: `src/routes/configure/cta.tsx` - CTA overlay form
  - File: `src/routes/configure/socials.tsx` - Socials overlay form
  - Each renders parameter form + live preview

- [ ] **Create dynamic parameter controls**
  - File: `src/components/forms/ParameterControl.tsx`
  - Auto-generate form inputs from parameter types
  - Input types: text, number, select (dropdown), checkbox, color picker, slider
  - Validation based on TypeScript types
  - Debounced updates to preview (300ms)

- [ ] **Create live preview component**
  - File: `src/components/preview/OverlayPreview.tsx`
  - Embedded `<iframe>` rendering actual overlay route
  - Real-time parameter updates via URL changes
  - Canvas mode toggle (1920x1080 grid visualization)
  - Resizable preview window

- [ ] **Create URL generator**
  - File: `src/components/configure/URLGenerator.tsx`
  - Generate complete OBS-ready URL from form state
  - Copy to clipboard button
  - Show only non-default parameters (clean URLs)
  - QR code generation for mobile preview (optional)

- [ ] **Create preset selector**
  - File: `src/components/configure/PresetSelector.tsx`
  - Visual cards for text/CTA presets with thumbnails
  - Click to load preset values into form
  - Save custom presets to localStorage
  - Import/export preset JSON

### Success Criteria:
- ✓ Dashboard provides intuitive visual way to configure overlays
- ✓ Live preview updates in real-time as parameters change
- ✓ URL generation accurate and includes all non-default params
- ✓ No need to manually write URL parameters
- ✓ Preset system makes common configurations one-click
- ✓ Mobile-responsive design

---

## PHASE 10: Final Testing & Deployment

**Goal**: Comprehensive testing, optimization, and production deployment to GitHub Pages

**Critical Files**:
- Test suites for all components
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- Updated [README.md](README.md)

### Tasks (sequential dependencies):

1. [ ] **Create comprehensive test suites**
   - Unit tests for all hooks (useBrand, useOverlayParams, useRAFAnimation, useCountUp, useAPIPolling)
   - Component tests for all overlays (border, text, counter, CTA, socials)
   - Integration tests for dashboard configurators
   - Test coverage target: >80%

2. [ ] **Performance testing and optimization**
   - Profile all overlay animations (target: 60fps)
   - Test with multiple overlays running simultaneously
   - Memory leak detection for RAF timers (cleanup verification)
   - React re-render optimization with React.memo and useMemo
   - Code splitting for routes (lazy loading)
   - Tree shaking verification (remove unused code)

3. [ ] **Cross-browser and OBS testing**
   - Test in Chrome, Firefox, Edge, Safari
   - Test in OBS Browser Source on Windows/Mac
   - Verify transparency and animations
   - Test with different OBS versions

4. [ ] **Backward compatibility verification**
   - Create test suite of old HTML URLs
   - Verify all parameters work identically in React version
   - Set up redirects if URL structure changed
   - Document any breaking changes

5. [ ] **Documentation updates**
   - Update [README.md](README.md) with new React architecture
   - Document all hooks and utilities with JSDoc
   - Create migration guide for users (old URLs → new URLs)
   - Update [features.md](features.md) with implementation status
   - Create API reference for all 140+ parameters

6. [ ] **Production build optimization**
   - Configure Vite for optimal production build
   - Enable minification and compression
   - Generate source maps for debugging
   - Optimize asset loading (preload critical resources)
   - Run Lighthouse audit (target: 90+ score)

7. [ ] **Deploy to GitHub Pages**
   - Verify GitHub Actions workflow (from Phase 0)
   - Test deployment to staging branch first
   - Deploy to production (gh-pages branch)
   - Verify all routes work with correct base path
   - Test from OBS Browser Source using live URL

8. [ ] **Post-deployment verification**
   - Test all 5 overlays from production URL
   - Verify dashboard works correctly
   - Test URL parameter parsing on production
   - Monitor for errors (check browser console)
   - Gather user feedback

### Success Criteria:
- ✓ All tests pass with >80% coverage
- ✓ 60fps animations maintained across all overlays
- ✓ Works in OBS Browser Source on multiple platforms
- ✓ All old HTML URLs work via redirects
- ✓ Documentation complete and accurate
- ✓ Lighthouse score 90+
- ✓ Successfully deployed to GitHub Pages
- ✓ All overlays functional from production URL
- ✓ No critical bugs or errors

---

## Verification Plan

After each phase, verify the following:

### Phase 0 - Cleanup
```bash
npm run build
# Should succeed with static assets in dist/
# No SSR dependencies in package.json
# No demo routes in src/routes/
```

### Phase 1 - Brand System
```typescript
// Test in any component
import { useBrand, useTheme, useOverlayParams } from '@/hooks';

const brand = useBrand();  // Should return typed BRAND_CONFIG
const theme = useTheme();  // Should return dark/light theme
const params = useOverlayParams({ size: 32 });  // Should parse URL
```

### Phase 2 - Shared Components
```tsx
<EntranceAnimation type="slideUp" delay={0.5}>
  <div>Test content</div>
</EntranceAnimation>
// Should animate on mount
```

### Phase 3 - Border Overlay
Visit: `http://localhost:5173/overlays/border?gradient=sunset&animation=rotate`
Expected: Animated rotating sunset gradient border

### Phase 4 - Text Overlay
Visit: `http://localhost:5173/overlays/text?preset=brb`
Expected: "Be Right Back" with scale entrance animation

### Phase 5 - Validation
Run: `npm test`
Load in OBS: All overlays should work with transparency

### Phases 6-8 - Remaining Overlays
Test each overlay route with various parameter combinations
Verify feature parity with original HTML versions

### Phase 9 - Dashboard
Visit: `http://localhost:5173/`
Expected: Configuration UI with live preview

### Phase 10 - Deployment
Visit: `https://[username].github.io/obs-toolkit/`
Expected: All overlays and dashboard accessible and functional

---

## Critical Implementation Notes

### TypeScript Strictness
- All parameters must have proper types (no `any`)
- Use union types for enums: `type Shape = 'rect' | 'circle'`
- Generic hooks for type inference: `useOverlayParams<T>(defaults: T): T`

### Animation Performance
- Use CSS transforms (GPU-accelerated): `translate`, `scale`, `rotate`
- Avoid animating `width`, `height`, `top`, `left` (CPU-bound)
- Clean up RAF timers in `useEffect` cleanup functions
- Use `React.memo` to prevent unnecessary re-renders

### URL Parameter Parsing
- Always provide fallback defaults
- Type coercion: `'true'` → `true`, `'42'` → `42`
- Comma-separated arrays: `'red,blue,green'` → `['red', 'blue', 'green']`
- URL decode text: `'Hello%20World'` → `'Hello World'`

### Brand Fallback Chain
```
URL Parameter → Preset Value → Default Value → Brand Config
```

### Memory Management
- Clean up RAF timers on unmount
- Clean up timeouts/intervals in `useEffect` cleanup
- Avoid creating functions in render (use `useCallback`)

### Backward Compatibility
- Preserve exact parameter names from HTML versions
- Maintain same default values
- Support all animation types with same names
- Keep URL structure consistent

---

## File Organization Summary

```
src/
├── components/
│   ├── animations/
│   │   ├── EntranceAnimation.tsx
│   │   └── ExitAnimation.tsx
│   ├── forms/
│   │   └── ParameterControl.tsx
│   ├── icons/
│   │   ├── Icon.tsx
│   │   └── icon-library.ts
│   ├── overlays/
│   │   ├── BorderOverlay.tsx
│   │   ├── TextOverlay.tsx
│   │   ├── CounterOverlay.tsx
│   │   ├── CTAOverlay.tsx
│   │   ├── SocialsOverlay.tsx
│   │   ├── OverlayContainer.tsx
│   │   └── OverlayPanel.tsx
│   ├── preview/
│   │   └── OverlayPreview.tsx
│   └── svg/
│       └── GradientDef.tsx
├── config/
│   ├── brand.config.ts
│   ├── text-presets.ts
│   ├── cta-presets.ts
│   └── platform-icons.ts
├── contexts/
│   └── BrandContext.tsx
├── hooks/
│   ├── useBrand.ts
│   ├── useOverlayParams.ts
│   ├── useRAFAnimation.ts
│   ├── useCountUp.ts
│   └── useAPIPolling.ts
├── routes/
│   ├── overlays/
│   │   ├── border.tsx
│   │   ├── text.tsx
│   │   ├── counter.tsx
│   │   ├── cta.tsx
│   │   └── socials.tsx
│   ├── configure/
│   │   ├── _layout.tsx
│   │   ├── border.tsx
│   │   ├── text.tsx
│   │   ├── counter.tsx
│   │   ├── cta.tsx
│   │   └── socials.tsx
│   ├── __root.tsx
│   └── index.tsx
├── types/
│   ├── brand.types.ts
│   ├── border.types.ts
│   ├── text.types.ts
│   ├── counter.types.ts
│   ├── cta.types.ts
│   └── socials.types.ts
└── utils/
    └── css.utils.ts
```

---

## Summary

This migration plan transforms 5,452 lines of vanilla HTML/CSS/JavaScript into a modern, maintainable React + TypeScript codebase while preserving all 140+ parameters and complex animations. The iterative approach (starting with 2 overlays) reduces risk and validates the architecture before full migration.

**Total Phases**: 10 (0-indexed: 0 through 10)
**Estimated Timeline**: 8-12 weeks for full completion
**First Milestone**: Phase 5 (border + text validated) - 3-4 weeks

Each phase builds on the previous, with clear success criteria and verification steps. The plan prioritizes reusable abstractions (hooks, components, utilities) to eliminate code duplication and improve long-term maintainability.
