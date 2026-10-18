# synckai.app

Source of the [SyncKai](https://github.com/Sync-Kai/SyncKai) website, published on Cloudflare Pages at **https://synckai.app**.

Angular 22 (standalone components, signals, zoneless, `OnPush`), Tailwind CSS 4, prerendered to static HTML: every language is a plain HTML page, and the app hydrates on top of it.

## Getting started

Requirements: Node.js 22.22.3+ or 24.15+.

```bash
npm install
npm start          # dev server at http://localhost:4200/
npm run verify     # format check, lint, unit tests, production build
```

| Script | What it does |
|---|---|
| `npm start` | Development server with live reload |
| `npm run build` | Production build and prerendering into `dist/synckai-app/browser/`, then `scripts/postbuild.mts` (404 page, `_redirects`, sitemap) |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint with type-aware rules (angular-eslint, typescript-eslint) |
| `npm run format` | Prettier |
| `npm run verify` | Everything CI runs |

## Architecture

The code follows a layered (clean) architecture. Dependencies only point inwards, and `src/app/architecture.spec.ts` fails the tests if an import breaks a rule (type imports included).

```
src/app/
├── domain/      Models and pure rules, plain TypeScript with no Angular
├── data/        Translations (JSON), site settings (site.config.json), release notes (releases.json)
├── core/        App-wide services: language, SEO, browser access, DI tokens
├── shared/ui/   Reusable presentational components (icons, store buttons)
├── layout/      Header, footer, language menu
└── features/
    ├── landing/            The home page (/:lang): one container, presentational sections
    ├── changelog/          The What's new page (/:lang/changelog)
    └── language-redirect/  The root page (/) and unknown URLs: sends visitors to their language
```

| Layer | May import |
|---|---|
| `domain` | nothing |
| `data` | `domain` |
| `core` | `domain` (and `data` from `core/provide-site-data.ts` only, the composition root) |
| `shared` | `domain` |
| `layout` | `domain`, `shared` |
| `features` | `domain`, `core`, `shared`, `layout`; never another feature |

Path aliases: `@domain/*`, `@data/*`, `@core/*`, `@shared/*`, `@layout/*`, `@features/*`.

Conventions: one container per page reads the route and services, sections only take inputs; every component is `OnPush` with signal inputs; browser-only code runs in `afterNextRender` and goes through `BrowserEnvironment`, which is safe during prerendering.

## Adding a language

1. Copy `src/app/data/translations/en.json` to `<code>.json` (for example `es.json`) and translate every value. Set `code`, `name` (the language's own name, like *Español*) and `stores` (the locale codes the Chrome Web Store and Firefox Add-ons use).
2. Register it in `src/app/data/translations/index.ts`.
3. Optional: add the store screenshots as `.webp` in `public/assets/shots/<code>/` and add the code to `screenshots.languages` in `site.config.json`. Otherwise the English ones are used.
4. Add the language to every release in `src/app/data/releases.json` (see below).
5. Run `npm run verify`. The build fails if a text is missing, and the tests fail if a key is missing, extra or empty. The new language gets its prerendered pages, its menu entry, its sitemap entries and automatic detection.

## Updating the What's new page

Each time a version of the extension is published, add it at the top of `src/app/data/releases.json`: its `version`, its `date` (`YYYY-MM-DD`) and, for every language of the site, a short `title` and a few `highlights`. These are plain sentences for anime fans, not a copy of the extension's technical `CHANGELOG.md`, which the page links to. The hero badge and the structured data follow the latest version by themselves. The tests fail if a language is missing, if the languages don't have the same number of highlights, or if the versions are out of order.

## Updating the screenshots

The feature blocks show the right half of the extension's store shots (`docs/store/screenshots/<lang>/0{2..5}-*.png` in the extension repository, 1280×800, made by its `npm run screenshots`): crop each one at x 610 to 670×800 (the « stage » surface with the disc and the floating UI), save it as WebP (quality about 85) under the same name in `public/assets/shots/<lang>/`. The text column is written by the site from the translations, so never use the full shot (it carries its own caption). The tests fail if a shot is missing for a language listed in `screenshots.languages`. `public/assets/og.png` is a copy of the extension's `docs/store/promo-1400x560.png`.

## Firefox availability

While the Firefox add-on awaits Mozilla's review, `stores.firefoxPublished` is `false` in `src/app/data/site.config.json`: the Firefox button shows "Coming soon to Firefox" without a link, and `/firefox` leads to the home page. Once the listing is public, set it to `true` and deploy.

## Short links

| Link | Goes to |
|---|---|
| `synckai.app/chrome` | Chrome Web Store |
| `synckai.app/firefox` | Firefox Add-ons |
| `synckai.app/github` | Source code |
| `synckai.app/privacy` | Privacy policy |

`scripts/postbuild.mts` writes them as server redirects (302) in `_redirects`, from `site.config.json`.

## Deployment

The site is hosted on **Cloudflare Pages**, connected to this repository (Git integration):

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run verify` (format check, lint, tests, then the build) |
| Build output directory | `dist/synckai-app/browser` |
| Node.js | from `.node-version` (exact version, e.g. 24.21.0; a bare `24` resolves to an older release that the Angular CLI rejects) |

- Each push to `main` is verified, built and published; other branches get a preview URL on `*.pages.dev`.
- `public/_headers` sets the security headers and caching; `_redirects` and `404.html` are generated by the build.
- Custom domain `synckai.app` (and `www.synckai.app`, redirected to it) is managed in Cloudflare.
- `.github/workflows/ci.yml` runs `npm run verify` on `develop`, feature branches and pull requests.

## Git workflow

Gitflow with a linear history: `main` (production, deployed), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`, `chore/*`, `release/*`. Rebase on `develop`, then `git merge --ff-only`. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), in English. See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © 2026 Quentin Geerts. SyncKai is not affiliated with Crunchyroll, ADN, Netflix, Disney+, AniList or MyAnimeList.
