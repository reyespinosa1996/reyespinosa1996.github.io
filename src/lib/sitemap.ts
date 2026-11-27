import type { CollectionEntry } from 'astro:content';
import { langPrefix, postUrl, slugOf, taxonomyTerms, type Lang } from './content';

export interface SitemapAlternate {
  lang: string;
  url: string;
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  alternates: SitemapAlternate[];
}

/** Rutas estáticas publicables por idioma. */
const STATIC_ROUTES: Record<Lang, string[]> = {
  en: ['/', '/posts/', '/tags/', '/categories/', '/search/'],
  es: ['/es/', '/es/posts/', '/es/tags/', '/es/categories/', '/es/search/'],
};

/** URL de una entrada de la colección `pages`. */
function pageUrl(entry: CollectionEntry<'pages'>): string {
  return `${langPrefix(entry.data.lang)}/${slugOf(entry)}/`;
}

/** Ruta equivalente del idioma contrario para una ruta estática. */
function counterpart(url: string, lang: Lang): string {
  return lang === 'en' ? `/es${url}` : url.replace(/^\/es/, '') || '/';
}

/** Alternates de un post: el propio y su traducción si existe. */
function postAlternates(
  entry: CollectionEntry<'posts'>,
  byKey: Map<string, CollectionEntry<'posts'>>,
): SitemapAlternate[] {
  const alternates: SitemapAlternate[] = [{ lang: entry.data.lang, url: postUrl(entry) }];

  const other = entry.data.lang === 'es' ? 'en' : 'es';
  const match = byKey.get(`${entry.data.translationKey}:${other}`);

  if (match) {
    alternates.push({ lang: other, url: postUrl(match) });
  }

  return alternates;
}

/** Alternates de una página: la propia y su traducción si existe. */
function pageAlternates(
  entry: CollectionEntry<'pages'>,
  byKey: Map<string, CollectionEntry<'pages'>>,
): SitemapAlternate[] {
  const alternates: SitemapAlternate[] = [{ lang: entry.data.lang, url: pageUrl(entry) }];

  const other = entry.data.lang === 'es' ? 'en' : 'es';
  const match = byKey.get(`${entry.data.translationKey}:${other}`);

  if (match) {
    alternates.push({ lang: other, url: pageUrl(match) });
  }

  return alternates;
}

/**
 * Construye las entradas del sitemap a partir de las colecciones publicadas.
 *
 * @param scope 'all' incluye ambos idiomas; 'es' solo las URLs en español.
 */
export async function sitemapEntries(
  posts: CollectionEntry<'posts'>[],
  pages: CollectionEntry<'pages'>[],
  scope: 'all' | 'es' = 'all',
): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  const publishedPosts = posts.filter((entry) => !entry.data.draft);
  const publishedPages = pages.filter((entry) => !entry.data.draft);

  const postByKey = new Map<string, CollectionEntry<'posts'>>();
  const pageByKey = new Map<string, CollectionEntry<'pages'>>();

  for (const entry of publishedPosts) {
    postByKey.set(`${entry.data.translationKey}:${entry.data.lang}`, entry);
  }

  for (const entry of publishedPages) {
    pageByKey.set(`${entry.data.translationKey}:${entry.data.lang}`, entry);
  }

  // Rutas estáticas
  for (const lang of ['en', 'es'] as Lang[]) {
    if (scope === 'es' && lang !== 'es') continue;

    for (const url of STATIC_ROUTES[lang]) {
      entries.push({
        url,
        alternates: [
          { lang, url },
          { lang: lang === 'es' ? 'en' : 'es', url: counterpart(url, lang) },
        ],
      });
    }
  }

  // Posts
  for (const entry of publishedPosts) {
    if (scope === 'es' && entry.data.lang !== 'es') continue;

    entries.push({
      url: postUrl(entry),
      lastmod: entry.data.date.toISOString(),
      alternates: postAlternates(entry, postByKey),
    });
  }

  // Páginas (About)
  for (const entry of publishedPages) {
    if (scope === 'es' && entry.data.lang !== 'es') continue;

    entries.push({
      url: pageUrl(entry),
      lastmod: entry.data.date.toISOString(),
      alternates: pageAlternates(entry, pageByKey),
    });
  }

  // Páginas de término
  for (const lang of ['en', 'es'] as Lang[]) {
    if (scope === 'es' && lang !== 'es') continue;

    const langPosts = publishedPosts.filter((entry) => entry.data.lang === lang);
    const prefix = langPrefix(lang);

    for (const field of ['tags', 'categories'] as const) {
      for (const term of taxonomyTerms(langPosts, field)) {
        const url = `${prefix}/${field}/${encodeURIComponent(term.slug)}/`;
        entries.push({
          url,
          alternates: [{ lang, url }],
        });
      }
    }
  }

  return entries;
}

/**
 * Serializa las entradas del sitemap como XML.
 */
export function renderSitemap(entries: SitemapEntry[], site: URL): string {
  const origin = site.origin;

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
      const alternates = entry.alternates
        .map(
          (alt) =>
            `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${origin}${alt.url}" />`,
        )
        .join('');
      return `  <url>\n    <loc>${origin}${entry.url}</loc>${lastmod}${alternates}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}
