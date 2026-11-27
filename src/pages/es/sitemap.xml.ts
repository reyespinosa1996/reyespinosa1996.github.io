import { getCollection } from 'astro:content';
import { renderSitemap, sitemapEntries } from '../../lib/sitemap';

export async function GET(context: { site: URL }) {
  const [posts, pages] = await Promise.all([getCollection('posts'), getCollection('pages')]);

  const entries = await sitemapEntries(posts, pages, 'es');

  return new Response(renderSitemap(entries, context.site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
