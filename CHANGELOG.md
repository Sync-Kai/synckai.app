# Changelog

All notable changes to the SyncKai website are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Added

- On phones and tablets, where the extension can't be installed, the install buttons give way to a short message with a "Send the link" button: it opens the system share menu, or copies the link when there is none.
- FAQ: why the browser warns that SyncKai can read and change data on some sites, and what it actually reads.

## [1.4.0] - 2026-10-13

### Changed

- Install buttons follow the visitor's browser: Firefox only on Firefox ("Coming soon to Firefox" while the add-on awaits Mozilla), Chrome only on Chromium browsers (Chrome, Brave, Edge, Opera…). Unknown browsers, search engines and the prerendered HTML still show both.

## [1.3.0] - 2026-10-13

### Added

- Firefox visitors are told, under the install buttons, that the Firefox version is being reviewed by Mozilla, instead of the note about Chromium browsers. Other browsers are unchanged, and the note goes away by itself once `firefoxPublished` is `true`.

## [1.2.1] - 2026-10-13

### Changed

- The GitHub and AniList links are back in the footer only: the header keeps to the page navigation and the language menu.

### Fixed

- The Privacy link no longer scrolls the privacy box partly under the sticky header: the section is spaced from the inside, like the others, so it lands at the same distance below the header.

## [1.2.0] - 2026-10-13

### Changed

- Hosting moved from GitHub Pages to Cloudflare Pages: the repository can stay private. The build now runs `npm run verify` before publishing, and branches get preview URLs.
- Short links (`/chrome`, `/firefox`, `/github`, `/privacy`) are now server redirects instead of HTML pages.
- Links to other sites (stores, GitHub, privacy policy) open in a new tab, with `rel="noopener noreferrer"`.

### Added

- Links to the GitHub repository and to the creator's AniList profile in the header (icons only on small screens, with accessible labels) and in the footer.
- `firefoxPublished` setting in `site.config.json`: while the Firefox add-on awaits Mozilla's review, the Firefox button becomes a non-clickable "Coming soon to Firefox" label, `/firefox` leads to the home page, and Chrome stays highlighted even on Firefox.
- Security headers (`nosniff`, referrer policy, permissions policy, no framing) and long-term caching of hashed files.

### Fixed

- Header links now follow the order of the page (How it works before Features), so they no longer jump down then back up.

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
