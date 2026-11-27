import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import { i18n } from '../../../i18n/en';
import { publishedEntries, slugifyTerm, taxonomyTerms } from '../../../lib/content';
import { feedItems } from '../../../lib/feed';

export async function getStaticPaths() {
  const entries = publishedEntries(await getCollection('posts'), 'en');
  const terms = taxonomyTerms(entries, 'tags');

  return terms.map((t) => ({
    params: { tag: t.slug },
    props: { term: t.term },
  }));
}

export async function GET(context: { site: URL; props: { term: string } }) {
  const { term } = context.props;

  const entries: CollectionEntry<'posts'>[] = publishedEntries(
    await getCollection('posts'),
    'en',
  ).filter((entry) => entry.data.tags.some((tag) => slugifyTerm(tag) === slugifyTerm(term)));

  return rss({
    title: `${i18n.siteTitle} · ${term}`,
    description: i18n.siteDescription,
    site: context.site,
    items: feedItems(entries),
    customData: `<language>en-us</language>`,
  });
}
