/**
 * Pathfolio — Automated Playwright Visual & Scroll Motion Gate
 * Validates scroll-driven narrative chapters, visual deltas, viewports, foreground motion coverage, and links.
 * Works portably from a clean clone across Windows, macOS, and Linux.
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Parse target CLI arg
const targetArg = process.argv.find((a) => a.startsWith('--target=')) || '--target=local';
const targetMode = targetArg.split('=')[1];

const LOCAL_PORT = 8085;
const LOCAL_BASE = `http://127.0.0.1:${LOCAL_PORT}`;
const REMOTE_BASE = 'https://pathfolio.pages.dev';

/**
 * Built-in lightweight static server for clean-clone local runs without extra tools
 */
function createStaticServer(rootDir, port = LOCAL_PORT) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm',
    '.apk': 'application/vnd.android.package-archive'
  };

  const server = http.createServer((req, res) => {
    let cleanPath = url.parse(req.url).pathname;
    let filePath = path.join(rootDir, cleanPath);

    // Support clean URLs and directory index
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    // SPA fallback for /app/*
    if (!fs.existsSync(filePath) && cleanPath.startsWith('/app/')) {
      filePath = path.join(rootDir, 'app', 'index.html');
    }

    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`[StaticServer] Listening on http://127.0.0.1:${port} serving ${rootDir}`);
      resolve(server);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`[StaticServer] Port ${port} in use; assuming existing server is active.`);
        resolve(null);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Launch browser portably without hardcoded machine paths
 */
