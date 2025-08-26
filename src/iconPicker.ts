import { load as loadHtml } from 'cheerio';
import { fetch } from 'undici';

export interface IconCandidate {
  url: string;
  sizes?: string;
  type?: string;
  purpose?: string;
  score?: number;
}

export function normalizeImageUrl(src: string, baseUrl: string): string | undefined {
  try {
    const url = new URL(src, baseUrl);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    // ignore invalid URLs
  }
  return undefined;
}

export function scoreIcon(icon: IconCandidate): number {
  let score = 0;
  if (icon.sizes) {
    const sizes = icon.sizes
      .split(/\s+/)
      .map(s => {
        const [w, h] = s.split('x').map(n => parseInt(n, 10));
        return Math.max(w || 0, h || 0);
      })
      .filter(n => !isNaN(n));
    const maxSize = sizes.length ? Math.max(...sizes) : 0;
    score += maxSize;
  }
  if (icon.purpose?.includes('maskable')) score += 1000;
  if (icon.type === 'image/svg+xml') score += 500;
  return score;
}

export async function pickIcons(url: string): Promise<IconCandidate[]> {
  const res = await fetch(url, { headers: { accept: 'text/html,*/*' } });
  if (!res.ok) return [];
  const html = await res.text();
  const $ = loadHtml(html);
  const baseUrl = res.url;

  const candidates: IconCandidate[] = [];

  const add = (c: IconCandidate, base = baseUrl) => {
    const normalized = normalizeImageUrl(c.url, base);
    if (!normalized) return;
    c.url = normalized;
    c.score = scoreIcon(c);
    candidates.push(c);
  };

  $('link[rel~="icon"]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    add({ url: href, sizes: $(el).attr('sizes'), type: $(el).attr('type') || undefined });
  });

  const manifestHref = $('link[rel="manifest"]').attr('href');
  if (manifestHref) {
    const manifestUrl = normalizeImageUrl(manifestHref, baseUrl);
    if (manifestUrl) {
      try {
        const manRes = await fetch(manifestUrl, { headers: { accept: 'application/manifest+json,application/json' } });
        if (manRes.ok) {
          const manifest = await manRes.json();
          if (Array.isArray(manifest.icons)) {
            for (const icon of manifest.icons) {
              if (!icon.src) continue;
              add(
                { url: icon.src, sizes: icon.sizes, type: icon.type, purpose: icon.purpose },
                manifestUrl,
              );
            }
          }
        }
      } catch {
        // ignore manifest fetch errors
      }
    }
  }

  return candidates.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
