import type { CollectionEntry } from 'astro:content';
import { i18n as enI18n } from '../i18n/en';
import { i18n as esI18n } from '../i18n/es';
import { pageUrl, postUrl, type Lang } from './content';

export const AUTHOR = {
	name: 'Reinaldo Espinosa',
	url: 'https://reyespinosa.is-a.dev/',
	sameAs: [
		'https://github.com/reyespinosa1996',
		'https://www.linkedin.com/in/reiespinosa',
	],
	email: 'reinaldo.cuentas@gmail.com',
} as const;

export const CONTENT_LICENSE = {
	name: 'CC BY 4.0',
	url: 'https://creativecommons.org/licenses/by/4.0/',
} as const;

export interface SchemaItem {
	name: string;
	/** Ruta relativa a la raíz del sitio, por ejemplo `/posts/`. */
	url: string;
}

export interface LlmsItem {
	title: string;
	/** URL absoluta ya resuelta contra el sitio. */
	url: string;
	summary: string;
	body?: string;
}

type I18n = typeof enI18n;
type DescriptionKey = keyof I18n['seo']['descriptions'];

/** Descripción por defecto leída siempre de i18n, nunca literal en un componente. */
export function defaultDescription(lang: Lang, key: DescriptionKey, term?: string): string {
	const text = (lang === 'es' ? esI18n : enI18n).seo.descriptions[key];
	return term ? text.replace('{term}', term) : text;
}

export function llmsText(lang: Lang): I18n['seo']['llms'] {
	return lang === 'es' ? esI18n.seo.llms : enI18n.seo.llms;
}

export function authorPerson() {
	return {
		'@type': 'Person',
		name: AUTHOR.name,
		url: AUTHOR.url,
		email: AUTHOR.email,
		sameAs: [...AUTHOR.sameAs],
	};
}

export function publisherOrganization(site: URL) {
	return {
		'@type': 'Organization',
		name: 'Reinaldo Espinosa',
		url: site.origin,
	};
}

export function keywordsFrom(tags: string[] = [], categories: string[] = []): string[] {
	return [...new Set([...tags, ...categories])];
}

function absoluteUrl(url: string, site: URL): string {
	return new URL(url, site).href;
}

export function breadcrumbSchema(items: SchemaItem[], site: URL) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.url, site),
		})),
	};
}

export function itemListSchema(items: SchemaItem[], site: URL) {
	return {
		'@type': 'ItemList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.url, site),
		})),
	};
}

export function llmsHeader(lang: Lang): string {
	const text = llmsText(lang);
	return [
		`# ${text.title}`,
		'',
		text.summary,
		'',
		text.attribution,
		text.note,
		'',
	].join('\n');
}

export function renderLlmsIndex(lang: Lang, items: LlmsItem[]): string {
	const text = llmsText(lang);
	return [
		llmsHeader(lang),
		`## ${text.contents}`,
		'',
		...items.map((item) => `- [${item.title}](${item.url}): ${item.summary}`),
		'',
	].join('\n');
}

export function renderLlmsFull(lang: Lang, items: LlmsItem[]): string {
	const text = llmsText(lang);
	return [
		llmsHeader(lang),
		`## ${text.fullText}`,
		'',
		...items.flatMap((item) => [
			`### ${item.title}`,
			`Source: ${item.url}`,
			item.summary,
			'',
			item.body?.trim() ?? '',
			'',
		]),
	].join('\n');
}

export function llmsItems(
	posts: CollectionEntry<'posts'>[],
	pages: CollectionEntry<'pages'>[],
	site: URL,
): LlmsItem[] {
	const fromPosts = posts.map((entry) => ({
		title: entry.data.title,
		url: absoluteUrl(postUrl(entry), site),
		summary: entry.data.description ?? entry.data.title,
		body: entry.body ?? '',
	}));

	const fromPages = pages.map((entry) => ({
		title: entry.data.title,
		url: absoluteUrl(pageUrl(entry), site),
		summary: entry.data.description ?? entry.data.title,
		body: entry.body ?? '',
	}));

	return [...fromPosts, ...fromPages];
}