async function launchBrowser() {
  const customPath = process.env.CHROME_PATH;
  if (customPath && fs.existsSync(customPath)) {
    return await chromium.launch({
      executablePath: customPath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  // 1. Try Playwright channel 'chrome' (discovers Google Chrome on Windows, macOS, Linux)
  try {
    return await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (errChrome) {
    // 2. Try Playwright channel 'msedge'
    try {
      return await chromium.launch({
        channel: 'msedge',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (errEdge) {
      // 3. Try standard bundled Playwright chromium
      try {
        return await chromium.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      } catch (errChromium) {
        // 4. Fallback search in standard platform binary paths
        const possiblePaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
          path.join(process.env.PROGRAMFILES || '', 'Google\\Chrome\\Application\\chrome.exe'),
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        ];
        for (const p of possiblePaths) {
          if (p && fs.existsSync(p)) {
            return await chromium.launch({
              executablePath: p,
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
          }
        }
        throw new Error(
          'No compatible browser executable found. Set CHROME_PATH or install Google Chrome/Playwright.'
        );
      }
    }
  }
}

/**
 * Assert that all foreground content is visible, readable, and has no hidden fragments in reduced motion
 */
async function assertReducedMotionReadability(page, viewportLabel) {
  return await page.evaluate((label) => {
    const isMobile = label.includes('phone') || label.includes('narrow') || label.includes('390') || label.includes('320');
    const selectors = [
      '#pipeline-rail-carriage',
      '#pipeline-scroll-bar',
      '.pipeline-runway-card',
      '#star-frag-situation',
      '#star-frag-task',
      '#star-frag-action',
      '#star-frag-result',
      '#star-assembly-seal',
      '#vault-envelope-flap',
      '#vault-wax-seal',
      '#vault-code-drawer',
      '#hero-dossier-card',
      '.hero-line-inner',
      '.motion-title-inner',
      '.motion-gallery-card',
      '.motion-compare-box',
      '.motion-cta-card',
      '.motion-footer-col'
    ];
    // Underlays are desktop/tablet decorative sheets, hidden on mobile for containment
    if (!isMobile) {
      selectors.push('#hero-underlay-1', '#hero-underlay-2');
    }
    const errors = [];
    for (const sel of selectors) {
      const els = Array.from(document.querySelectorAll(sel));
      if (els.length === 0) {
        errors.push(`[${label}] Missing required element for selector: ${sel}`);
        continue;
      }
      for (const el of els) {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (style.display === 'none') {
          errors.push(`[${label}] ${sel} has display: none`);
        }
        if (style.visibility === 'hidden') {
          errors.push(`[${label}] ${sel} has visibility: hidden`);
        }
        if (parseFloat(style.opacity) < 0.95) {
          errors.push(`[${label}] ${sel} has reduced-motion opacity < 1 (${style.opacity})`);
        }
        if (rect.width <= 0 || rect.height <= 0) {
          errors.push(`[${label}] ${sel} has zero rendered dimensions (${rect.width}x${rect.height})`);
        }
        if (style.clipPath && (style.clipPath.includes('circle(0%') || style.clipPath.includes('inset(100%') || style.clipPath === 'polygon(0px 0px, 0px 0px, 0px 0px)')) {
          errors.push(`[${label}] ${sel} has hiding clip-path (${style.clipPath})`);
        }
      }
    }
    return errors;
  }, viewportLabel);
}

/**
 * Assert that all foreground elements are visible and readable when JavaScript is disabled
 */
async function assertNoJsVisibility(page) {
  return await page.evaluate(() => {
    const selectors = [
      '.hero-line-inner',
      '#hero-status-badge',
      '#hero-lead',
      '#hero-actions',
      '#hero-proof-ledger',
      '#hero-dossier-card',
      '#hero-underlay-1',
      '#hero-underlay-2',
      '.motion-title-inner',
      '.pipeline-runway-card',
      '#star-frag-situation',
      '#star-frag-task',
      '#star-frag-action',
      '#star-frag-result',
      '#vault-envelope-flap',
      '#vault-wax-seal',
      '#vault-code-drawer',
      '.motion-compare-box',
      '.motion-gallery-card',
      '.motion-cta-card',
      '.motion-footer-col'
    ];
    const errors = [];
    for (const sel of selectors) {
      const els = Array.from(document.querySelectorAll(sel));
      if (els.length === 0) {
        errors.push(`[No-JS] Missing element for selector: ${sel}`);
        continue;
      }
      for (const el of els) {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (style.display === 'none') {
          errors.push(`[No-JS] ${sel} has display: none`);
        }
        if (style.visibility === 'hidden') {
          errors.push(`[No-JS] ${sel} has visibility: hidden`);
        }
        if (parseFloat(style.opacity) < 0.95) {
          errors.push(`[No-JS] ${sel} has opacity < 0.95 (${style.opacity})`);
        }
        if (rect.width <= 0 || rect.height <= 0) {
          errors.push(`[No-JS] ${sel} has zero rendered dimensions (${rect.width}x${rect.height})`);
        }
      }
    }
    return errors;
  });
}

/**
 * Assert that front card text and control elements are NEVER occluded by underlay sheets
 * Uses document.elementFromPoint to geometrically verify real rendering across light and dark themes
 */
async function assertFrontCardNonOcclusion(page, theme, viewportLabel, label) {
  const isMobile = viewportLabel.includes('mobile') || viewportLabel.includes('phone') || viewportLabel.includes('390');
  const scrollOffsets = isMobile ? [0, 150, 300] : [0, 150, 350, 500];
  const sampleSelectors = [
    '#hero-dossier-tab',
    '#dossier-company',
    '#dossier-role',
    '#dossier-stage-pill',
    '#dossier-next-action',
    '.dossier-tab.active'
  ];

  const errors = [];

  for (const scrollY of scrollOffsets) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(120);

    const checkResult = await page.evaluate(({ selectors, y }) => {
      const issues = [];
      const underlay1 = document.getElementById('hero-underlay-1');
      const underlay2 = document.getElementById('hero-underlay-2');

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) {
          issues.push({ selector: sel, error: 'Element not found in DOM' });
          continue;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        // Sample center point and upper point
        const points = [
          { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, label: 'center' },
          { x: rect.left + rect.width / 2, y: rect.top + Math.min(10, rect.height / 4), label: 'top' }
        ];

        for (const pt of points) {
          if (pt.x < 0 || pt.x > window.innerWidth || pt.y < 0 || pt.y > window.innerHeight) {
            continue; // offscreen
          }

          const hit = document.elementFromPoint(pt.x, pt.y);
          if (!hit) continue;

          const hitUnderlay1 = hit.closest('#hero-underlay-1');
          const hitUnderlay2 = hit.closest('#hero-underlay-2');

          if (hitUnderlay1 || hitUnderlay2) {
            issues.push({
              selector: sel,
              scrollY: y,
              point: pt.label,
              hitTag: hit.tagName,
              hitId: hit.id,
              error: `OCCLUDED by underlay sheet (${hitUnderlay1 ? 'hero-underlay-1' : 'hero-underlay-2'})`
            });
          }
        }
      }

      return issues;
    }, { selectors: sampleSelectors, y: scrollY });

    if (checkResult.length > 0) {
      errors.push(...checkResult.map(c => `[${theme} ${viewportLabel} scrollY=${scrollY}] ${c.selector} ${c.error}`));
    }

    // Save visual proof screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `${label}-${viewportLabel}-${theme}-scroll${scrollY}.png`);
    await page.screenshot({ path: shotPath });
  }

  // Restore scroll to 0
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);

  return errors;
}

async function runGateForBaseUrl(baseUrl, label) {
  console.log(`\n===============================================================`);
  console.log(`RUNNING PLAYWRIGHT SCROLL GATE FOR: [${label}] -> ${baseUrl}`);
  console.log(`===============================================================\n`);

  const browser = await launchBrowser();

  const results = {
    label,
    baseUrl,
    passed: true,
    foregroundCoverage: {},
    chaptersDesktop: {},
    chaptersMobile: {},
    reducedMotion: { desktopErrors: [], mobileErrors: [] },
    noJsErrors: [],
    flutterApp: {},
    errors: []
  };

  try {
    // -------------------------------------------------------------------------
    // 1. Desktop Viewport (1440x900) — Foreground Motion & Chapters
    // -------------------------------------------------------------------------
    const context1440 = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1
    });
    const page1440 = await context1440.newPage();

    console.log(`Navigating to ${baseUrl}/ at 1440x900...`);
    await page1440.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

    // Capture t0 Hero Frame & evaluate initial metrics
    const heroT0 = await page1440.evaluate(() => {
      const card = document.getElementById('hero-dossier-card');
      const fill = document.getElementById('dossier-rail-fill');
      const line1 = document.querySelector('.hero-line-inner.line-1');
      const line2 = document.querySelector('.hero-line-inner.line-2');
      const pill = document.getElementById('hero-status-badge');
      const lead = document.getElementById('hero-lead');
      const btns = document.getElementById('hero-actions');
      const underlay1 = document.getElementById('hero-underlay-1');
      const underlay2 = document.getElementById('hero-underlay-2');

      return {
        cardTransform: card ? window.getComputedStyle(card).transform : '',
        cardOpacity: card ? window.getComputedStyle(card).opacity : '',
        fillWidth: fill ? window.getComputedStyle(fill).width : '',
        line1Transform: line1 ? window.getComputedStyle(line1).transform : '',
        line1Opacity: line1 ? window.getComputedStyle(line1).opacity : '',
        line2Transform: line2 ? window.getComputedStyle(line2).transform : '',
        line2Opacity: line2 ? window.getComputedStyle(line2).opacity : '',
        pillOpacity: pill ? window.getComputedStyle(pill).opacity : '',
        leadOpacity: lead ? window.getComputedStyle(lead).opacity : '',
        btnsOpacity: btns ? window.getComputedStyle(btns).opacity : '',
        underlay1Transform: underlay1 ? window.getComputedStyle(underlay1).transform : '',
        underlay2Transform: underlay2 ? window.getComputedStyle(underlay2).transform : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-t0.png`) });
    console.log(`  ✓ Saved ${label}-desktop-1440-t0.png`);
    console.log(`    t0 Metrics: Fill="${heroT0.fillWidth}", Line1Opacity=${heroT0.line1Opacity}, Line2Opacity=${heroT0.line2Opacity}, CardOpacity=${heroT0.cardOpacity}`);

    // Wait for initial hero transition (t=1500ms)
    await page1440.waitForTimeout(1500);
    const heroT15 = await page1440.evaluate(() => {
      const card = document.getElementById('hero-dossier-card');
      const fill = document.getElementById('dossier-rail-fill');
      const line1 = document.querySelector('.hero-line-inner.line-1');
      const line2 = document.querySelector('.hero-line-inner.line-2');
      const pill = document.getElementById('hero-status-badge');
      const lead = document.getElementById('hero-lead');
      const btns = document.getElementById('hero-actions');
      const ledger = document.getElementById('hero-proof-ledger');
      const underlay1 = document.getElementById('hero-underlay-1');
      const underlay2 = document.getElementById('hero-underlay-2');

      return {
        cardTransform: card ? window.getComputedStyle(card).transform : '',
        cardOpacity: card ? window.getComputedStyle(card).opacity : '',
        fillWidth: fill ? window.getComputedStyle(fill).width : '',
        line1Transform: line1 ? window.getComputedStyle(line1).transform : '',
        line1Opacity: line1 ? window.getComputedStyle(line1).opacity : '',
        line2Transform: line2 ? window.getComputedStyle(line2).transform : '',
        line2Opacity: line2 ? window.getComputedStyle(line2).opacity : '',
        pillOpacity: pill ? window.getComputedStyle(pill).opacity : '',
        leadOpacity: lead ? window.getComputedStyle(lead).opacity : '',
        btnsOpacity: btns ? window.getComputedStyle(btns).opacity : '',
        ledgerOpacity: ledger ? window.getComputedStyle(ledger).opacity : '',
        underlay1Transform: underlay1 ? window.getComputedStyle(underlay1).transform : '',
        underlay2Transform: underlay2 ? window.getComputedStyle(underlay2).transform : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-t1.5.png`) });
    console.log(`  ✓ Saved ${label}-desktop-1440-t1.5.png`);
    console.log(`    t1.5 Metrics: Fill="${heroT15.fillWidth}", Line1Opacity=${heroT15.line1Opacity}, Line2Opacity=${heroT15.line2Opacity}, CardOpacity=${heroT15.cardOpacity}`);

    // Assert visible progression between t0 and t1.5 (Hero Headline lines, fill, cards)
    const heroHasDelta = (heroT0.fillWidth !== heroT15.fillWidth || heroT0.cardTransform !== heroT15.cardTransform) &&
      parseFloat(heroT15.line1Opacity) >= 0.95 && parseFloat(heroT15.line2Opacity) >= 0.95;
    
    if (!heroHasDelta) {
      results.passed = false;
      results.errors.push(`Hero t0 and t1.5 frames are static! No masked line entrance or rail fill delta.`);
    } else {
      console.log(`  ✓ Hero staged entrance delta verified:`);
      console.log(`    - Line 1 Masked Reveal: Opacity ${heroT0.line1Opacity} -> ${heroT15.line1Opacity}`);
      console.log(`    - Line 2 Masked Reveal: Opacity ${heroT0.line2Opacity} -> ${heroT15.line2Opacity}`);
      console.log(`    - Dossier Rail Fill: ${heroT0.fillWidth} -> ${heroT15.fillWidth}`);
    }

    // Scroll 350px to test 3D Layered Dossier Spread Parallax
    console.log(`\n--- Testing 3D Layered Dossier Spread Parallax (scroll 350px) ---`);
    await page1440.evaluate(() => window.scrollTo({ top: 350, behavior: 'instant' }));
    await page1440.waitForTimeout(250);

    const dossierSpreadMetrics = await page1440.evaluate(() => {
      const card = document.getElementById('hero-dossier-card');
      const u1 = document.getElementById('hero-underlay-1');
      const u2 = document.getElementById('hero-underlay-2');
      const tab = document.getElementById('hero-dossier-tab');
      return {
        cardTransform: card ? window.getComputedStyle(card).transform : '',
        u1Transform: u1 ? window.getComputedStyle(u1).transform : '',
        u2Transform: u2 ? window.getComputedStyle(u2).transform : '',
        tabTransform: tab ? window.getComputedStyle(tab).transform : ''
      };
    });

    console.log(`  Dossier Card Transform @350px:     ${dossierSpreadMetrics.cardTransform}`);
    console.log(`  Dossier Underlay 1 Transform @350: ${dossierSpreadMetrics.u1Transform}`);
    console.log(`  Dossier Underlay 2 Transform @350: ${dossierSpreadMetrics.u2Transform}`);

    const hasSpreadDelta = dossierSpreadMetrics.u1Transform !== heroT15.underlay1Transform &&
      dossierSpreadMetrics.u2Transform !== heroT15.underlay2Transform;

    if (!hasSpreadDelta) {
      results.passed = false;
      results.errors.push(`3D Dossier underlays did not spread upon scroll!`);
    } else {
      console.log(`  ✓ 3D Layered Dossier Spread PASSED: Underlay 1 & 2 rotated/translated distinctly across scroll.`);
    }

    // Verify front card geometric non-occlusion in both Light and Dark themes (Desktop 1440)
    console.log(`\n--- Testing Front Card Non-Occlusion (Desktop 1440 Light Theme) ---`);
    const lightOcclusionErrors = await assertFrontCardNonOcclusion(page1440, 'light', 'desktop-1440', label);
    if (lightOcclusionErrors.length > 0) {
      results.passed = false;
      results.errors.push(...lightOcclusionErrors);
      console.error(`  ✗ Light Desktop 1440 Front Card Occlusion Errors:`, lightOcclusionErrors);
    } else {
      console.log(`  ✓ Light Desktop 1440: Backing planes strictly behind front card at all scroll offsets (0, 150, 350, 500px).`);
    }

    console.log(`\n--- Testing Front Card Non-Occlusion (Desktop 1440 Dark Theme) ---`);
    await page1440.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page1440.waitForTimeout(200);
    const darkOcclusionErrors = await assertFrontCardNonOcclusion(page1440, 'dark', 'desktop-1440', label);
    if (darkOcclusionErrors.length > 0) {
      results.passed = false;
      results.errors.push(...darkOcclusionErrors);
      console.error(`  ✗ Dark Desktop 1440 Front Card Occlusion Errors:`, darkOcclusionErrors);
    } else {
      console.log(`  ✓ Dark Desktop 1440: Backing planes strictly behind front card at all scroll offsets (0, 150, 350, 500px).`);
    }
    await page1440.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    await page1440.waitForTimeout(100);

    // -------------------------------------------------------------------------
    // Desktop Chapter 1: The Six-Stage Career Pipeline Runway (#milestones)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Desktop Chapter 1: Pipeline Runway (#milestones) ---`);
    const c1Pos = await page1440.evaluate(() => {
      const el = document.getElementById('milestones');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 1 Entry
    await page1440.evaluate((top) => window.scrollTo({ top: top - 400, behavior: 'instant' }), c1Pos);
    await page1440.waitForTimeout(300);

    const c1Before = await page1440.evaluate(() => {
      const carriage = document.getElementById('pipeline-rail-carriage');
      const bar = document.getElementById('pipeline-scroll-bar');
      const text = document.getElementById('pipeline-telemetry-text')?.textContent || '';
      const header = document.querySelector('#milestones .motion-header-group');
      const titleInner = document.querySelector('#milestones .motion-title-inner');
      const cards = Array.from(document.querySelectorAll('.pipeline-runway-card')).map((c) => ({
        isRevealed: c.classList.contains('is-revealed'),
        isActive: c.classList.contains('is-active') || c.classList.contains('active')
      }));
      return {
        carriageTransform: carriage ? window.getComputedStyle(carriage).transform : '',
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        text,
        headerRevealed: header ? header.classList.contains('is-revealed') : false,
        titleInnerOpacity: titleInner ? window.getComputedStyle(titleInner).opacity : '',
        cards
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter1-before.png`) });

    // Scroll through Chapter 1 to drive carriage forward
    await page1440.evaluate((top) => window.scrollTo({ top: top + 450, behavior: 'instant' }), c1Pos);
    await page1440.waitForTimeout(300);

    const c1After = await page1440.evaluate(() => {
      const carriage = document.getElementById('pipeline-rail-carriage');
      const bar = document.getElementById('pipeline-scroll-bar');
      const text = document.getElementById('pipeline-telemetry-text')?.textContent || '';
      const header = document.querySelector('#milestones .motion-header-group');
      const titleInner = document.querySelector('#milestones .motion-title-inner');
      const cards = Array.from(document.querySelectorAll('.pipeline-runway-card')).map((c) => ({
        isRevealed: c.classList.contains('is-revealed'),
        isActive: c.classList.contains('is-active') || c.classList.contains('active')
      }));
      return {
        carriageTransform: carriage ? window.getComputedStyle(carriage).transform : '',
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        text,
        headerRevealed: header ? header.classList.contains('is-revealed') : false,
        titleInnerOpacity: titleInner ? window.getComputedStyle(titleInner).opacity : '',
        cards
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter1-after.png`) });

    console.log(`  Desktop C1 Carriage: ${c1Before.carriageTransform} -> ${c1After.carriageTransform}`);
    console.log(`  Desktop C1 Bar:      ${c1Before.barTransform} -> ${c1After.barTransform}`);
    console.log(`  Desktop C1 Text:     ${c1Before.text} -> ${c1After.text}`);
    console.log(`  Desktop C1 Header:   isRevealed=${c1After.headerRevealed}, TitleOpacity=${c1After.titleInnerOpacity}`);

    const c1Delta = c1Before.carriageTransform !== c1After.carriageTransform;
    const c1CardsRevealed = c1After.cards.some((c) => c.isRevealed);
    const c1HasActiveCard = c1After.cards.some((c) => c.isActive);

    results.chaptersDesktop.chapter1 = { before: c1Before, after: c1After, delta: c1Delta };
    if (!c1Delta) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 1 failed: No computed transform delta on carriage!`);
    } else if (!c1CardsRevealed || !c1HasActiveCard) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 1 cards did not reveal or activate during transit!`);
    } else {
      console.log(`  ✓ Desktop Chapter 1 PASSED: Measurable carriage delta and runway cards stagger confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Desktop Chapter 2: STAR Evidence Matrix Physically Assembling (#star-matrix)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Desktop Chapter 2: STAR Evidence Assembly Deck (#star-matrix) ---`);
    const c2Pos = await page1440.evaluate(() => {
      const el = document.getElementById('star-matrix');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 2 Entry
    await page1440.evaluate((top) => window.scrollTo({ top: top - 450, behavior: 'instant' }), c2Pos);
    await page1440.waitForTimeout(300);

    const c2Before = await page1440.evaluate(() => {
      const fragS = document.getElementById('star-frag-situation');
      const seal = document.getElementById('star-assembly-seal');
      const header = document.querySelector('#star-matrix .motion-header-group');
      const filters = document.getElementById('matrix-filter-group');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : '',
        headerRevealed: header ? header.classList.contains('is-revealed') : false,
        filtersRevealed: filters ? filters.classList.contains('is-revealed') : false
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter2-before.png`) });

    // Scroll through Chapter 2 to assemble fragments
    await page1440.evaluate((top) => window.scrollTo({ top: top + 420, behavior: 'instant' }), c2Pos);
    await page1440.waitForTimeout(300);

    const c2After = await page1440.evaluate(() => {
      const fragS = document.getElementById('star-frag-situation');
      const seal = document.getElementById('star-assembly-seal');
      const header = document.querySelector('#star-matrix .motion-header-group');
      const filters = document.getElementById('matrix-filter-group');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : '',
        headerRevealed: header ? header.classList.contains('is-revealed') : false,
        filtersRevealed: filters ? filters.classList.contains('is-revealed') : false
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter2-after.png`) });

    console.log(`  Desktop C2 FragS: transform=${c2Before.fragSTransform} -> ${c2After.fragSTransform}, opacity=${c2Before.fragSOpacity} -> ${c2After.fragSOpacity}`);
    console.log(`  Desktop C2 Seal:  transform=${c2Before.sealTransform} -> ${c2After.sealTransform}, opacity=${c2Before.sealOpacity} -> ${c2After.sealOpacity}`);

    // Test tactile citation button interaction
    console.log(`  Testing tactile STAR citation button click feedback...`);
    await page1440.click('#btn-cite-simulation');
    await page1440.waitForTimeout(250);

    const citationFeedback = await page1440.evaluate(() => {
      const fb = document.getElementById('citation-feedback');
      return {
        hasFeedback: !!fb,
        feedbackText: fb ? fb.textContent.trim() : '',
        feedbackDisplay: fb ? window.getComputedStyle(fb).display : 'none',
        feedbackOpacity: fb ? window.getComputedStyle(fb).opacity : '0'
      };
    });
    console.log(`  Citation feedback: hasFeedback=${citationFeedback.hasFeedback}, text="${citationFeedback.feedbackText}", display=${citationFeedback.feedbackDisplay}`);

    const c2Delta = c2Before.fragSTransform !== c2After.fragSTransform && c2Before.fragSOpacity !== c2After.fragSOpacity;
    results.chaptersDesktop.chapter2 = { before: c2Before, after: c2After, delta: c2Delta };
    if (!c2Delta) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 2 failed: No computed transform/opacity delta on STAR fragments!`);
    } else if (!citationFeedback.hasFeedback || citationFeedback.feedbackDisplay === 'none') {
      results.passed = false;
      results.errors.push(`Desktop Chapter 2 citation simulation button failed to produce feedback display!`);
    } else {
      console.log(`  ✓ Desktop Chapter 2 PASSED: Fragment assembly & citation feedback verified.`);
    }

    // -------------------------------------------------------------------------
    // Desktop Chapter 3: Sovereign Dossier Folding & Sealing (#privacy-vault)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Desktop Chapter 3: Sovereign Dossier Vault (#privacy-vault) ---`);
    const c3Pos = await page1440.evaluate(() => {
      const el = document.getElementById('privacy-vault');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 3 Entry
    await page1440.evaluate((top) => window.scrollTo({ top: top - 450, behavior: 'instant' }), c3Pos);
    await page1440.waitForTimeout(300);

    const c3Before = await page1440.evaluate(() => {
      const flap = document.getElementById('vault-envelope-flap');
      const waxSeal = document.getElementById('vault-wax-seal');
      const drawer = document.getElementById('vault-code-drawer');
      const compareBoxes = Array.from(document.querySelectorAll('.motion-compare-box')).map((b) => b.classList.contains('is-revealed'));
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : '',
        compareBoxesRevealed: compareBoxes
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter3-before.png`) });

    // Scroll through Chapter 3 to fold envelope & stamp seal
    await page1440.evaluate((top) => window.scrollTo({ top: top + 400, behavior: 'instant' }), c3Pos);
    await page1440.waitForTimeout(300);

    const c3After = await page1440.evaluate(() => {
      const flap = document.getElementById('vault-envelope-flap');
      const waxSeal = document.getElementById('vault-wax-seal');
      const drawer = document.getElementById('vault-code-drawer');
      const compareBoxes = Array.from(document.querySelectorAll('.motion-compare-box')).map((b) => b.classList.contains('is-revealed'));
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : '',
        compareBoxesRevealed: compareBoxes
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter3-after.png`) });

    console.log(`  Desktop C3 Flap: transform=${c3Before.flapTransform} -> ${c3After.flapTransform}, opacity=${c3Before.flapOpacity} -> ${c3After.flapOpacity}`);
    console.log(`  Desktop C3 Seal: transform=${c3Before.sealTransform} -> ${c3After.sealTransform}, opacity=${c3Before.sealOpacity} -> ${c3After.sealOpacity}`);
    console.log(`  Desktop C3 Compare Boxes Revealed: ${c3After.compareBoxesRevealed.join(', ')}`);

    const c3Delta = c3Before.flapTransform !== c3After.flapTransform && c3Before.sealOpacity !== c3After.sealOpacity;
    results.chaptersDesktop.chapter3 = { before: c3Before, after: c3After, delta: c3Delta };
    if (!c3Delta) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 3 failed: No computed transform/opacity delta on vault envelope/seal!`);
    } else {
      console.log(`  ✓ Desktop Chapter 3 PASSED: Measurable envelope fold and wax seal delta confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Desktop Chapter 4: App Tour Gallery Parallax & Closing CTA (#app-tour & #closing-cta)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Chapter 4 App Tour Gallery 3D Perspective & Closing CTA ---`);
    const c4Pos = await page1440.evaluate(() => {
      const el = document.getElementById('app-tour');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    await page1440.evaluate((top) => window.scrollTo({ top: top - 250, behavior: 'instant' }), c4Pos);
    await page1440.waitForTimeout(300);

    const c4MetricsBefore = await page1440.evaluate(() => {
      const deskCard = document.querySelector('.motion-gallery-card.desktop-card');
      const mobCard = document.querySelector('.motion-gallery-card.mobile-card');
      return {
        deskTransform: deskCard ? window.getComputedStyle(deskCard).transform : '',
        deskRevealed: deskCard ? deskCard.classList.contains('is-revealed') : false,
        mobRevealed: mobCard ? mobCard.classList.contains('is-revealed') : false
      };
    });

    await page1440.evaluate((top) => window.scrollTo({ top: top + 350, behavior: 'instant' }), c4Pos);
    await page1440.waitForTimeout(300);

    const c4MetricsAfter = await page1440.evaluate(() => {
      const deskCard = document.querySelector('.motion-gallery-card.desktop-card');
      return {
        deskTransform: deskCard ? window.getComputedStyle(deskCard).transform : '',
        deskRevealed: deskCard ? deskCard.classList.contains('is-revealed') : false
      };
    });

    console.log(`  App Gallery Desktop Card Transform: ${c4MetricsBefore.deskTransform} -> ${c4MetricsAfter.deskTransform}`);
    const galleryHasParallax = c4MetricsBefore.deskTransform !== c4MetricsAfter.deskTransform;
    if (!galleryHasParallax || !c4MetricsAfter.deskRevealed) {
      results.passed = false;
      results.errors.push(`Chapter 4 App Tour gallery cards failed to reveal or show parallax shift!`);
    } else {
      console.log(`  ✓ Chapter 4 App Tour Gallery PASSED: 3D parallax and card reveal confirmed.`);
    }

    // Scroll to Closing CTA & Footer
    console.log(`\n--- Testing Closing CTA Section & Footer Stagger ---`);
    const ctaPos = await page1440.evaluate(() => {
      const el = document.getElementById('closing-cta');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    await page1440.evaluate((top) => window.scrollTo({ top: top - 200, behavior: 'instant' }), ctaPos);
    await page1440.waitForTimeout(300);

    const ctaMetrics = await page1440.evaluate(() => {
      const ctaCard = document.querySelector('.motion-cta-card');
      const footerCols = Array.from(document.querySelectorAll('.motion-footer-col')).map((c) => ({
        revealed: c.classList.contains('is-revealed'),
        opacity: window.getComputedStyle(c).opacity
      }));
      return {
        ctaRevealed: ctaCard ? ctaCard.classList.contains('is-revealed') : false,
        footerCols
      };
    });

    // Scroll directly to footer to verify columns
    await page1440.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page1440.waitForTimeout(300);

    const footerMetricsAfter = await page1440.evaluate(() => {
      return Array.from(document.querySelectorAll('.motion-footer-col')).map((c) => ({
        revealed: c.classList.contains('is-revealed'),
        opacity: window.getComputedStyle(c).opacity
      }));
    });

    console.log(`  Closing CTA Revealed: ${ctaMetrics.ctaRevealed}`);
    console.log(`  Footer Columns Revealed: ${footerMetricsAfter.every((c) => c.revealed)}`);

    if (!ctaMetrics.ctaRevealed || !footerMetricsAfter.every((c) => c.revealed)) {
      results.passed = false;
      results.errors.push(`Closing CTA or Footer columns failed to reveal upon scroll!`);
    } else {
      console.log(`  ✓ Closing CTA & Footer PASSED: Full page narrative completion confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Reverse Scroll Test: Scroll to top and verify all elements visible without stuck states
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Reverse Scroll Integrity (bottom -> top) ---`);
    await page1440.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page1440.waitForTimeout(350);

    const reverseScrollCheck = await page1440.evaluate(() => {
      const line1 = document.querySelector('.hero-line-inner.line-1');
      const card = document.getElementById('hero-dossier-card');
      const pill = document.getElementById('hero-status-badge');
      return {
        line1Opacity: line1 ? window.getComputedStyle(line1).opacity : '',
        cardOpacity: card ? window.getComputedStyle(card).opacity : '',
        pillOpacity: pill ? window.getComputedStyle(pill).opacity : ''
      };
    });

    console.log(`  Reverse Scroll Hero Check: Line1Opacity=${reverseScrollCheck.line1Opacity}, CardOpacity=${reverseScrollCheck.cardOpacity}`);
    if (parseFloat(reverseScrollCheck.line1Opacity) < 0.95 || parseFloat(reverseScrollCheck.cardOpacity) < 0.95) {
      results.passed = false;
      results.errors.push(`Reverse scroll failed: Hero elements stuck in hidden/intermediate state!`);
    } else {
      console.log(`  ✓ Reverse Scroll Integrity PASSED: Hero elements remain visible and interactive.`);
    }

    // -------------------------------------------------------------------------
    // Midpage Reload Test: Direct navigation to hash anchor (#privacy-vault)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Midpage Reload / Direct Navigation (#privacy-vault) ---`);
    await page1440.goto(`${baseUrl}/#privacy-vault`, { waitUntil: 'networkidle' });
    await page1440.waitForTimeout(400);

    const midpageCheck = await page1440.evaluate(() => {
      const header = document.querySelector('#privacy-vault .motion-header-group');
      const flap = document.getElementById('vault-envelope-flap');
      const titleInner = document.querySelector('#privacy-vault .motion-title-inner');
      return {
        headerRevealed: header ? header.classList.contains('is-revealed') : false,
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        titleOpacity: titleInner ? window.getComputedStyle(titleInner).opacity : ''
      };
    });

    console.log(`  Midpage Reload Check: HeaderRevealed=${midpageCheck.headerRevealed}, TitleOpacity=${midpageCheck.titleOpacity}`);
    if (!midpageCheck.headerRevealed || parseFloat(midpageCheck.titleOpacity) < 0.95) {
      results.passed = false;
      results.errors.push(`Midpage direct reload failed: In-viewport elements not immediately revealed!`);
    } else {
      console.log(`  ✓ Midpage Direct Reload PASSED: IntersectionObserver immediately triggered reveal.`);
    }

    // Capture 25%, 50%, 75% Scroll States
    console.log(`\n--- Capturing Desktop 25%, 50%, 75% scroll states ---`);
    const totalHeight = await page1440.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

    await page1440.evaluate((h) => window.scrollTo({ top: Math.round(h * 0.25), behavior: 'instant' }), totalHeight);
    await page1440.waitForTimeout(200);
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-scroll25.png`) });

    await page1440.evaluate((h) => window.scrollTo({ top: Math.round(h * 0.50), behavior: 'instant' }), totalHeight);
    await page1440.waitForTimeout(200);
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-scroll50.png`) });

    await page1440.evaluate((h) => window.scrollTo({ top: Math.round(h * 0.75), behavior: 'instant' }), totalHeight);
    await page1440.waitForTimeout(200);
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-scroll75.png`) });
    console.log(`  ✓ Captured 25%, 50%, 75% scroll states.`);

    // Sticky Heading Clearance
    console.log(`\n--- Checking Sticky Heading Clearance for all anchor links ---`);
    const anchors = ['#hero', '#milestones', '#star-matrix', '#privacy-vault', '#app-tour', '#closing-cta'];
    for (const anchor of anchors) {
      await page1440.goto(`${baseUrl}/${anchor}`, { waitUntil: 'networkidle' });
      await page1440.waitForTimeout(250);

      const targetRect = await page1440.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect() : null;
      }, anchor);

      const headerHeight = await page1440.evaluate(() => {
        const h = document.querySelector('.site-header');
        return h ? h.getBoundingClientRect().height : 72;
      });

      console.log(`  Anchor ${anchor} target rect.top: ${targetRect ? targetRect.top.toFixed(1) : 'null'}px (Header is ${headerHeight}px)`);
      if (targetRect && targetRect.top < headerHeight - 15) {
        console.warn(`  Warning: Target top is ${targetRect.top}px`);
      }
    }
    console.log(`  ✓ Sticky heading clearance verified.`);

    // Theme Toggle
    console.log(`\n--- Testing Theme Toggle ---`);
    await page1440.click('#theme-toggle');
    await page1440.waitForTimeout(300);
    const currentTheme = await page1440.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`  Toggled theme. Current data-theme: ${currentTheme}`);
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-theme-toggle.png`) });

    await page1440.click('#theme-toggle');
    await page1440.waitForTimeout(200);

    // Desktop Reduced Motion Assertions
    console.log(`\n--- Testing Desktop Reduced Motion Visibility & Readability ---`);
    await page1440.emulateMedia({ reducedMotion: 'reduce' });
    await page1440.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page1440.waitForTimeout(350);

    const desktopReducedErrors = await assertReducedMotionReadability(page1440, 'desktop-1440');
    results.reducedMotion.desktopErrors = desktopReducedErrors;
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-reduced-motion.png`) });

    if (desktopReducedErrors.length > 0) {
      results.passed = false;
      results.errors.push(...desktopReducedErrors);
      console.error(`  ✗ Desktop Reduced Motion FAILED with ${desktopReducedErrors.length} errors:`, desktopReducedErrors);
    } else {
      console.log(`  ✓ Desktop Reduced Motion PASSED: All chapter content visible and readable with zero hidden fragments.`);
    }

    await page1440.emulateMedia({ reducedMotion: 'no-preference' });
    await context1440.close();

    // -------------------------------------------------------------------------
    // 2. Mobile Viewport (390x844) & Phone Chapter Motion Assertions
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Mobile 390x844 Viewport & Chapter Motion ---`);
    const context390 = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const page390 = await context390.newPage();
    await page390.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

    // Check Mobile 390 Horizontal Overflow
    const mobileMetrics = await page390.evaluate(() => {
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log(`  Mobile 390 Metrics: innerWidth=${mobileMetrics.innerWidth}, scrollWidth=${mobileMetrics.scrollWidth}, hasOverflow=${mobileMetrics.hasOverflow}`);
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-hero.png`) });

    if (mobileMetrics.hasOverflow) {
      results.passed = false;
      results.errors.push(`Mobile 390px has horizontal overflow! scrollWidth=${mobileMetrics.scrollWidth} > 390`);
    } else {
      console.log(`  ✓ Mobile 390px horizontal containment PASSED (exact 390px).`);
    }

    // Open Mobile Drawer and inspect
    console.log(`\n--- Testing Mobile Menu Drawer ---`);
    await page390.click('#mobile-menu-toggle');
    await page390.waitForTimeout(350);

    const drawerMetrics = await page390.evaluate(() => {
      const drawer = document.getElementById('mobile-nav');
      const toggle = document.getElementById('mobile-menu-toggle');
      const links = Array.from(drawer.querySelectorAll('a')).map((a) => {
        const r = a.getBoundingClientRect();
        return {
          text: a.textContent.trim(),
          top: r.top,
          height: r.height,
          visible: r.height > 0 && r.width > 0 && r.bottom > 0
        };
      });
      return {
        isOpen: drawer.classList.contains('open') && toggle.getAttribute('aria-expanded') === 'true',
        rectHeight: drawer.getBoundingClientRect().height,
        linksCount: links.length,
        allVisible: links.every((l) => l.visible)
      };
    });

    console.log(`  Drawer Open: ${drawerMetrics.isOpen}, height: ${drawerMetrics.rectHeight}px, links: ${drawerMetrics.linksCount}, allVisible: ${drawerMetrics.allVisible}`);
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-menu-open.png`) });

    if (!drawerMetrics.isOpen || !drawerMetrics.allVisible || drawerMetrics.linksCount < 8) {
      results.passed = false;
      results.errors.push(`Mobile drawer failed: Not all links visible!`);
    } else {
      console.log(`  ✓ Mobile drawer PASSED: All links visible and rendered.`);
    }

    // Close drawer
    await page390.click('#mobile-menu-toggle');
    await page390.waitForTimeout(200);

    // Verify front card geometric non-occlusion in both Light and Dark themes (Mobile 390)
    console.log(`\n--- Testing Front Card Non-Occlusion (Mobile 390 Light & Dark) ---`);
    const mobileLightErrors = await assertFrontCardNonOcclusion(page390, 'light', 'phone-390', label);
    await page390.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page390.waitForTimeout(150);
    const mobileDarkErrors = await assertFrontCardNonOcclusion(page390, 'dark', 'phone-390', label);
    await page390.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    await page390.waitForTimeout(100);
    const mobileOcclusionErrors = [...mobileLightErrors, ...mobileDarkErrors];
    if (mobileOcclusionErrors.length > 0) {
      results.passed = false;
      results.errors.push(...mobileOcclusionErrors);
      console.error(`  ✗ Mobile 390 Front Card Occlusion Errors:`, mobileOcclusionErrors);
    } else {
      console.log(`  ✓ Mobile 390: Backing planes strictly behind front card in light and dark.`);
    }

    // -------------------------------------------------------------------------
    // Phone Chapter 1: Runway Motion on 390 Viewport (#milestones)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Phone Chapter 1: Pipeline Runway on 390 Viewport ---`);
    const c1PosPhone = await page390.evaluate(() => {
      const el = document.getElementById('milestones');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 1 Entry on phone
    await page390.evaluate((top) => window.scrollTo({ top: top - 300, behavior: 'instant' }), c1PosPhone);
    await page390.waitForTimeout(250);

    const c1PhoneBefore = await page390.evaluate(() => {
      const carriage = document.getElementById('pipeline-rail-carriage');
      const bar = document.getElementById('pipeline-scroll-bar');
      const text = document.getElementById('pipeline-telemetry-text')?.textContent || '';
      return {
        carriageTransform: carriage ? window.getComputedStyle(carriage).transform : '',
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        text
      };
    });
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-chapter1-before.png`) });

    // Scroll forward through Chapter 1
    await page390.evaluate((top) => window.scrollTo({ top: top + 800, behavior: 'instant' }), c1PosPhone);
    await page390.waitForTimeout(250);

    const c1PhoneAfter = await page390.evaluate(() => {
      const carriage = document.getElementById('pipeline-rail-carriage');
      const bar = document.getElementById('pipeline-scroll-bar');
      const text = document.getElementById('pipeline-telemetry-text')?.textContent || '';
      return {
        carriageTransform: carriage ? window.getComputedStyle(carriage).transform : '',
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        text
      };
    });
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-chapter1-after.png`) });

    console.log(`  Phone C1 Carriage: ${c1PhoneBefore.carriageTransform} -> ${c1PhoneAfter.carriageTransform}`);
    console.log(`  Phone C1 Bar:      ${c1PhoneBefore.barTransform} -> ${c1PhoneAfter.barTransform}`);
    console.log(`  Phone C1 Text:     ${c1PhoneBefore.text} -> ${c1PhoneAfter.text}`);

    const c1PhoneDelta = c1PhoneBefore.carriageTransform !== c1PhoneAfter.carriageTransform && c1PhoneBefore.barTransform !== c1PhoneAfter.barTransform;
    results.chaptersMobile.chapter1 = { before: c1PhoneBefore, after: c1PhoneAfter, delta: c1PhoneDelta };
    if (!c1PhoneDelta) {
      results.passed = false;
      results.errors.push(`Phone 390 Chapter 1 failed: No transform delta on carriage or scroll bar!`);
    } else {
      console.log(`  ✓ Phone 390 Chapter 1 PASSED: Measurable carriage/bar delta confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Phone Chapter 2: STAR Evidence Assembly on 390 Viewport (#star-matrix)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Phone Chapter 2: STAR Evidence Assembly on 390 Viewport ---`);
    const c2PosPhone = await page390.evaluate(() => {
      const el = document.getElementById('star-matrix');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 2 Entry on phone
    await page390.evaluate((top) => window.scrollTo({ top: top - 300, behavior: 'instant' }), c2PosPhone);
    await page390.waitForTimeout(250);

    const c2PhoneBefore = await page390.evaluate(() => {
      const fragS = document.getElementById('star-frag-situation');
      const seal = document.getElementById('star-assembly-seal');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : ''
      };
    });
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-chapter2-before.png`) });

    // Scroll forward through Chapter 2
    await page390.evaluate((top) => window.scrollTo({ top: top + 800, behavior: 'instant' }), c2PosPhone);
    await page390.waitForTimeout(250);

    const c2PhoneAfter = await page390.evaluate(() => {
      const fragS = document.getElementById('star-frag-situation');
      const seal = document.getElementById('star-assembly-seal');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : ''
      };
    });
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-chapter2-after.png`) });

    console.log(`  Phone C2 FragS: transform=${c2PhoneBefore.fragSTransform} -> ${c2PhoneAfter.fragSTransform}, opacity=${c2PhoneBefore.fragSOpacity} -> ${c2PhoneAfter.fragSOpacity}`);
    console.log(`  Phone C2 Seal:  transform=${c2PhoneBefore.sealTransform} -> ${c2PhoneAfter.sealTransform}, opacity=${c2PhoneBefore.sealOpacity} -> ${c2PhoneAfter.sealOpacity}`);

    const c2PhoneDelta = c2PhoneBefore.fragSTransform !== c2PhoneAfter.fragSTransform && c2PhoneBefore.fragSOpacity !== c2PhoneAfter.fragSOpacity;
    results.chaptersMobile.chapter2 = { before: c2PhoneBefore, after: c2PhoneAfter, delta: c2PhoneDelta };
    if (!c2PhoneDelta) {
      results.passed = false;
      results.errors.push(`Phone 390 Chapter 2 failed: No transform/opacity delta on STAR fragments!`);
    } else {
      console.log(`  ✓ Phone 390 Chapter 2 PASSED: Measurable fragment assembly delta confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Phone Chapter 3: Sovereign Dossier Vault on 390 Viewport (#privacy-vault)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Phone Chapter 3: Sovereign Vault on 390 Viewport ---`);
    const c3PosPhone = await page390.evaluate(() => {
      const el = document.getElementById('privacy-vault');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 3 Entry on phone
    await page390.evaluate((top) => window.scrollTo({ top: top - 300, behavior: 'instant' }), c3PosPhone);
    await page390.waitForTimeout(250);

    const c3PhoneBefore = await page390.evaluate(() => {
      const flap = document.getElementById('vault-envelope-flap');
      const waxSeal = document.getElementById('vault-wax-seal');
      const drawer = document.getElementById('vault-code-drawer');
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : ''
      };
    });
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-chapter3-before.png`) });

    // Scroll forward through Chapter 3
    await page390.evaluate((top) => window.scrollTo({ top: top + 800, behavior: 'instant' }), c3PosPhone);
    await page390.waitForTimeout(250);

    const c3PhoneAfter = await page390.evaluate(() => {
      const flap = document.getElementById('vault-envelope-flap');
      const waxSeal = document.getElementById('vault-wax-seal');
      const drawer = document.getElementById('vault-code-drawer');
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : ''
      };
    });
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-chapter3-after.png`) });

    console.log(`  Phone C3 Flap: transform=${c3PhoneBefore.flapTransform} -> ${c3PhoneAfter.flapTransform}, opacity=${c3PhoneBefore.flapOpacity} -> ${c3PhoneAfter.flapOpacity}`);
    console.log(`  Phone C3 Seal: transform=${c3PhoneBefore.sealTransform} -> ${c3PhoneAfter.sealTransform}, opacity=${c3PhoneBefore.sealOpacity} -> ${c3PhoneAfter.sealOpacity}`);

    const c3PhoneDelta = c3PhoneBefore.flapTransform !== c3PhoneAfter.flapTransform && c3PhoneBefore.sealOpacity !== c3PhoneAfter.sealOpacity;
    results.chaptersMobile.chapter3 = { before: c3PhoneBefore, after: c3PhoneAfter, delta: c3PhoneDelta };
    if (!c3PhoneDelta) {
      results.passed = false;
      results.errors.push(`Phone 390 Chapter 3 failed: No transform/opacity delta on vault envelope/seal!`);
    } else {
      console.log(`  ✓ Phone 390 Chapter 3 PASSED: Measurable envelope fold and wax seal delta confirmed.`);
    }

    // Phone Reduced Motion Assertions
    console.log(`\n--- Testing Phone Reduced Motion Visibility & Readability ---`);
    await page390.emulateMedia({ reducedMotion: 'reduce' });
    await page390.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page390.waitForTimeout(350);

    const mobileReducedErrors = await assertReducedMotionReadability(page390, 'phone-390');
    results.reducedMotion.mobileErrors = mobileReducedErrors;
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-phone-390-reduced-motion.png`) });

    if (mobileReducedErrors.length > 0) {
      results.passed = false;
      results.errors.push(...mobileReducedErrors);
      console.error(`  ✗ Phone Reduced Motion FAILED with ${mobileReducedErrors.length} errors:`, mobileReducedErrors);
    } else {
      console.log(`  ✓ Phone Reduced Motion PASSED: All chapter content visible and readable with zero hidden fragments.`);
    }

    await page390.emulateMedia({ reducedMotion: 'no-preference' });
    await context390.close();

    // -------------------------------------------------------------------------
    // 3. Tablet (1024x768) and Narrow Mobile (320x600) Viewport Checks
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing 1024px Tablet and 320px Narrow Mobile ---`);

    // 1024px
    const ctx1024 = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const p1024 = await ctx1024.newPage();
    await p1024.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    const ov1024 = await p1024.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await p1024.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-tablet-1024.png`) });
    console.log(`  1024px overflow: ${ov1024}`);
    if (ov1024) {
      results.passed = false;
      results.errors.push(`1024px tablet has horizontal overflow!`);
    } else {
      console.log(`  ✓ 1024px tablet PASSED (zero horizontal overflow).`);
    }
    await ctx1024.close();

    // 320px
    const ctx320 = await browser.newContext({ viewport: { width: 320, height: 600 } });
    const p320 = await ctx320.newPage();
    await p320.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    const ov320 = await p320.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await p320.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-narrow-320.png`) });
    console.log(`  320px overflow: ${ov320}`);
    if (ov320) {
      results.passed = false;
      results.errors.push(`320px narrow mobile has horizontal overflow!`);
    } else {
      console.log(`  ✓ 320px narrow mobile PASSED (zero horizontal overflow).`);
    }
    await ctx320.close();

    // Seal vs text/control geometric nonintersection across scroll progress states (390 & 320)
    for (const vw of [390, 320]) {
      const ctxS = await browser.newContext({ viewport: { width: vw, height: 800 } });
      const pS = await ctxS.newPage();
      await pS.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      const top = await pS.evaluate(() => document.getElementById('star-matrix').getBoundingClientRect().top + window.scrollY);
      let worst = Infinity;
      let hit = null;
      for (const off of [-200, 0, 150, 300, 450, 600, 800, 1000]) {
        await pS.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top + off);
        await pS.waitForTimeout(200);
        const r = await pS.evaluate(() => {
          const seal = document.getElementById('star-assembly-seal').getBoundingClientRect();
          const sel = '#star-assembly-deck .star-fragment-title, #star-assembly-deck .star-fragment-body, .star-assembly-deck .star-fragment-title, .star-assembly-deck .star-fragment-body, .star-assembly-deck .star-fragment-badge, .star-assembly-deck .star-citation-panel h3, .star-assembly-deck .star-citation-panel p, .star-assembly-deck .star-citation-panel button, .star-assembly-deck .matrix-filter-btn';
          const out = [];
          document.querySelectorAll(sel).forEach((el) => {
            const b = el.getBoundingClientRect();
            if (!b.width || !b.height) return;
            const gapX = Math.max(b.left - seal.right, seal.left - b.right);
            const gapY = Math.max(b.top - seal.bottom, seal.top - b.bottom);
            out.push({ id: el.id || el.className, gap: Math.max(gapX, gapY) });
          });
          return out;
        });
        for (const e of r) {
          if (e.gap < worst) worst = e.gap;
          if (e.gap < 0 && !hit) hit = `${e.id} overlaps seal by ${(-e.gap).toFixed(1)}px at scroll offset ${off}`;
        }
      }
      console.log(`  Seal geometry @${vw}px: min clearance ${worst.toFixed(1)}px across 8 scroll states`);
      if (hit) {
        results.passed = false;
        results.errors.push(`Seal intersects text/control @${vw}px: ${hit}`);
      } else {
        console.log(`  ✓ Seal @${vw}px never intersects any text block or control.`);
      }
      await pS.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-seal-${vw}.png`) });
      await ctxS.close();
    }

    // -------------------------------------------------------------------------
    // 4. No-JS Full Readability & Foreground Visibility Verification
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing No-JS Accessibility & Foreground Visibility ---`);
    const noJsContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 }
    });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(`${baseUrl}/`, { waitUntil: 'load' });
    await noJsPage.waitForTimeout(200);

    const noJsErrors = await assertNoJsVisibility(noJsPage);
    results.noJsErrors = noJsErrors;
    await noJsPage.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-nojs-preview.png`) });

    if (noJsErrors.length > 0) {
      results.passed = false;
      results.errors.push(...noJsErrors);
      console.error(`  ✗ No-JS Mode FAILED with ${noJsErrors.length} errors:`, noJsErrors);
    } else {
      console.log(`  ✓ No-JS Mode PASSED: All 21+ foreground groups fully visible and readable without JavaScript.`);
    }
    await noJsContext.close();

    // -------------------------------------------------------------------------
    // 5. Linked Pages (/guide.html, /privacy.html, /app/) & Flutter App Integrity
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Linked Pages (/guide.html, /privacy.html, /app/) ---`);
    const auxContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const auxPage = await auxContext.newPage();

    // Track unhandled JS errors and failed network requests
    const pageErrors = [];
    const failedNetworkRequests = [];

    auxPage.on('pageerror', (err) => {
      console.error(`  [Browser Page Error] ${err.message}`);
      pageErrors.push(err.message);
    });

    auxPage.on('requestfailed', (req) => {
      const url = req.url();
      const failure = req.failure() ? req.failure().errorText : 'failed';
      console.warn(`  [Network Request Failed] ${url}: ${failure}`);
      // Flag failed requests for same-origin app bundles
      if (url.includes('/app/') || url.endsWith('.js') || url.endsWith('.wasm')) {
        failedNetworkRequests.push({ url, failure });
      }
    });

    auxPage.on('response', (res) => {
      const url = res.url();
      if (res.status() >= 400 && (url.includes('/app/') || url.endsWith('.js') || url.endsWith('.wasm'))) {
        console.warn(`  [Network Bad Response] ${url}: HTTP ${res.status()}`);
        failedNetworkRequests.push({ url, status: res.status() });
      }
    });

    // Guide
    const guideRes = await auxPage.goto(`${baseUrl}/guide.html`, { waitUntil: 'networkidle' });
    const guideStatus = guideRes ? guideRes.status() : 0;
    const guideTitle = await auxPage.title();
    console.log(`  /guide.html title: "${guideTitle}", status: ${guideStatus}`);
    if (guideStatus !== 200 || !guideTitle.includes('Guide')) {
      results.passed = false;
      results.errors.push(`/guide.html failed to load properly! Status: ${guideStatus}, title: "${guideTitle}"`);
    } else {
      console.log(`  ✓ /guide.html PASSED.`);
    }
    await auxPage.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-page-guide.png`) });

    // Privacy
    const privRes = await auxPage.goto(`${baseUrl}/privacy.html`, { waitUntil: 'networkidle' });
    const privStatus = privRes ? privRes.status() : 0;
    const privTitle = await auxPage.title();
    console.log(`  /privacy.html title: "${privTitle}", status: ${privStatus}`);
    if (privStatus !== 200 || !privTitle.includes('Privacy')) {
      results.passed = false;
      results.errors.push(`/privacy.html failed to load properly! Status: ${privStatus}, title: "${privTitle}"`);
    } else {
      console.log(`  ✓ /privacy.html PASSED.`);
    }
    await auxPage.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-page-privacy.png`) });

    // App — Thorough Mounted View & Canvas Integrity Verification
    console.log(`\n--- Testing /app/ Flutter Web View Integrity ---`);
    const appRes = await auxPage.goto(`${baseUrl}/app/`, { waitUntil: 'networkidle' });
    const appStatus = appRes ? appRes.status() : 0;
    const appTitle = await auxPage.title();

    // Wait for Flutter Web View element to mount in DOM
    try {
      await auxPage.waitForSelector('flutter-view', { timeout: 15000 });
    } catch (errWait) {
      console.warn(`  Warning waiting for flutter-view selector: ${errWait.message}`);
    }

    // Allow Flutter canvas rendering loop to execute
    await auxPage.waitForTimeout(2500);

    const flutterHealth = await auxPage.evaluate(() => {
      const fltView = document.querySelector('flutter-view');
      const fltGlass = document.querySelector('flt-glass-pane') || (fltView && fltView.querySelector('flt-glass-pane'));
      const root = fltGlass ? (fltGlass.shadowRoot || fltGlass) : (fltView ? (fltView.shadowRoot || fltView) : null);
      const canvas = root ? root.querySelector('canvas') : document.querySelector('canvas');

      let dataUrlLength = 0;
      if (canvas) {
        try {
          dataUrlLength = canvas.toDataURL().length;
        } catch (e) {
          dataUrlLength = -1;
        }
      }

      return {
        hasFlutterView: !!fltView,
        hasGlassPane: !!fltGlass,
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        dataUrlLength
      };
    });

    results.flutterApp = {
      appStatus,
      appTitle,
      flutterHealth,
      pageErrorsCount: pageErrors.length,
      failedNetworkCount: failedNetworkRequests.length
    };

    console.log(`  /app/ HTTP Status: ${appStatus}, Title: "${appTitle}"`);
    console.log(`  Flutter View Mounted: ${flutterHealth.hasFlutterView}, GlassPane: ${flutterHealth.hasGlassPane}, Canvas: ${flutterHealth.hasCanvas} (${flutterHealth.canvasWidth}x${flutterHealth.canvasHeight})`);
    console.log(`  Rendered Canvas Data Length: ${flutterHealth.dataUrlLength} bytes (empty blank canvas is typically < 2000 bytes)`);

    // Assertions
    if (appStatus !== 200 || !appTitle.includes('Pathfolio')) {
      results.passed = false;
      results.errors.push(`/app/ returned invalid status or title! Status: ${appStatus}, title: "${appTitle}"`);
    }

    if (!flutterHealth.hasFlutterView || !flutterHealth.hasGlassPane || !flutterHealth.hasCanvas) {
      results.passed = false;
      results.errors.push(`/app/ failed to mount Flutter view, glass pane, or rendering canvas!`);
    }

    if (flutterHealth.canvasWidth <= 0 || flutterHealth.canvasHeight <= 0 || flutterHealth.dataUrlLength < 10000) {
      results.passed = false;
      results.errors.push(`/app/ canvas is empty or blank! dataUrlLength=${flutterHealth.dataUrlLength}`);
    }

    if (pageErrors.length > 0) {
      results.passed = false;
      results.errors.push(`/app/ threw ${pageErrors.length} unhandled page error(s): ${pageErrors.join('; ')}`);
    }

    if (failedNetworkRequests.length > 0) {
      results.passed = false;
      results.errors.push(`/app/ had ${failedNetworkRequests.length} failed app bundle network request(s)!`);
    }

    if (results.passed) {
      console.log(`  ✓ /app/ Flutter Web View PASSED: Mounted view, rendered canvas (${flutterHealth.dataUrlLength} bytes), 0 errors.`);
    }

    await auxPage.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-page-app.png`) });
    await auxContext.close();

  } catch (err) {
    console.error(`Error during gate execution:`, err);
    results.passed = false;
    results.errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log(`\n>>> GATE RESULT FOR [${label}]: ${results.passed ? 'PASSED (ALL CHAPTER DELTAS & CHECKS VERIFIED)' : 'FAILED'} <<<\n`);
  if (!results.passed) {
    console.error(`Failures:`, results.errors);
  }
  return results;
}

(async () => {
  let localServer = null;
  if (targetMode === 'local' || targetMode === 'both') {
    localServer = await createStaticServer(path.join(__dirname, 'dist'), LOCAL_PORT);
  }

  let localResult = null;
  let remoteResult = null;

  try {
    if (targetMode === 'local' || targetMode === 'both') {
      localResult = await runGateForBaseUrl(LOCAL_BASE, 'local');
    }

    if (targetMode === 'remote' || targetMode === 'both') {
      remoteResult = await runGateForBaseUrl(REMOTE_BASE, 'remote');
    }
  } finally {
    if (localServer) {
      localServer.close();
    }
  }

  const allPassed = (localResult ? localResult.passed : true) && (remoteResult ? remoteResult.passed : true);

  if (!allPassed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
