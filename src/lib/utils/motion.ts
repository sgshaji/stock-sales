
// Motion Guidelines - Standardized animation durations
export const MOTION_DURATION = {
  FAST: 120,
  BASE: 240, 
  SLOW: 400
} as const;

// Export individual constants for convenience
export const { FAST, BASE, SLOW } = MOTION_DURATION;

// Utility function to get duration in ms format for CSS
export const getDuration = (duration: keyof typeof MOTION_DURATION) => `${MOTION_DURATION[duration]}ms`;
