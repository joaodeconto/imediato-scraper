# @odeconto/scraper

Scraper de Open Graph / Twitter Cards com normalização.

## Instalação
```bash
pnpm add @odeconto/scraper
# ou npm i @odeconto/scraper
```

## Uso
```ts
import { scrape, pickBestImage } from '@odeconto/scraper';

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
