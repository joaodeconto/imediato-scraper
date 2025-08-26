import { describe, it, expect } from 'vitest';
import { scoreIcon } from '../src';

describe('scoreIcon', () => {
  it('uses provided sizes when scoring', () => {
    expect(scoreIcon({ sizes: '64x64' })).toBeGreaterThan(
      scoreIcon({ sizes: '32x32' }),
    );
  });

  it('defaults to 32px when no sizes are provided', () => {
    expect(scoreIcon({})).toBe(scoreIcon({ sizes: '32x32' }));
  });
});
