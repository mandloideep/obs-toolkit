/**
 * Reusable Zod Validators
 * Common validation schemas used across overlay configurators
 */

import { z } from 'zod'

/**
 * Hex color validator (without # prefix)
 * Accepts 6-character hex strings or empty string
 */
export const hexColorValidator = z
  .string()
  .regex(/^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'Invalid hex color (e.g., FF0000 or FF000080)')
  .or(z.literal(''))

/**
 * CSS value validator
 * Accepts common CSS units: px, %, em, rem, vh, vw, or auto
 */
export const cssValueValidator = z
  .string()
  .regex(/^(auto|\d+(px|%|em|rem|vh|vw))$/, 'Invalid CSS value (e.g., 100px, 50%, auto)')

/**
 * Range validator factory
 * Creates a number validator with min/max constraints
 */
export function rangeValidator(min: number, max: number, unit?: string) {
  const unitStr = unit ? ` ${unit}` : ''
  return z
    .number()
    .min(min, `Value must be at least ${min}${unitStr}`)
    .max(max, `Value must be at most ${max}${unitStr}`)
}

/**
 * Positive number validator
 * Must be greater than 0
 */
export const positiveNumber = z.number().min(0, 'Must be a positive number')

/**
 * Opacity validator
 * Must be between 0 and 1
 */
export const opacityValidator = rangeValidator(0, 1)

/**
 * Percentage validator
 * Must be between 0 and 100
 */
export const percentageValidator = rangeValidator(0, 100, '%')

/**
 * Color array validator
 * Array of hex colors (without # prefix) with max length
 */
export function colorArrayValidator(maxColors: number = 5) {
  return z
    .array(z.string().regex(/^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'Invalid hex color'))
    .max(maxColors, `Maximum ${maxColors} colors allowed`)
}

/**
 * Non-empty string validator
 * Optional: can be empty but defaults to error message if not
 */
export const nonEmptyString = z.string().min(1, 'This field is required')

/**
 * URL validator
 * Validates proper URL format
 */
export const urlValidator = z.string().url('Invalid URL format')

/**
 * API key validators for different services
 */
export const apiKeyValidators = {
  youtube: z.string().regex(
    /^AIza[0-9A-Za-z-_]{35}$/,
    'Invalid YouTube API key format (should start with AIza)'
  ),
  github: z.string().regex(
    /^(ghp|github_pat)_[a-zA-Z0-9]{36,}$/,
    'Invalid GitHub API key format (should start with ghp_ or github_pat_)'
  ),
  twitch: z.string().min(30, 'Twitch Client ID should be at least 30 characters'),
  custom: z.string(), // No validation for custom
}

/**
 * Font family validator
 * Validates CSS font-family string
 */
export const fontFamilyValidator = z.string()

/**
 * Comma-separated string validator
 * Validates comma-separated values
 */
export const commaSeparatedValidator = z.string()
