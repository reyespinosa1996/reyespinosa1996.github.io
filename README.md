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

## Rollback

If a deployment breaks the site, revert the deployment commit on `master` and push that revert. The last Hugo state is kept in the local tag `pre-astro-migration` as a reference; the Hugo workflow can be restored from that tag if needed. No GitHub Pages settings or DNS changes are required for a rollback.
