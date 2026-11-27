# Hi, I'm Reinaldo 👋

I'm a **System Administrator** who enjoys making technology work smoothly, securely, and reliably — especially in **healthcare environments**, where downtime really matters.

**Tech I work with:** Linux · Windows · Python · Docker · FreeBSD (pfSense) · SCRUM

**Beyond the terminal:**
- Theologian by training, Christian since 2014
- Volunteer Spanish translator for the [Ezra Bible App](https://ezrabibleapp.net/)
- Contributor to the [XFCE4 desktop website](https://xfce.org/) and some of its components

I believe good technology, like good theology, should serve people well — clearly, humbly, and without unnecessary complexity.

📫 Open to conversations about systems, Scripture, or translations.

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

The static admin is also copied to `dist/admin/` and served at `/admin/` in production, but local development uses the `index.html` URL above.

### Optional remote editing with a token

If you want to edit through the deployed GitHub backend instead of local files, click **Sign In Using Access Token** in the admin. Use a GitHub personal access token with write access to this repository: a fine-grained token scoped to `reyespinosa1996/reyespinosa1996.github.io` with **Contents: Read and write** (classic tokens need the `repo` scope). Sveltia stores the token in the browser's local storage. Never commit the token to this repository or put it in `public/admin/config.yml`.

### Editing with OpenCode

OpenCode can edit the Markdown/YAML files directly; no CMS session or authentication is needed. Keep one file per language under `src/content/posts/en/<slug>.md` and `src/content/posts/es/<slug>.md` (no `.es.md` suffix), set `lang` to the folder language, reuse the same `translationKey` for the translated pair, and keep `draft: true` until the post is ready. Required frontmatter fields are `title`, `date`, `draft`, `lang`, `translationKey`, `tags`, and `categories`; `description`, `author`, `cover`, `toc`, and `tocOpen` are optional. After editing, run `npm run check` and `npm run build`.

## Rollback

If a deployment breaks the site, revert the deployment commit on `master` and push that revert. The last Hugo state is kept in the local tag `pre-astro-migration` as a reference; the Hugo workflow can be restored from that tag if needed. No GitHub Pages settings or DNS changes are required for a rollback.
