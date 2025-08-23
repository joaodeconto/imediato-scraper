# @imediato/scraper

Scraper de Open Graph / Twitter Cards com normalização.

## Instalação
```bash
pnpm add @imediato/scraper
# ou npm i @imediato/scraper
```

## Uso
```ts
import { scrape, pickBestImage } from '@imediato/scraper';

const res = await scrape('https://example.com', { depth: 'deep' });
console.log(res.meta.og.title, pickBestImage(res.meta));
```

## Scripts
- `pnpm build` — build ESM/CJS + d.ts
- `pnpm test` — testes com Vitest
- `pnpm dev` — watch

## Licença
MIT
