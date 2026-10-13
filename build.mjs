// Builds the static site into dist/: one page per language found in i18n/.
// Usage: node build.mjs   (no dependencies, Node 20+)
// To add a language, copy i18n/en.json to i18n/<code>.json and translate it.
import { readFileSync, readdirSync, mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://synckai.app';
const CHROME_ID = 'khokcmigioggannjoojambdgioigdceb';
const REPO = 'https://github.com/Sync-Kai/SyncKai';
const DEFAULT_LANG = 'en';
const OUT = 'dist';

const locales = readdirSync('i18n')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('i18n', f), 'utf8')))
  .sort((a, b) => (a.code === DEFAULT_LANG ? -1 : b.code === DEFAULT_LANG ? 1 : a.code.localeCompare(b.code)));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const chromeUrl = (l) => `https://chromewebstore.google.com/detail/${CHROME_ID}?hl=${l.stores.chrome}`;
const amoUrl = (l) => `https://addons.mozilla.org/${l.stores.amo}/firefox/addon/synckai/`;
// Screenshots fall back to English for languages without their own set.
const shot = (l, name) => {
  const lang = existsSync(join('src/assets/shots', l.code, `${name}.webp`)) ? l.code : DEFAULT_LANG;
  return `/assets/shots/${lang}/${name}.webp`;
};

