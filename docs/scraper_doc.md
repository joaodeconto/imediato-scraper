# OGScraper — Dev Spec & API

Um módulo independente para coleta de **Open Graph e Twitter Cards** de URLs, com foco em **modularidade**.  
Pode rodar como **API REST**, **SDK NPM** ou **Web Component**, sendo pluggable em outros apps além do OGGenerator.

---

## 1) Objetivo

- Extrair metadados OG/Twitter/básicos de qualquer página.  
- Pré-preencher editores (como OGGenerator) com título, descrição, imagem e favicon.  
- Fornecer fallback inteligente quando não houver OG tags.  
- Servir como validador de compatibilidade entre plataformas sociais.

---

## 2) Fluxo do Usuário

1. Usuário cola uma URL no app.  
2. O front chama `POST /api/scrape` com `{ url, depth }`.  
3. Serviço busca e parseia a página.  
4. Resposta retorna:
   - OG tags
   - Twitter tags
   - Básico (`<title>`, `<meta name="description">`, `<link rel="icon">`)
   - Fallbacks (primeiras imagens relevantes)  
5. App pré-preenche os campos e mostra preview.  
6. Usuário ajusta e exporta.

---

## 3) API Contract

### Endpoint
`POST /api/scrape`

### Request
```json
{
  "url": "https://example.com/article",
  "depth": "fast|deep",
  "timeoutMs": 8000,
  "locale": "pt-BR"
}
Response
json
Copiar
Editar
{
  "meta": {
    "og": {
      "title": "...",
      "description": "...",
      "image": ["https://.../og.png"],
      "site_name": "...",
      "url": "https://..."
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "...",
      "description": "...",
      "image": "..."
    },
    "basic": {
      "title": "...",
      "description": "...",
      "favicon": "https://.../favicon.ico",
      "canonical": "https://.../article"
    },
    "fallback": {
      "images": ["https://.../cover.jpg", "https://.../hero.png"]
    }
  },
  "diagnostics": {
    "source": { "title": "og", "description": "twitter", "image": "og" },
    "timingsMs": { "fetch": 220, "parse": 40 },
    "warnings": ["Missing og:site_name"]
  }
}
Erros Padronizados
json
Copiar
Editar
{ "error": { "code": "URL_INVALID", "message": "URL mal formatada" } }
{ "error": { "code": "FETCH_TIMEOUT", "message": "Site demorou a responder" } }
{ "error": { "code": "NO_META_FOUND", "message": "Não foram encontrados OG/Twitter tags" } }
```
---

## 4) Arquitetura

### Core: scrape(url, options) → retorna JSON.

### Adapters:

- HTTP: fetch / undici

- Parser: cheerio

- Cache: Redis (opcional)

- nFacades:

- REST API (/api/scrape)

- SDK NPM @oggen/scraper

- Web Component <og-scraper>

---

## 5) SDK NPM
ts
Copiar
Editar
import { scrape } from "@oggen/scraper";

const result = await scrape("https://exemplo.com", { depth: "deep" });
console.log(result.meta.og.title);
Extras:

scoreMeta(meta) → retorna diagnóstico de compatibilidade.

pickBestImage(meta, { minWidth, aspect }) → seleciona a melhor imagem.

---

## 6) Web Component
html
Copiar
Editar

```
<og-scraper url="https://exemplo.com" depth="deep"></og-scraper>
<script type="module" src="https://cdn.oggen.dev/og-scraper.js"></script>
Eventos emitidos:
```

og:loading

og:success (payload com dados)

og:error

---

## 7) Segurança & Compliance
Sanitizar HTML antes de parsear.

Timeout de 5–8s por request.

Rate limit por IP.

Respeitar robots.txt (configurável).

---

## 8) Roadmap

### MVP
- Endpoint /scrape

- OG + Twitter + básicos

- Heurística simples de imagem

### Avançado
- Pré-visualização multi-plataforma

- Diagnóstico com recomendações

- Carrossel de imagens candidatas

### Premium
- CLI oggen scrape <url>

- Webhooks/CMS integration

- IA para reescrever título/descrição

---

## 9) Definição de Done (MVP)
- URL colada → API /scrape → resposta em <3s.

- Traz título, descrição e imagem principal (pelo menos).

- Campos indicam fonte (og/twitter/fallback).

- App consumidor consegue pré-preencher editor sem erros.