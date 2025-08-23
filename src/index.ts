export * from './types';
export { scrape } from './core/scrape';

export function pickBestImage(meta: { og?: { image?: string[] }, twitter?: { image?: string }, fallback?: { images?: string[] } }) {
  return meta.og?.image?.[0] || meta.twitter?.image || meta.fallback?.images?.[0];
}
