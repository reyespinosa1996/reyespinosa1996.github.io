# Reinaldo Espinosa

I'm a system administrator. I work with Linux, Windows, Python, Docker and FreeBSD/pfSense, mostly in healthcare environments where reliability and uptime matter. I also work in SCRUM teams.

## About this site

This site is my personal website and blog. It focuses on technology: notes and articles about system administration, infrastructure and the tools I work with, published in English and Spanish. My background in theology and translation is part of who I am, but it is not the main subject of the site.

## Technologies I use

- Systems and tools: Linux, Windows, Python, Docker, FreeBSD/pfSense, SCRUM.
- This site: Astro, TypeScript, Astro content collections, `@astrojs/rss`, Fuse.js, rehype-slug, rehype-autolink-headings, Sharp, Umami, Sveltia CMS and GitHub Pages.

## Background

- Theologian by training; Christian since 2014.
- Volunteer Spanish translator for the [Ezra Bible App](https://ezrabibleapp.net/).
- Contributor to the [XFCE4 desktop website](https://xfce.org/) and some of its components.

## Contact

For questions about systems, Scripture or translations, contact me at reinaldo.cuentas@gmail.com.

## Licenses

- **Code:** [MIT License](LICENSE). You may use, modify and redistribute the source code, keeping the copyright notice.
- **Content:** [CC BY 4.0](CONTENT-LICENSE.md) applies to posts and pages. Reuse, including commercial use, is allowed with attribution to Reinaldo Espinosa, a link to the license, and an indication of any changes.

Third-party dependencies keep their own licenses.

---

## Development

This site is built with Astro. With Node 24 installed:

```bash
npm install
npm run dev       # local dev server
npm run check     # Astro check + TypeScript
npm run build     # static output in dist/
npm run preview   # preview the built site
```

## Content authoring

Sveltia CMS is a static, Git-first editor. It edits the same Markdown/YAML files that Astro consumes in `src/content/posts/{en,es}/` and `src/content/pages/{en,es}/`; there is no CMS server, database, or backend service.

### Local editing (recommended)

1. Start Astro with `npm run dev`.
2. In a Chromium-based browser (Chrome, Edge, or Brave), open `http://localhost:4321/admin/index.html`. Use the port printed by Astro; if 4321 is busy it may be 4322. Local editing must use `/admin/index.html`, not `/admin/`.
3. Click **Work with Local Repository**, select the repository root, and confirm folder access. This browser prompt requires a human; agents cannot approve it.
4. Edit posts and pages normally. Every save writes directly to local files. Review with `git diff`, then commit and push as usual.
5. Reload the admin after changing `public/admin/config.yml` or after editing content files outside the CMS.

The static admin is also copied to `dist/admin/` and served at `https://reyespinosa.is-a.dev/admin/` in production, but local development uses the `index.html` URL above.

### Online editing with a personal access token

Open `https://reyespinosa.is-a.dev/admin/` in a Chromium-based browser and click **Sign In Using Access Token**. GitHub OAuth is intentionally disabled with `backend.auth_methods: [token]` in `public/admin/config.yml`, so the token is the only remote sign-in method. There is no OAuth app, Cloudflare Worker or backend service: the site stays static and the CMS talks to GitHub from the browser.

Create a fine-grained personal access token scoped to `reyespinosa1996/reyespinosa1996.github.io` with **Contents: Read and write** (Metadata is added automatically). A classic token with the `repo` scope also works. Paste the token into the admin prompt; Sveltia stores it only in that browser's local storage and uses it to read and commit content directly to `master`.

Never put the token in this repository, in `public/admin/config.yml`, or in logs. To revoke access, delete the token under GitHub **Settings → Developer settings → Personal access tokens**; a new token is then required before the browser can save changes again.

### Editing with OpenCode

OpenCode can edit the Markdown/YAML files directly; no CMS session or authentication is needed. Keep one file per language under `src/content/posts/en/<slug>.md` and `src/content/posts/es/<slug>.md` (no `.es.md` suffix), set `lang` to the folder language, reuse the same `translationKey` for the translated pair, and keep `draft: true` until the post is ready. Required frontmatter fields are `title`, `date`, `draft`, `lang`, `translationKey`, `tags`, and `categories`; `description`, `author`, `cover`, `toc`, and `tocOpen` are optional. After editing, run `npm run check` and `npm run build`.
