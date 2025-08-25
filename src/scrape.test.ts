import { describe, it, expect } from 'vitest';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { scrape } from './index';

// Test that fallback images are resolved against the final URL after redirects
// to ensure relative image paths are correct even when the initial URL redirects.
describe('scrape', () => {
  it('uses final URL when resolving fallback images', async () => {
    const server = createServer((req, res) => {
      if (req.url === '/start') {
        res.writeHead(302, { Location: '/new/index.html' });
        res.end();
      } else if (req.url === '/new/index.html') {
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><img src="image.png" /></body></html>');
      } else {
        res.statusCode = 404;
        res.end();
      }
    });

    await new Promise<void>(resolve => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const result = await scrape(`http://localhost:${port}/start`, { depth: 'deep' });
    server.close();

    expect(result.meta.fallback.images).toEqual([
      `http://localhost:${port}/new/image.png`
    ]);
  });
});
