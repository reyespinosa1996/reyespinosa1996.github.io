import type { CollectionEntry } from 'astro:content';
import { postUrl } from './content';

export interface SearchDocument {
  title: string;
  description: string;
  url: string;
  tags: string[];
  categories: string[];
  content: string;
}

/**
 * Limpia el Markdown para convertirlo en texto plano indexable.
 */
function plainText(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Genera los documentos del índice de búsqueda a partir de los posts publicados.
 */
export function searchDocuments(entries: CollectionEntry<'posts'>[]): SearchDocument[] {
  return entries.map((entry) => ({
    title: entry.data.title,
    description: entry.data.description ?? '',
    url: postUrl(entry),
    tags: entry.data.tags,
    categories: entry.data.categories,
    content: plainText(entry.body ?? ''),
  }));
}