const icon = {
  chrome: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 8h9M8.5 14 4 6.2M15.5 14 11 21.8" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  firefox: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10c0-1.6-.4-3.2-1.1-4.6.2 1.4-.2 2.5-.8 3.2.3-3.6-2-6.6-5.1-7.6 1.5 1.4 1.9 3.2 1.4 4.6-.9-1.8-2.9-2.6-4.4-2.4 1.3.6 2 1.7 2.1 2.6-2.4-.2-4.3 1.4-4.5 3.4 1-.9 2.4-1.2 3.6-.9-1.6.6-2.6 2-2.4 3.7.3 2 2.2 3.4 4.3 3.3 2.6-.1 4.6-2.4 4.4-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

const storeButtons = (l, extra = '') => `
  <div class="stores ${extra}">
    <a class="btn btn-chrome" href="${chromeUrl(l)}" data-store="chrome">${icon.chrome}<span>${esc(l.hero.chrome)}</span></a>
    <a class="btn btn-firefox" href="${amoUrl(l)}" data-store="firefox">${icon.firefox}<span>${esc(l.hero.firefox)}</span></a>
  </div>`;

const langMenu = (l) => `
  <details class="lang">
    <summary aria-label="${esc(l.nav.language)}">${icon.globe}<span>${esc(l.code.toUpperCase())}</span></summary>
    <ul>
      ${locales.map((o) => `<li><a href="/${o.code}/" hreflang="${o.code}" lang="${o.code}" data-lang="${o.code}"${o.code === l.code ? ' aria-current="true"' : ''}>${esc(o.name)}</a></li>`).join('')}
    </ul>
  </details>`;

const demo = (l) => {
  const d = l.demo;
  return `
  <figure class="demo" aria-label="${esc(d.label)}">
    <div class="player">
      <div class="scene" aria-hidden="true">
        <div class="sky"></div><div class="hill"></div>
        <ol class="roll">${d.roll.map((r, i) => `<li><span>${esc(r)}</span><b>${['K. Aoyama', 'M. Tsukishiro', 'H. Imai', 'R. Kanda', 'Studio Nagi'][i]}</b></li>`).join('')}</ol>
      </div>
      <div class="bar" aria-hidden="true">
        <div class="meta"><strong>${esc(d.series)}</strong><span>${esc(d.season)}, ${esc(d.episode)} 8</span></div>
        <div class="track"><div class="fill"></div><div class="mark"><span>${esc(d.credits)}</span></div><div class="head"></div></div>
        <div class="time"><span class="now">20:41</span><span>23:40</span></div>
      </div>
    </div>
    <div class="entry" aria-live="polite">
      <div class="entry-head"><span>${esc(d.list)}</span><button type="button" class="replay">${esc(d.replay)}</button></div>
      <div class="entry-row">
        <div class="cover" aria-hidden="true"></div>
        <div class="entry-title"><strong>${esc(d.series)}</strong><span>${esc(d.season)}</span></div>
        <div class="count"><span class="ep"><span class="from">7</span><span class="to">8</span></span>/12</div>
      </div>
      <div class="progress"><div></div></div>
      <div class="toast"><span class="ok">${icon.check}</span><div><strong>${esc(d.saved)}</strong><span>AniList, MyAnimeList</span></div></div>
    </div>
  </figure>`;
};

const page = (l) => {
  const alternates = locales.map((o) => `<link rel="alternate" hreflang="${o.code}" href="${SITE}/${o.code}/">`).join('\n  ');
  const privacyUrl = `${REPO}/blob/main/PRIVACY.md`;
  return `<!doctype html>
<html lang="${l.code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(l.meta.title)}</title>
  <meta name="description" content="${esc(l.meta.description)}">
  <link rel="canonical" href="${SITE}/${l.code}/">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${SITE}/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(l.meta.title)}">
  <meta property="og:description" content="${esc(l.meta.description)}">
  <meta property="og:url" content="${SITE}/${l.code}/">
  <meta property="og:image" content="${SITE}/assets/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#141A3D">
  <link rel="icon" href="/assets/kai-icon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css">
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <a class="skip" href="#main">${esc(l.nav.features)}</a>
  <header class="top">
    <a class="logo" href="/${l.code}/"><img src="/assets/kai-lockup-dark.svg" alt="SyncKai" width="162" height="40"></a>
    <nav aria-label="SyncKai">
      <a href="#features">${esc(l.nav.features)}</a>
      <a href="#how">${esc(l.nav.how)}</a>
      <a href="#privacy">${esc(l.nav.privacy)}</a>
      <a href="#faq">${esc(l.nav.faq)}</a>
    </nav>
    ${langMenu(l)}
  </header>

  <main id="main">
    <section class="hero">
      <div class="hero-text">
        <h1>${esc(l.hero.title)}</h1>
        <p class="lead">${esc(l.hero.lead)}</p>
        ${storeButtons(l)}
        <p class="note">${esc(l.hero.note)}</p>
      </div>
      ${demo(l)}
    </section>

    <section class="platforms" aria-label="${esc(l.platforms.watch)}">
      <p><span>${esc(l.platforms.watch)}</span> <b>Crunchyroll</b> <b>ADN</b> <b class="opt">Netflix <i>${esc(l.platforms.optional)}</i></b> <b class="opt">Disney+ <i>${esc(l.platforms.optional)}</i></b></p>
      <p><span>${esc(l.platforms.list)}</span> <b>AniList</b> <b>MyAnimeList</b></p>
    </section>

    <section class="how" id="how">
      <h2>${esc(l.how.title)}</h2>
      <ol>
        ${l.how.steps.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('\n        ')}
      </ol>
    </section>

    <section class="features" id="features">
      <h2>${esc(l.features.title)}</h2>
      ${l.features.items.map((f) => `
      <article class="feature">
        <div class="feature-text"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>
        <img src="${shot(l, f.shot)}" alt="${esc(f.title)}" width="1280" height="800" loading="lazy" decoding="async">
      </article>`).join('')}
      <div class="more">
        <h3>${esc(l.features.moreTitle)}</h3>
        <ul>${l.features.more.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
      </div>
    </section>

    <section class="privacy" id="privacy">
      <img class="kai" src="/assets/kai-icon.svg" alt="" width="128" height="128">
      <div>
        <h2>${esc(l.privacy.title)}</h2>
        <p>${esc(l.privacy.text)}</p>
        <ul>${l.privacy.points.map((p) => `<li>${icon.check}<span>${esc(p)}</span></li>`).join('')}</ul>
        <a class="textlink" href="${privacyUrl}">${esc(l.privacy.link)}</a>
      </div>
    </section>

    <section class="faq" id="faq">
      <h2>${esc(l.faq.title)}</h2>
      ${l.faq.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n      ')}
    </section>

    <section class="cta">
      <h2>${esc(l.cta.title)}</h2>
      <p>${esc(l.cta.text)}</p>
      ${storeButtons(l, 'center')}
    </section>
  </main>

  <footer class="foot">
    <nav aria-label="${esc(l.footer.source)}">
      <a href="${REPO}">${esc(l.footer.source)}</a>
      <a href="${REPO}/issues">${esc(l.footer.issues)}</a>
      <a href="${REPO}/blob/main/CHANGELOG.md">${esc(l.footer.changelog)}</a>
      <a href="${privacyUrl}">${esc(l.footer.privacy)}</a>
    </nav>
    <nav class="langs" aria-label="${esc(l.nav.language)}">
      ${locales.map((o) => `<a href="/${o.code}/" hreflang="${o.code}" lang="${o.code}" data-lang="${o.code}"${o.code === l.code ? ' aria-current="true"' : ''}>${esc(o.name)}</a>`).join('\n      ')}
    </nav>
    <p>${esc(l.footer.disclaimer)}</p>
    <p>MIT © 2026 Quentin Geerts</p>
  </footer>
</body>
</html>
`;
};

// Root page: sends visitors to their language (saved choice, then browser languages, then English).
const root = () => `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SyncKai</title>
  <link rel="canonical" href="${SITE}/${DEFAULT_LANG}/">
  ${locales.map((o) => `<link rel="alternate" hreflang="${o.code}" href="${SITE}/${o.code}/">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${SITE}/">
  <link rel="icon" href="/assets/kai-icon.svg" type="image/svg+xml">
  <meta name="theme-color" content="#141A3D">
  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#141A3D;color:#EEF0FF;font:16px/1.5 system-ui,sans-serif}a{color:#46D6FF;margin:0 .5em}</style>
  <script>
    (function () {
      var langs = ${JSON.stringify(locales.map((o) => o.code))};
      var pick = null;
      try { pick = localStorage.getItem('synckai-lang'); } catch (e) {}
      if (langs.indexOf(pick) < 0) {
        pick = '${DEFAULT_LANG}';
        var wanted = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < wanted.length; i++) {
          var c = String(wanted[i]).toLowerCase().split('-')[0];
          if (langs.indexOf(c) >= 0) { pick = c; break; }
        }
      }
      location.replace('/' + pick + '/' + location.hash);
    })();
  </script>
