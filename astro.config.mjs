// Config de Astro. Se valida en el build; se omite `// @ts-check` porque el
// hook de build usa Node builtins y el proyecto no declara @types/node.

import { copyFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

/**
 * Astro genera `404.html` en la raíz, pero con `build.format: 'directory'`
 * las páginas de error anidadas se emiten como `<ruta>/index.html`.
 * Esta integración publica además `es/404.html` para el idioma español.
 */
const spanish404 = {
	name: 'spanish-404',
	hooks: {
		'astro:build:done': async ({ dir, logger }) => {
			const source = new URL('./es/404/index.html', dir);
			const target = new URL('./es/404.html', dir);

			try {
				await copyFile(source, target);
				logger.info('Generado es/404.html');
			} catch (error) {
				logger.warn(`No se pudo generar es/404.html: ${error.message}`);
			}
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: 'https://reyespinosa.is-a.dev',
	trailingSlash: 'always',
	build: {
		format: 'directory',
	},
	integrations: [spanish404],
	markdown: {
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: 'wrap',
					properties: {
						className: ['heading-anchor'],
					},
				},
			],
		],
	},
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'es'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	// URLs legacy generadas por Hugo que ya no son canónicas.
	redirects: {
		'/page/1': '/',
		'/posts/page/1': '/posts',
		'/tags/[tag]/page/1': '/tags/[tag]',
		'/categories/[category]/page/1': '/categories/[category]',
		'/es/page/1': '/es/',
		'/es/posts/page/1': '/es/posts',
		'/es/tags/[tag]/page/1': '/es/tags/[tag]',
		'/es/categories/[category]/page/1': '/es/categories/[category]',
		// El prefijo /en/ nunca fue canónico: el inglés vive en la raíz.
		'/en': '/',
		'/en/about': '/about',
		'/en/search': '/search',
		'/en/posts': '/posts',
		'/en/posts/[...slug]': '/posts/[...slug]',
		'/en/posts/page/1': '/posts',
		'/en/tags': '/tags',
		'/en/tags/[tag]': '/tags/[tag]',
		'/en/categories': '/categories',
		'/en/categories/[category]': '/categories/[category]',
		'/en/page/1': '/',
		'/en/index.xml': '/index.xml',
		'/en/sitemap.xml': '/sitemap.xml',
	},
});
