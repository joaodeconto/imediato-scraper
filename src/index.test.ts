import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('undici', () => ({ fetch: vi.fn() }));
import { fetch as mockedFetch } from 'undici';
import { scrape, ScrapeError } from './index';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('scrape', () => {
  it('coleta meta básica de example.com', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '<html><head><title>Example</title></head></html>'
    });
    const r = await scrape('https://uol.com.br');
    expect(r.meta).toBeDefined();
    expect(r.meta.og?.title).toBe('Example OG');
    expect(r.diagnostics.timingsMs.fetch).toBeGreaterThanOrEqual(0);
  });

  it('gera ScrapeError para URL inválida', async () => {
    mockedFetch.mockRejectedValue(new Error('fetch failed'));
    await expect(scrape('notaurl')).rejects.toBeInstanceOf(ScrapeError);
    await expect(scrape('notaurl')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });

  it('gera ScrapeError para resposta HTTP não ok', async () => {
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => ''
    });
    await expect(scrape('https://example.com/doesnotexist')).rejects.toBeInstanceOf(ScrapeError);
    await expect(scrape('https://example.com/doesnotexist')).rejects.toMatchObject({ code: 'HTTP_ERROR' });
  });

  it('gera ScrapeError para falha de parsing', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => { throw new Error('bad body'); }
    });
    await expect(scrape('https://example.com')).rejects.toBeInstanceOf(ScrapeError);
    await expect(scrape('https://example.com')).rejects.toMatchObject({ code: 'PARSE_ERROR' });
  });
});
