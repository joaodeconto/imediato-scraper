# @odeconto/scraper

Biblioteca Node.js para extrair e normalizar metadados (Open Graph, Twitter Cards e informações básicas) de páginas web.

## Recursos

- Extração unificada de metadados Open Graph, Twitter e básicos.
- Busca opcional por imagens de fallback quando os metadados não estão presentes.
- Função auxiliar `pickBestImage` para escolher a imagem mais relevante.
- Retorno inclui diagnósticos com origem dos dados e tempos de execução.

## Requisitos

- Node.js >= 18.17.

## Instalação

```bash
pnpm add @odeconto/scraper
# ou
npm install @odeconto/scraper
```

## Uso básico

```ts
import { scrape, pickBestImage } from '@odeconto/scraper';

const result = await scrape('https://example.com');
console.log(result.meta.og.title);
console.log('Imagem principal:', pickBestImage(result.meta));
```

## Opções

- `depth`: `'fast' | 'deep'` — `'fast'` (padrão) ignora a busca por imagens de fallback; `'deep'` habilita essa busca.
- `timeoutMs`: `number` — tempo máximo para a requisição (8s por padrão).
- `userAgent`: `string` — define o cabeçalho `User-Agent` usado na requisição.
- `locale`: `string` — define o cabeçalho `Accept-Language` para a requisição HTTP.

## Erros

A função `scrape` pode lançar `ScrapeError` com os códigos:

- `NETWORK_ERROR` — falha de rede ou timeout.
- `HTTP_ERROR` — código de status HTTP diferente de 2xx.
- `PARSE_ERROR` — erro ao interpretar o HTML retornado.

## Scripts de desenvolvimento

- `pnpm lint` — executa o ESLint.
- `pnpm build` — gera os bundles ESM/CJS e os arquivos de tipos.
- `pnpm dev` — modo watch do build.

## Licença

MIT
