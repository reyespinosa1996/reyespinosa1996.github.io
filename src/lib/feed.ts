import type { CollectionEntry } from 'astro:content';
import { postUrl } from './content';

export interface FeedItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
  categories: string[];
}

/**
 * Convierte entradas de la colección `posts` en items de feed RSS.
 */
export function feedItems(entries: CollectionEntry<'posts'>[]): FeedItem[] {
  return entries.map((entry) => ({
    title: entry.data.title,
    description: entry.data.description ?? entry.data.title,
    pubDate: entry.data.date,
    link: postUrl(entry),
    categories: [...entry.data.tags, ...entry.data.categories],
  }));
}
