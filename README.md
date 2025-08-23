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

const res = await scrape('https://example.com', { depth: 'deep', locale: 'pt-BR' });
console.log(res.meta.og.title, pickBestImage(res.meta));
```

### Opções

- `depth`: `'fast' | 'deep'` — `'fast'` (padrão) ignora a busca por imagens de fallback; `'deep'` habilita essa busca.
- `locale`: `string` — define o cabeçalho `Accept-Language` para a requisição HTTP.

## Scripts
- `pnpm build` — build ESM/CJS + d.ts
- `pnpm test` — testes com Vitest
- `pnpm dev` — watch

## Licença
MIT
