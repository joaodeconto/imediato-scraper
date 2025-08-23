import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureHtml = readFileSync(join(__dirname, 'fixtures/example.html'), 'utf8');

vi.mock('undici', () => ({
  fetch: async () =>
    new Response(fixtureHtml, {
      status: 200,
      headers: { 'content-type': 'text/html' }
    })
}));

import { scrape } from './index';

describe('scrape', () => {
  it('coleta meta básica do HTML de teste', async () => {
    const r = await scrape('https://example.com');
    expect(r.meta).toBeDefined();
    expect(r.meta.og?.title).toBe('Example OG');
    expect(r.diagnostics.timingsMs.fetch).toBeGreaterThanOrEqual(0);
  }, 20000);
});
