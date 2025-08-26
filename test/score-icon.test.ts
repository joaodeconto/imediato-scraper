import { describe, it, expect } from 'vitest';
import { scoreIcon } from '../src';

describe('scoreIcon', () => {
  it('uses provided sizes when scoring', () => {
    // icon exactly at target size should score highest (1)
    expect(scoreIcon({ sizes: [32] })).toBe(1);
  });

  it('defaults to 32px when no sizes are provided', () => {
    // without sizes, we assume 32px which yields same score as a 32px icon
    expect(scoreIcon({})).toBe(1);
  });
});
