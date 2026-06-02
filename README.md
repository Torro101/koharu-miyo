# Koharu Miyo Website

Static website for MIYO, the Android comic and manga reader maintained at:

https://github.com/Torro101/MIYO

This repository is intended for GitHub Pages. It does not host manga, source catalogs, or third-party content. APK downloads should point to the official MIYO GitHub Releases so release signing and update history stay centralized.

## Pages

- `/` - product landing page
- `/features/` - user-facing feature guide
- `/downloads/` - current release links and install notes
- `/docs/` - architecture, plugin compatibility, and website hosting notes
- `/credits/` - Kotatsu, Usagi, and MIYO lineage
- `/github/` - redirect to the main MIYO source repository

## Local Preview

Open `index.html` directly, or run a simple static server:

```bash
python3 -m http.server 4177
```

## GitHub Pages

Publish from:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/`

The default project URL is:

https://torro101.github.io/koharu-miyo/

No custom domain is configured yet. Use the default GitHub Pages URL until a domain is owned and DNS is ready.
