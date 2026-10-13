# synckai.app

Source of the [SyncKai](https://github.com/Sync-Kai/SyncKai) website, published on GitHub Pages at **https://synckai.app**.

## How it works

- `build.mjs` generates the static site into `dist/` (Node 20+, no dependencies): one page per language in `i18n/`, the root page that sends visitors to their language, and short links.
- `src/assets/` holds the styles, the script, the SyncKai logo and the screenshots (`shots/<language>/`).
- `src/static/` is copied as is (`CNAME`, `robots.txt`).
- Each push to `main` builds and deploys the site (`.github/workflows/deploy.yml`).

```bash
node build.mjs                      # build into dist/
npx serve dist                      # preview at http://localhost:3000
```

## Short links

| Link | Goes to |
|---|---|
| `synckai.app/chrome` | Chrome Web Store |
| `synckai.app/firefox` | Firefox Add-ons |
| `synckai.app/github` | Source code |
| `synckai.app/privacy` | Privacy policy |

## Adding a language

1. Copy `i18n/en.json` to `i18n/<code>.json` (for example `es.json`) and translate every value. Set `code`, `name` (the language's own name, like *Español*) and `stores` (the locale codes the Chrome Web Store and Firefox Add-ons use for that language).
2. Optional: add the store screenshots for that language in `src/assets/shots/<code>/` as `.webp`. Without them, the English screenshots are used.
3. Run `node build.mjs`. The new language appears in the language menu, the footer, the sitemap and the automatic language detection.

## License

MIT © 2026 Quentin Geerts
