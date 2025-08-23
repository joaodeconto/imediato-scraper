export type Depth = 'fast' | 'deep';

export interface ScrapeOptions {
  depth?: Depth;
  timeoutMs?: number;
  userAgent?: string;
  locale?: string;
}

export interface OgMeta {
  title?: string;
  description?: string;
  image?: string[];
  site_name?: string;
  type?: string;
  url?: string;
}

export interface TwitterMeta {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface BasicMeta {
  title?: string;
  description?: string;
  favicon?: string;
  canonical?: string;
}

export interface FallbackMeta {
  images?: string[];
}

export interface ScrapeResult {
  meta: {
    og: OgMeta;
    twitter: TwitterMeta;
    basic: BasicMeta;
    fallback: FallbackMeta;
  };
  diagnostics: {
    source: Record<string, 'og' | 'twitter' | 'basic' | 'fallback' | 'none'>;
    timingsMs: { fetch: number; parse: number };
    warnings: string[];
  };
}

export interface ScrapeError {
  error: { code: string; message: string };
}
