/**
 * Seeded Random Number Generator
 * Mulberry32 PRNG - deterministic random numbers from a seed.
 * Given the same seed, always produces the same sequence.
 */

export function createSeededRandom(seed: number): () => number {
  let state = seed | 0
  return function (): number {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seededFloat(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

export function seededInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}
