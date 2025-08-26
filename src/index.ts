import type { ScrapeResult } from './types';

export * from './types';
export { scrape } from './core/scrape';
export { pickIcons } from './iconPicker';

export function pickBestImage(meta: ScrapeResult['meta']) {
  return meta.og?.image?.[0] || meta.twitter?.image || meta.fallback?.images?.[0];
}
