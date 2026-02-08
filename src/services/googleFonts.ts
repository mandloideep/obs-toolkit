/**
 * Google Fonts API Service
 *
 * IMPORTANT: This service is ONLY used in configurator files.
 * DO NOT import this in overlay files - overlays must stay minimal for OBS performance.
 */

export interface GoogleFont {
  family: string
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace'
  variants: string[]
  subsets: string[]
  version?: string
  lastModified?: string
  files?: Record<string, string>
}

interface FontsCache {
  timestamp: number
  fonts: GoogleFont[]
  version: number
}

class GoogleFontsService {
  private static CACHE_KEY = 'obs-google-fonts-cache-v1'
  private static CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

  /**
   * Static list of popular Google Fonts
   * Top 200 fonts sorted by popularity - no API call needed
   */
  private static POPULAR_FONTS: GoogleFont[] = [
    // Sans Serif (Most Popular)
    { family: 'Roboto', category: 'sans-serif', variants: ['300', '400', '500', '700', '900'], subsets: ['latin'] },
    { family: 'Open Sans', category: 'sans-serif', variants: ['300', '400', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Lato', category: 'sans-serif', variants: ['300', '400', '700', '900'], subsets: ['latin'] },
    { family: 'Montserrat', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Poppins', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Raleway', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Ubuntu', category: 'sans-serif', variants: ['300', '400', '500', '700'], subsets: ['latin'] },
    { family: 'Nunito', category: 'sans-serif', variants: ['300', '400', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Work Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Inter', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Rubik', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Noto Sans', category: 'sans-serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'PT Sans', category: 'sans-serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Source Sans Pro', category: 'sans-serif', variants: ['300', '400', '600', '700', '900'], subsets: ['latin'] },
    { family: 'Oswald', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Mukta', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Quicksand', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Barlow', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Karla', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Outfit', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Hind', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'DM Sans', category: 'sans-serif', variants: ['400', '500', '700'], subsets: ['latin'] },
    { family: 'Manrope', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Josefin Sans', category: 'sans-serif', variants: ['300', '400', '600', '700'], subsets: ['latin'] },
    { family: 'Bebas Neue', category: 'sans-serif', variants: ['400'], subsets: ['latin'] },
    { family: 'Anton', category: 'sans-serif', variants: ['400'], subsets: ['latin'] },
    { family: 'Archivo', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Mulish', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Oxygen', category: 'sans-serif', variants: ['300', '400', '700'], subsets: ['latin'] },
    { family: 'Fira Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },

    // Serif
    { family: 'Playfair Display', category: 'serif', variants: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Merriweather', category: 'serif', variants: ['300', '400', '700', '900'], subsets: ['latin'] },
    { family: 'Lora', category: 'serif', variants: ['400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'PT Serif', category: 'serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Crimson Text', category: 'serif', variants: ['400', '600', '700'], subsets: ['latin'] },
    { family: 'Libre Baskerville', category: 'serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'EB Garamond', category: 'serif', variants: ['400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Cormorant Garamond', category: 'serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Bitter', category: 'serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Zilla Slab', category: 'serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Alegreya', category: 'serif', variants: ['400', '500', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Spectral', category: 'serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Cardo', category: 'serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Noto Serif', category: 'serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Old Standard TT', category: 'serif', variants: ['400', '700'], subsets: ['latin'] },

    // Display
    { family: 'Righteous', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Fredoka', category: 'display', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Architects Daughter', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Pacifico', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Permanent Marker', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Lobster', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Abril Fatface', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Alfa Slab One', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Bungee', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Kalam', category: 'display', variants: ['300', '400', '700'], subsets: ['latin'] },
    { family: 'Bangers', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Titan One', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Shadows Into Light', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Cabin Sketch', category: 'display', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Changa', category: 'display', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },

    // Monospace
    { family: 'Roboto Mono', category: 'monospace', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Source Code Pro', category: 'monospace', variants: ['300', '400', '500', '600', '700', '900'], subsets: ['latin'] },
    { family: 'JetBrains Mono', category: 'monospace', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Fira Code', category: 'monospace', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'IBM Plex Mono', category: 'monospace', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Space Mono', category: 'monospace', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Inconsolata', category: 'monospace', variants: ['300', '400', '500', '600', '700', '900'], subsets: ['latin'] },
    { family: 'Courier Prime', category: 'monospace', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Ubuntu Mono', category: 'monospace', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Overpass Mono', category: 'monospace', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },

    // Handwriting
    { family: 'Dancing Script', category: 'handwriting', variants: ['400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Caveat', category: 'handwriting', variants: ['400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Satisfy', category: 'handwriting', variants: ['400'], subsets: ['latin'] },
    { family: 'Cookie', category: 'handwriting', variants: ['400'], subsets: ['latin'] },
    { family: 'Great Vibes', category: 'handwriting', variants: ['400'], subsets: ['latin'] },
    { family: 'Allura', category: 'handwriting', variants: ['400'], subsets: ['latin'] },
    { family: 'Sacramento', category: 'handwriting', variants: ['400'], subsets: ['latin'] },
    { family: 'Amatic SC', category: 'handwriting', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Indie Flower', category: 'handwriting', variants: ['400'], subsets: ['latin'] },
    { family: 'Patrick Hand', category: 'handwriting', variants: ['400'], subsets: ['latin'] },

    // Additional Popular Sans Serif
    { family: 'Heebo', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Lexend', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Red Hat Display', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Exo 2', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Titillium Web', category: 'sans-serif', variants: ['300', '400', '600', '700', '900'], subsets: ['latin'] },
    { family: 'Abel', category: 'sans-serif', variants: ['400'], subsets: ['latin'] },
    { family: 'Fjalla One', category: 'sans-serif', variants: ['400'], subsets: ['latin'] },
    { family: 'Yantramanav', category: 'sans-serif', variants: ['300', '400', '500', '700', '900'], subsets: ['latin'] },
    { family: 'Cabin', category: 'sans-serif', variants: ['400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Comfortaa', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Teko', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Prompt', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Sora', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Urbanist', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Space Grotesk', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
    { family: 'Plus Jakarta Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Assistant', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] },
    { family: 'Commissioner', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Public Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] },
    { family: 'Varela Round', category: 'sans-serif', variants: ['400'], subsets: ['latin'] },
  ]

  /**
   * Get Google Fonts list
   * Returns static list immediately - no API call, no CORS issues
   */
  async fetchFonts(): Promise<GoogleFont[]> {
    console.log('[GoogleFonts] Loading static font list:', GoogleFontsService.POPULAR_FONTS.length, 'fonts')
    return GoogleFontsService.POPULAR_FONTS
  }

  /**
   * Get cached fonts from localStorage
   * Returns null if cache doesn't exist or is expired
   */
  getCachedFonts(): GoogleFont[] | null {
    try {
      const cached = localStorage.getItem(GoogleFontsService.CACHE_KEY)
      if (!cached) return null

      const { timestamp, fonts }: FontsCache = JSON.parse(cached)

      // Check if cache is expired
      const isExpired = Date.now() - timestamp > GoogleFontsService.CACHE_DURATION
      if (isExpired) {
        console.log('[GoogleFonts] Cache expired, clearing...')
        this.clearCache()
        return null
      }

      return fonts
    } catch (error) {
      console.error('[GoogleFonts] Failed to read cache:', error)
      this.clearCache()
      return null
    }
  }

  /**
   * Cache fonts in localStorage
   */
  cacheFonts(fonts: GoogleFont[]): void {
    try {
      const cache: FontsCache = {
        timestamp: Date.now(),
        fonts,
        version: 1
      }

      localStorage.setItem(GoogleFontsService.CACHE_KEY, JSON.stringify(cache))
      console.log('[GoogleFonts] Cached', fonts.length, 'fonts')
    } catch (error) {
      console.error('[GoogleFonts] Failed to cache fonts:', error)
      // If localStorage is full or unavailable, continue without caching
    }
  }

  /**
   * Clear font cache
   * Useful for testing or forcing a refresh
   */
  clearCache(): void {
    try {
      localStorage.removeItem(GoogleFontsService.CACHE_KEY)
      console.log('[GoogleFonts] Cache cleared')
    } catch (error) {
      console.error('[GoogleFonts] Failed to clear cache:', error)
    }
  }

  /**
   * Get category fallback for CSS font-family
   */
  getCategoryFallback(category: string): string {
    switch (category) {
      case 'serif':
        return 'serif'
      case 'sans-serif':
        return 'sans-serif'
      case 'display':
        return 'cursive'
      case 'handwriting':
        return 'cursive'
      case 'monospace':
        return 'monospace'
      default:
        return 'sans-serif'
    }
  }
}

export const googleFontsService = new GoogleFontsService()
