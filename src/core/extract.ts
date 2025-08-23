import * as cheerio from 'cheerio';

export function extractOg($: cheerio.CheerioAPI) {
  const pickAll = (prop: string) => $(`meta[property="${prop}"]`).map((_, el) => $(el).attr('content') || '').get().filter(Boolean);
  const pickOne = (prop: string) => $(`meta[property="${prop}"]`).attr('content') || undefined;

  const images = pickAll('og:image');
  return {
    title: pickOne('og:title'),
    description: pickOne('og:description'),
    image: images.length ? images : undefined,
    site_name: pickOne('og:site_name'),
    type: pickOne('og:type'),
    url: pickOne('og:url'),
  };
}

export function extractTwitter($: cheerio.CheerioAPI) {
  const pick = (name: string) => $(`meta[name="${name}"]`).attr('content') || undefined;
  return {
    card: pick('twitter:card'),
    title: pick('twitter:title'),
    description: pick('twitter:description'),
    image: pick('twitter:image') || pick('twitter:image:src'),
  };
}

export function extractBasic($: cheerio.CheerioAPI) {
  const title = $('title').first().text() || undefined;
  const description = $(`meta[name="description"]`).attr('content') || undefined;
  const favicon = $(`link[rel="icon"]`).attr('href') || $(`link[rel="shortcut icon"]`).attr('href') || undefined;
  const canonical = $(`link[rel="canonical"]`).attr('href') || undefined;
  return { title, description, favicon, canonical };
}

export function extractFallbackImages($: cheerio.CheerioAPI, baseUrl: string) {
  const imgs = new Set<string>();
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (!src) return;
    try {
      const full = new URL(src, baseUrl).toString();
      imgs.add(full);
    } catch {}
  });
  return Array.from(imgs).slice(0, 8);
}
