import { describe, it, expect } from 'vitest';
import { scrape } from './index';

describe('scrape', () => {
  it('coleta meta básica de example.com', async () => {
    const r = await scrape('https://example.com');
    expect(r.meta).toBeDefined();
    expect(r.diagnostics.timingsMs.fetch).toBeGreaterThanOrEqual(0);
  }, 20000);
});
