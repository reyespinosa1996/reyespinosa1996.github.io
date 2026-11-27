import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import { i18n } from '../../../../i18n/es';
import { publishedEntries, slugifyTerm, taxonomyTerms } from '../../../../lib/content';
import { feedItems } from '../../../../lib/feed';

export async function getStaticPaths() {
  const entries = publishedEntries(await getCollection('posts'), 'es');
  const terms = taxonomyTerms(entries, 'categories');

  return terms.map((t) => ({
    params: { category: t.slug },
    props: { term: t.term },
  }));
}

export async function GET(context: { site: URL; props: { term: string } }) {
  const { term } = context.props;

  const entries: CollectionEntry<'posts'>[] = publishedEntries(
    await getCollection('posts'),
    'es',
  ).filter((entry) =>
    entry.data.categories.some((cat) => slugifyTerm(cat) === slugifyTerm(term)),
  );

  return rss({
    title: `${i18n.siteTitle} · ${term}`,
    description: i18n.siteDescription,
    site: context.site,
    items: feedItems(entries),
    customData: `<language>es-es</language>`,
  });
}
