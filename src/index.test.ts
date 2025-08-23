import { describe, it, expect } from 'vitest';
import { createServer } from 'http';
import { scrape } from './index';

describe('scrape', () => {
  it('coleta meta básica de página local', async () => {
    const html = `<!doctype html><html><head><title>Hello</title><meta name="description" content="desc"><link rel="icon" href="/favicon.ico"><link rel="canonical" href="/canon"></head><body></body></html>`;
    const server = createServer((_, res) => {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(html);
    });
    await new Promise(resolve => server.listen(0, resolve));
    const { port } = server.address() as any;
    const url = `http://127.0.0.1:${port}/path/page`;
    const r = await scrape(url);
    server.close();
    expect(r.meta.basic.favicon).toBe(`http://127.0.0.1:${port}/favicon.ico`);
    expect(r.meta.basic.canonical).toBe(`http://127.0.0.1:${port}/canon`);
    expect(r.diagnostics.timingsMs.fetch).toBeGreaterThanOrEqual(0);
  }, 20000);
});
