export interface IconCandidate {
  sizes?: number[];
}

// Scores icon candidates based on closeness to a target size.
// Defaults to assuming a 32px icon when no sizes are provided.
export function scoreIcon(c: IconCandidate, target = 32): number {
  const best = c.sizes?.[0] ?? 32;
  return 1 / (1 + Math.abs(best - target));
}
