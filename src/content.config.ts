import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
	title: z.string(),
	date: z.date(),
	draft: z.boolean().default(false),
	lang: z.enum(['en', 'es']),
	translationKey: z.string(),
	description: z.string().optional(),
	author: z.array(z.string()).optional(),
	tags: z.array(z.string()).default([]),
	categories: z.array(z.string()).default([]),
	cover: z
		.object({
			image: z.string(),
			alt: z.string(),
			caption: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})
		.optional(),
	toc: z.boolean().default(false),
	tocOpen: z.boolean().default(false),
});

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema,
});

const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
	schema,
});

export const collections = {
	posts,
	pages,
};
