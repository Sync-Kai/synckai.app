# Changelog

All notable changes to the SyncKai website are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Changed

- Hosting moved from GitHub Pages to Cloudflare Pages: the repository can stay private. The build now runs `npm run verify` before publishing, and branches get preview URLs.
- Short links (`/chrome`, `/firefox`, `/github`, `/privacy`) are now server redirects instead of HTML pages.
- Links to other sites (stores, GitHub, privacy policy) open in a new tab, with `rel="noopener noreferrer"`.

### Added

- Security headers (`nosniff`, referrer policy, permissions policy, no framing) and long-term caching of hashed files.

### Removed

- GitHub Pages deploy workflow and `CNAME` file.

## [1.1.0] - 2026-10-13

### Changed

- Rebuilt the site with Angular 22 (standalone components, signals, zoneless, `OnPush`) and Tailwind CSS 4, prerendered to static HTML for every language. Same content and design as the first version.
- Layered architecture (`domain`, `data`, `core`, `shared`, `layout`, `features`), enforced by `architecture.spec.ts`.
- The M PLUS Rounded 1c font is now served by the site itself instead of Google Fonts: no request to a third party.

### Added

- Unit tests (Vitest): domain rules, translations (same keys as English, no empty text), language service, store buttons, architecture boundaries.
- ESLint with type-aware rules, Prettier, and `npm run verify`.
- CI workflow on `develop`, feature branches and pull requests; the deploy workflow now verifies before publishing.

## [1.0.0] - 2026-10-13

### Added

- First version of the site: static landing page in English, French and German, hero demo of an episode synced at the credits, short links `/chrome`, `/firefox`, `/github`, `/privacy`, GitHub Pages deployment.
