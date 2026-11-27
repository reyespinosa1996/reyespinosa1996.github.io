export const POSTS_PER_PAGE = 10;

/**
 * Divide una lista en páginas de tamaño `perPage`.
 */
export function paginate<T>(items: T[], perPage: number = POSTS_PER_PAGE): T[][] {
  if (items.length === 0) return [];

  const pages: T[][] = [];

  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }

  return pages;
}

/**
 * URL de una página del listado de posts.
 * La página 1 vive en la ruta canónica; las siguientes en `/page/N/`.
 */
export function postsPageUrl(lang: 'en' | 'es', page: number): string {
  const prefix = lang === 'es' ? '/es' : '';
  return page <= 1 ? `${prefix}/posts/` : `${prefix}/posts/page/${page}/`;
}
