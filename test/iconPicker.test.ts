import { describe, it, expect } from 'vitest';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { iconPicker } from '../src/index';

describe('iconPicker', () => {
  it('prioritizes link icons with sizes', async () => {
    const server = createServer((req, res) => {
      if (req.url === '/page') {
        res.setHeader('Content-Type', 'text/html');
        res.end(
          `<html><head>
            <link rel="icon" href="/default.png" />
            <link rel="icon" sizes="192x192" href="/big.png" />
          </head><body></body></html>`
        );
      } else {
        res.statusCode = 200;
        res.end();
      }
    });

    await new Promise<void>(resolve => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const icon = await iconPicker(`http://localhost:${port}/page`);
    server.close();

    expect(icon).toBe(`http://localhost:${port}/big.png`);
  });

  it('uses largest icon from manifest', async () => {
    const server = createServer((req, res) => {
      if (req.url === '/page') {
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><head><link rel="manifest" href="/manifest.json" /></head></html>');
      } else if (req.url === '/manifest.json') {
        res.setHeader('Content-Type', 'application/manifest+json');
        res.end(JSON.stringify({
          icons: [
            { src: '/48.png', sizes: '48x48' },
            { src: '/192.png', sizes: '192x192' }
          ]
        }));
      } else {
        res.statusCode = 200;
        res.end();
      }
    });

    await new Promise<void>(resolve => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const icon = await iconPicker(`http://localhost:${port}/page`);
    server.close();

    expect(icon).toBe(`http://localhost:${port}/192.png`);
  });

  it('falls back to Organization.logo in JSON-LD', async () => {
    const server = createServer((req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.end(
        `<html><head></head><body>
          <script type="application/ld+json">
            {"@context":"https://schema.org","@type":"Organization","logo":"/logo.png"}
          </script>
        </body></html>`
      );
    });

    await new Promise<void>(resolve => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const icon = await iconPicker(`http://localhost:${port}/`);
    server.close();

    expect(icon).toBe(`http://localhost:${port}/logo.png`);
  });
});