</head>
<body>
  <p>${locales.map((o) => `<a href="/${o.code}/" hreflang="${o.code}">${esc(o.name)}</a>`).join('')}</p>
</body>
</html>
`;

const redirect = (url, label) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(label)}</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${url}">
  <meta http-equiv="refresh" content="0; url=${url}">
  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#141A3D;color:#EEF0FF;font:16px/1.5 system-ui,sans-serif}a{color:#46D6FF}</style>
</head>
<body><a href="${url}">${esc(label)}</a></body>
</html>
`;

const write = (path, content) => {
  mkdirSync(join(OUT, path), { recursive: true });
  writeFileSync(join(OUT, path, 'index.html'), content);
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('src/assets', join(OUT, 'assets'), { recursive: true });
cpSync('src/static', OUT, { recursive: true });
write('', root());
for (const l of locales) write(l.code, page(l));
const en = locales.find((o) => o.code === DEFAULT_LANG);
write('chrome', redirect(`https://chromewebstore.google.com/detail/${CHROME_ID}`, 'SyncKai, Chrome Web Store'));
write('firefox', redirect('https://addons.mozilla.org/firefox/addon/synckai/', 'SyncKai, Firefox Add-ons'));
write('github', redirect(REPO, 'SyncKai on GitHub'));
write('privacy', redirect(`${REPO}/blob/main/PRIVACY.md`, en.footer.privacy));
writeFileSync(join(OUT, '404.html'), root().replace("location.replace('/' + pick + '/' + location.hash);", "location.replace('/' + pick + '/');"));
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales.map((l) => `  <url>
    <loc>${SITE}/${l.code}/</loc>
${locales.map((o) => `    <xhtml:link rel="alternate" hreflang="${o.code}" href="${SITE}/${o.code}/"/>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`);
console.log(`Built ${locales.length} languages (${locales.map((o) => o.code).join(', ')}) into ${OUT}/`);
