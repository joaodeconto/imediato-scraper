import { load as loadHtml } from 'cheerio';
import { fetch } from 'undici';
import { scoreIcon } from './score-icon';

export interface IconCandidate {
  url: string;
  sizes?: string;
  type?: string;
  purpose?: string;
  score?: number;
}

interface ManifestIcon {
  src?: string;
  sizes?: string;
  type?: string;
  purpose?: string;
}

interface WebManifest {
  icons?: ManifestIcon[];
}

export function normalizeImageUrl(
  src: string,
  baseUrl: string,
): string | undefined {
  if (src.startsWith('wix:image://')) {
    const match = /^wix:image:\/\/v1\/([^/]+)\/([^#?]+).*/.exec(src);
    if (match) {
      return `https://static.wixstatic.com/media/${match[1]}/${match[2]}`;
    }
    return undefined;
  }
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
        const manRes = await fetch(manifestUrl, {
          headers: { accept: 'application/manifest+json,application/json' },
        });
        if (manRes.ok) {
          interface ManifestIcon {
            src: string;
            sizes?: string;
            type?: string;
            purpose?: string;
          }
          interface WebManifest {
            icons?: ManifestIcon[];
          }
          const manifest = (await manRes.json()) as WebManifest;
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

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text() || '');
      const logos: string[] = [];
      const walk = (obj: any) => {
        if (!obj) return;
        if (Array.isArray(obj)) return obj.forEach(walk);
        if (typeof obj === 'object') {
          if (obj['@type'] === 'Organization' && typeof obj.logo === 'string') {
            logos.push(obj.logo);
          }
          for (const value of Object.values(obj)) {
            if (typeof value === 'object') walk(value);
          }
        }
      };
      walk(data);
      if (logos.length) add({ url: logos[0] }, baseUrl);
    } catch {
      // ignore JSON-LD parse errors
    }
  });

  return candidates.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
