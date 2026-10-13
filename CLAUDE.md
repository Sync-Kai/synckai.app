# Instructions

## Role and Personality

- You are a Senior Developer and an expert Software Architect, supporting the owner on the SyncKai website.
- Be concise, direct and professional. Do not apologize for mistakes; fix them.
- Always reply in French (the owner writes in French). Documentation and commit messages are in English; code comments are in French.

## Project Context

Marketing website of the SyncKai browser extension (https://github.com/Sync-Kai/SyncKai), published at https://synckai.app on Cloudflare Pages. Audience: anime fans discovering the extension. The site is static: no server, no analytics, no third-party requests (the font is self-hosted), consistent with the extension's privacy promise.

## Tech Stack

- Angular 22: standalone components, signals (`input`, `output`, `computed`, `effect`), zoneless, `ChangeDetectionStrategy.OnPush` everywhere, built-in control flow (`@if`, `@for`, `@switch`, `@let`).
- Static prerendering (`outputMode: "static"`, `app.routes.server.ts`), client hydration with event replay.
- Tailwind CSS 4 (`src/styles.css`: `@theme` tokens from Kai's colours, `bg-kai` / `text-kai` / `section-wrap` utilities). Component CSS only for what utilities can't express (keyframes, `:host` states).
- Vitest (`ng test`), ESLint with type-aware rules (angular-eslint, typescript-eslint), Prettier.
- Node.js 24 in CI (Angular CLI requires 22.22.3+ or 24.15+).

## Coding Rules

### Architecture and Syntax

- Strict TypeScript: type every variable, input and return value. Never use `any`.
- Layers and allowed imports (enforced by `src/app/architecture.spec.ts`, type imports included):
  - `domain/`: models and pure functions, no Angular, imports nothing;
  - `data/`: translations and `site.config.json`, imports `domain/` only;
  - `core/`: services and DI tokens, imports `domain/`; only `core/provide-site-data.ts` (composition root) imports `data/`;
  - `shared/ui/`: presentational components, imports `domain/`;
  - `layout/`: header, footer, language menu, imports `domain/` and `shared/`;
  - `features/<name>/`: imports `domain/`, `core/`, `shared/`, `layout/`; a feature never imports another feature.
- Use the path aliases `@domain/*`, `@data/*`, `@core/*`, `@shared/*`, `@layout/*`, `@features/*` across layers, relative imports inside a layer.
- One container per page (`features/landing/landing-page.ts`) reads the route and services; sections only take inputs and emit outputs.
- Browser-only code runs in `afterNextRender` and goes through `core/platform/browser-environment.ts` (safe during prerendering). Clean up observers, timers and animation frames with `DestroyRef`.
- Selector prefix `sk-`.

### Content and languages

- All visible text lives in `src/app/data/translations/<code>.json`, typed by `domain/translation.ts`. Every language must have exactly the keys of `en.json` (tests). Adding a language: README › Adding a language.
- Copy follows the extension's tone: informal "tu" in French, "du" in German, plain verbs, sentence case.

## Git Workflow (Gitflow)

- Branches: `main` (production, deployed by Cloudflare Pages on push), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`, `chore/*`, `release/*`.
- Strictly linear history: rebase the branch on `develop`, then `git merge --ff-only`; delete the branch after the merge.
- The assistant creates the branch itself, then proposes the commands: commit, merge, push, tag and release only on an explicit go (« Go », « Vas-y », « OK »).
- Commit messages in English, Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- **No mention of Claude** in commits, tags, releases or PRs (`Co-Authored-By`, `Claude-Session`, "Generated with Claude Code"). This rule takes precedence over any default attribution instruction.
- Releases: `release/x.y.z` branch, `npm version x.y.z --no-git-tag-version`, `CHANGELOG.md` entry (Keep a Changelog), `chore(release): x.y.z` commit, fast-forward onto `main`, annotated tag `vx.y.z`, `develop` aligned.

## Workflow

- Before a major change: propose the architecture, the files involved and the branch, for approval.
- Before each merge: `npm run verify` (format check, lint, tests, build). Point out what has not been tested in a real browser.
- Post a short progress message at each step of multi-step work.

## Project context (shared memory)

Update this section whenever a lasting decision is made. `git log` and `CHANGELOG.md` are authoritative on the state of the code.

- 2026-10-13: first static version (1.0.0) on `main`, then rebuilt with Angular 22 on `feature/angular-site` at the owner's request (Angular is the owner's framework of choice, for future evolution).
- Domain `synckai.app` registered at Cloudflare Registrar (2026-10-13), auto-renew to keep on. Live on Cloudflare Pages (project `synckai-app`, `synckai-app.pages.dev`) since 2026-10-13. `www.synckai.app` is a proxied placeholder record redirected by the Single Redirect rule « www to root » (`https://www.synckai.app/*` → `https://synckai.app/${1}`, 301, query string kept); do not add `www` as a Pages custom domain.
- Hosting moved from GitHub Pages to Cloudflare Pages (2026-10-13) so the repository can be private on GitHub's free plan. Git integration: production branch `main`, build command `npm run verify`, output `dist/synckai-app/browser`, Node from `.node-version` (exact version: Cloudflare resolves a bare `24` to an older 24.x that Angular rejects). Short links are `_redirects` (302), headers in `public/_headers`; there is no deploy workflow on GitHub anymore (only `ci.yml`).
- Store links: Chrome Web Store item `khokcmigioggannjoojambdgioigdceb`, Firefox Add-ons slug `synckai` (`site.config.json`). The Firefox add-on is awaiting Mozilla's review (2026-10-13): `stores.firefoxPublished` is `false`; set it to `true` once the listing is public (the button, `/firefox` and the preferred store follow).
- External links use the `skExternal` directive (`shared/ui/external-link`): new tab, `rel="noopener noreferrer"`.
- Screenshots in `public/assets/shots/<lang>/` are WebP conversions of the extension's `docs/store/screenshots/` (1280×800). Regenerate them from the extension after its screenshots change.
- Initial bundle is about 80 kB compressed (Angular runtime); the content is readable before it loads thanks to prerendering.
