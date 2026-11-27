import { getCollection } from 'astro:content';
import { publishedEntries } from '../lib/content';
import { llmsItems, renderLlmsIndex } from '../lib/seo';

export async function GET(context: { site: URL }) {
	const [posts, pages] = await Promise.all([getCollection('posts'), getCollection('pages')]);
	const items = llmsItems(
		publishedEntries(posts, 'en'),
		publishedEntries(pages, 'en'),
		context.site,
	);

	return new Response(renderLlmsIndex('en', items), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
