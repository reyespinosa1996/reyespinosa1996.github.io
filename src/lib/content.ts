import type { CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'es';

export const LANGS: Lang[] = ['en', 'es'];

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'es' : 'en');

/**
 * Prefijo de ruta del idioma. El inglés vive en la raíz, el español bajo /es/.
 */
export const langPrefix = (lang: Lang): string => (lang === 'es' ? '/es' : '');

/**
 * Deriva el slug público de una entrada a partir de su id de colección.
 * Los ids tienen el formato `<lang>/<slug>` porque el contenido se separa por idioma.
 */
export function slugOf(entry: { id: string }): string {
  const parts = entry.id.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : parts[0];
}

/**
 * URL pública de una entrada de la colección `posts`.
 */
export function postUrl(entry: CollectionEntry<'posts'>): string {
  return `${langPrefix(entry.data.lang)}/posts/${slugOf(entry)}/`;
}

/**
 * URL pública de una entrada de la colección `pages`.
 */
export function pageUrl(entry: CollectionEntry<'pages'>): string {
  return `${langPrefix(entry.data.lang)}/${slugOf(entry)}/`;
}

/**
 * Entradas publicadas (sin drafts) de una colección, ordenadas por fecha descendente.
 *
 * Se declaran sobrecargas explícitas porque `CollectionEntry<C>` no es invertible:
 * con un único tipo genérico TypeScript no puede deducir la colección y cae en
 * una unión `'posts' | 'pages'` que ensucia los tipos de todas las llamadas.
 */
export function publishedEntries(
  entries: CollectionEntry<'posts'>[],
  lang?: Lang,
): CollectionEntry<'posts'>[];
export function publishedEntries(
  entries: CollectionEntry<'pages'>[],
  lang?: Lang,
): CollectionEntry<'pages'>[];
export function publishedEntries(
  entries: Array<CollectionEntry<'posts'> | CollectionEntry<'pages'>>,
  lang?: Lang,
): Array<CollectionEntry<'posts'> | CollectionEntry<'pages'>> {
  return entries
    .filter((entry) => !entry.data.draft)
    .filter((entry) => (lang ? entry.data.lang === lang : true))
    .sort(
      (a, b) => b.data.date.getTime() - a.data.date.getTime(),
    );
}

/**
 * Taxonomía (tags o categorías) usada por las entradas de un idioma.
 */
export function taxonomyTerms(
  entries: CollectionEntry<'posts'>[],
  field: 'tags' | 'categories',
): Array<{ term: string; slug: string; count: number }> {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const term of entry.data[field]) {
      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([term, count]) => ({
      term,
      slug: slugifyTerm(term),
      count,
    }))
    .sort((a, b) => a.term.localeCompare(b.term));
}

/**
 * Normaliza un término de taxonomía para usarlo como slug de URL.
 * Conserva caracteres Unicode (por ejemplo "sitios-estáticos").
 */
export function slugifyTerm(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '');
}
