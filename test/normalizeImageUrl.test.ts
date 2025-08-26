import { describe, it, expect } from 'vitest';
import { normalizeImageUrl } from '../src/index';

describe('normalizeImageUrl', () => {
  it('handles wix:image scheme', () => {
    const raw = 'wix:image://v1/abc123/file.png#originWidth=100';
    const normalized = normalizeImageUrl(raw, 'https://example.com');
    expect(normalized).toBe('https://static.wixstatic.com/media/abc123/file.png');
  });

  it('resolves relative URLs against base', () => {
    const raw = './images/pic.jpg';
    const normalized = normalizeImageUrl(raw, 'https://example.com/posts/page.html');
    expect(normalized).toBe('https://example.com/posts/images/pic.jpg');
  });

  it('normalizes protocol-relative URLs', () => {
    const raw = '//cdn.example.com/image.png';
    const normalized = normalizeImageUrl(raw, 'https://example.com');
    expect(normalized).toBe('https://cdn.example.com/image.png');
  });
});
