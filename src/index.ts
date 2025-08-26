import type { ScrapeResult } from './types';
import { pickIcons, normalizeImageUrl } from './iconPicker';

export * from './types';
export { scrape } from './core/scrape';
export { scoreIcon } from './score-icon';
export { pickIcons, normalizeImageUrl };

export async function iconPicker(url: string) {
  const [first] = await pickIcons(url);
  return first?.url;
}

export function pickBestImage(meta: ScrapeResult['meta']) {
  return meta.og?.image?.[0] || meta.twitter?.image || meta.fallback?.images?.[0];
}
