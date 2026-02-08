/**
 * CTA Overlay Presets
 * Quick preset configurations for common call-to-action use cases
 */

import type { CTAPreset } from '../types/cta.types'
import type { CTAPresetName } from '../types/brand.types'

export const CTA_PRESETS: Record<CTAPresetName, CTAPreset> = {
  /**
   * Subscribe Preset
   * Encourage viewers to subscribe to your channel
   */
  subscribe: {
    text: 'Subscribe',
    sub: "Don't miss out!",
    icon: 'sub',
    iconanim: 'bounce',
  },

  /**
   * Like Preset
   * Ask viewers to like the stream/video
   */
  like: {
    text: 'Like this stream',
    sub: 'It helps a lot!',
    icon: 'like',
    iconanim: 'shake',
  },

  /**
   * Follow Preset
   * Encourage viewers to follow on social platforms
   */
  follow: {
    text: 'Follow',
    sub: 'Stay connected',
    icon: 'follow',
    iconanim: 'bounce',
  },

  /**
   * Share Preset
   * Ask viewers to share with friends
   */
  share: {
    text: 'Share with a friend',
    sub: '',
    icon: 'share',
    iconanim: 'spin',
  },

  /**
   * Notify Preset
   * Remind viewers to turn on notifications
   */
  notify: {
    text: 'Turn on notifications',
    sub: 'Never miss a stream',
    icon: 'bell',
    iconanim: 'shake',
  },

  /**
   * Custom Preset
   * No preset styling - full manual control
   */
  custom: {},
}
