import { describe, it, expect } from 'vitest';
import { createServer } from 'http';
import { scrape } from './index';

function startServer(handler: Parameters<typeof createServer>[0]): Promise<{ url: string; close: () => Promise<void> }> {
  const server = createServer(handler);
  return new Promise((resolve) => {
    server.listen(0, () => {
      const { port } = server.address() as any;
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((r) => server.close(() => r())),
      });
    });
  });
}

describe('scrape', () => {
  it('extracts basic meta', async () => {
    const html = '<html><head><title>Test</title><meta name="description" content="desc"></head><body></body></html>';
    const server = await startServer((_, res) => res.end(html));
    const res = await scrape(server.url);
    expect(res.meta.basic.title).toBe('Test');
    expect(res.diagnostics.timingsMs.fetch).toBeGreaterThanOrEqual(0);
    await server.close();
  });

  it('respects depth option', async () => {
    const html = '<html><head><title>Test</title></head><body><img src="a.jpg"></body></html>';
    const server = await startServer((_, res) => res.end(html));
    const fast = await scrape(server.url, { depth: 'fast' });
    expect(fast.meta.fallback.images).toBeUndefined();
    const deep = await scrape(server.url, { depth: 'deep' });
    expect(deep.meta.fallback.images).toEqual([`${server.url}/a.jpg`]);
    await server.close();
  });

  it('sends accept-language header', async () => {
    let language: string | undefined;
    const html = '<html><head><title>Test</title></head></html>';
    const server = await startServer((req, res) => {
      language = req.headers['accept-language'] as string | undefined;
      res.end(html);
    });
    await scrape(server.url, { locale: 'pt-BR' });
    expect(language).toBe('pt-BR');
    await server.close();
  });
});
