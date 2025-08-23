import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { extractBasic, extractFallbackImages } from './extract';

describe('extractBasic', () => {
  it('resolves relative favicon and canonical URLs', () => {
    const html = `
      <html><head>
        <title>t</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="/article" />
      </head></html>
    `;
    const $ = load(html);
    const res = extractBasic($, 'https://example.com/path/page');
    expect(res.favicon).toBe('https://example.com/favicon.ico');
    expect(res.canonical).toBe('https://example.com/article');
  });
});

describe('extractFallbackImages', () => {
  it('resolves relative image sources', () => {
    const html = `
      <img src="/a.png" />
      <img src="b.jpg" />
    `;
    const $ = load(html);
    const imgs = extractFallbackImages($, 'https://example.com/blog/');
    expect(imgs).toContain('https://example.com/a.png');
    expect(imgs).toContain('https://example.com/blog/b.jpg');
  });
});

