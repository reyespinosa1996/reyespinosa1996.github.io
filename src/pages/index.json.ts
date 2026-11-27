import { getCollection } from 'astro:content';
import { publishedEntries } from '../lib/content';
import { searchDocuments } from '../lib/search-index';

export async function GET() {
  const entries = publishedEntries(await getCollection('posts'), 'en');
  const documents = searchDocuments(entries);

  return new Response(JSON.stringify(documents), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
