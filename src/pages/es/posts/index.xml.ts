import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { i18n } from '../../../i18n/es';
import { publishedEntries } from '../../../lib/content';
import { feedItems } from '../../../lib/feed';

export async function GET(context: { site: URL }) {
  const entries = publishedEntries(await getCollection('posts'), 'es');

  return rss({
    title: `${i18n.siteTitle} · ${i18n.nav.posts}`,
    description: i18n.siteDescription,
    site: context.site,
    items: feedItems(entries),
    customData: `<language>es-es</language>`,
  });
}
