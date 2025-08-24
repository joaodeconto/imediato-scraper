import { load as loadHtml } from 'cheerio';
import { fetch } from 'undici';
import type { Response } from 'undici';
import { extractBasic, extractFallbackImages, extractOg, extractTwitter } from './extract';
import type { ScrapeOptions, ScrapeResult } from '../types';
import { ScrapeError } from '../types';

export async function scrape(url: string, opts: ScrapeOptions = {}): Promise<ScrapeResult> {
  const start = Date.now();
  const timeout = opts.timeoutMs ?? 8000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const ua = opts.userAgent ?? 'imediato-scraper/0.1 (+https://example.com)';
  let res: Response;
  try {
    res = await fetch(url, { signal: controller.signal, headers: { 'user-agent': ua, accept: 'text/html,*/*' } });
  } catch (err) {
    throw new ScrapeError('NETWORK_ERROR', (err as Error).message);
  } finally {
    clearTimeout(timer);
  }
  const fetchMs = Date.now() - start;

  if (!res.ok) {
    throw new ScrapeError('HTTP_ERROR', `HTTP_${res.status}`);
  }

  let $;
  try {
    const html = await res.text();
    $ = loadHtml(html);
  } catch (err) {
    throw new ScrapeError('PARSE_ERROR', (err as Error).message);
  }

  const og = extractOg($);
  const twitter = extractTwitter($);
  const basic = extractBasic($);

  const depth = opts.depth ?? 'fast';
  const useFallbackImgs = depth !== 'fast' && !(og.image?.length) && !(twitter.image);
  const fallback = {
    images: useFallbackImgs ? extractFallbackImages($, res.url) : undefined
  };

  const srcMap: Record<'title' | 'description' | 'image', 'og' | 'twitter' | 'basic' | 'fallback' | 'none'> = {
    title: og.title ? 'og' : twitter.title ? 'twitter' : basic.title ? 'basic' : 'none',
    description: og.description ? 'og' : twitter.description ? 'twitter' : basic.description ? 'basic' : 'none',
    image: (og.image?.length ? 'og' : twitter.image ? 'twitter' : (fallback.images?.length ? 'fallback' : 'none')),
  };

  const warnings: string[] = [];
  if (!og.title && !twitter.title && !basic.title) warnings.push('Missing title');
  if (!(og.image?.length) && !twitter.image && !(fallback.images?.length)) warnings.push('Missing image candidates');

  return {
    meta: { og, twitter, basic, fallback },
    diagnostics: {
      source: srcMap,
      timingsMs: { fetch: fetchMs, parse: Date.now() - start - fetchMs },
      warnings
    }
  };
}
