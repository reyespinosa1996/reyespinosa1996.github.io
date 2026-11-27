import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { i18n } from '../i18n/en';
import { publishedEntries } from '../lib/content';
import { feedItems } from '../lib/feed';

export async function GET(context: { site: URL }) {
  const entries = publishedEntries(await getCollection('posts'), 'en');

  return rss({
    title: i18n.siteTitle,
    description: i18n.siteDescription,
    site: context.site,
    items: feedItems(entries),
    customData: `<language>en-us</language>`,
  });
}
