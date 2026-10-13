# synckai.app

Source of the [SyncKai](https://github.com/Sync-Kai/SyncKai) website, published on GitHub Pages at **https://synckai.app**.

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
| `npm run build` | Production build and prerendering into `dist/synckai-app/browser/`, then `scripts/postbuild.mts` (404 page, short links, sitemap) |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint with type-aware rules (angular-eslint, typescript-eslint) |
| `npm run format` | Prettier |
| `npm run verify` | Everything CI runs |

## Architecture

The code follows a layered (clean) architecture. Dependencies only point inwards, and `src/app/architecture.spec.ts` fails the tests if an import breaks a rule (type imports included).

```
src/app/
├── domain/      Models and pure rules, plain TypeScript with no Angular
├── data/        Translations (JSON) and site settings (site.config.json)
├── core/        App-wide services: language, SEO, browser access, DI tokens
├── shared/ui/   Reusable presentational components (icons, store buttons)
├── layout/      Header, footer, language menu
└── features/
    ├── landing/            The page (/:lang): one container, presentational sections
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
4. Run `npm run verify`. The build fails if a text is missing, and the tests fail if a key is missing, extra or empty. The new language gets its prerendered page, its menu entry, its sitemap entry and automatic detection.

## Short links

| Link | Goes to |
|---|---|
| `synckai.app/chrome` | Chrome Web Store |
| `synckai.app/firefox` | Firefox Add-ons |
| `synckai.app/github` | Source code |
| `synckai.app/privacy` | Privacy policy |

They are generated from `site.config.json` by `scripts/postbuild.mts`.

## Deployment

- `.github/workflows/ci.yml`: `npm run verify` on `develop`, feature branches and pull requests.
- `.github/workflows/deploy.yml`: on each push to `main`, verifies, builds and deploys to GitHub Pages (*Settings › Pages › Source: GitHub Actions*). `public/CNAME` holds the custom domain.

## Git workflow

Gitflow with a linear history: `main` (production, deployed), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`, `chore/*`, `release/*`. Rebase on `develop`, then `git merge --ff-only`. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), in English. See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © 2026 Quentin Geerts. SyncKai is not affiliated with Crunchyroll, ADN, Netflix, Disney+, AniList or MyAnimeList.
