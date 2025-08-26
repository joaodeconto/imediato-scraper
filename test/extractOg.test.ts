import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { extractOg } from '../src/core/extract';

describe('extractOg', () => {
  it('collects og:image entries and filters empty values', () => {
    const html = `
      <html><head>
        <meta property="og:image" content="img1.png" />
        <meta property="og:image" content="" />
        <meta property="og:image" content="img2.png" />
      </head></html>`;
    const $ = load(html);
    const og = extractOg($);
    expect(og.image).toEqual(['img1.png', 'img2.png']);
  });
});

