export interface IconCandidate {
  sizes?: string;
  type?: string;
  purpose?: string;
}

// Scores icon candidates based on their size and attributes.
// Defaults to assuming a 32px icon when no sizes are provided.
export function scoreIcon(icon: IconCandidate): number {
  let score = 0;

  if (icon.sizes) {
    const sizes = icon.sizes
      .split(/\s+/)
      .map(s => {
        const [w, h] = s.split('x').map(n => parseInt(n, 10));
        return Math.max(w || 0, h || 0);
      })
      .filter(n => !isNaN(n));
    score += sizes.length ? Math.max(...sizes) : 0;
  } else {
    score += 32; // assume a default 32px icon
  }

  if (icon.purpose?.includes('maskable')) score += 1000;
  if (icon.type === 'image/svg+xml') score += 500;
  return score;
}

