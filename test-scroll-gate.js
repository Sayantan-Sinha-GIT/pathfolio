/**
 * Pathfolio — Automated Playwright Visual & Scroll Motion Gate
 * Validates scroll-driven narrative chapters, visual deltas, viewports, and links.
 * Works portably from a clean clone across Windows, macOS, and Linux.
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Parse target CLI arg
const targetArg = process.argv.find((a) => a.startsWith('--target=')) || '--target=local';
const targetMode = targetArg.split('=')[1];

const LOCAL_BASE = 'http://127.0.0.1:8085';
const REMOTE_BASE = 'https://pathfolio.pages.dev';

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

async function runGateForBaseUrl(baseUrl, label) {
  console.log(`\n===============================================================`);
  console.log(`RUNNING PLAYWRIGHT SCROLL GATE FOR: [${label}] -> ${baseUrl}`);
  console.log(`===============================================================\n`);

  const browser = await launchBrowser();

  const results = {
    label,
    baseUrl,
    passed: true,
    chapters: {},
    viewports: {},
    stickyHeadings: {},
    errors: []
  };

  try {
    // -------------------------------------------------------------------------
    // 1. Desktop Viewport (1440x900)
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
      return {
        cardTransform: card ? window.getComputedStyle(card).transform : '',
        cardOpacity: card ? window.getComputedStyle(card).opacity : '',
        fillWidth: fill ? window.getComputedStyle(fill).width : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-t0.png`) });
    console.log(`  ✓ Saved ${label}-desktop-1440-t0.png (t0 Rendered Fill: "${heroT0.fillWidth}", CardOpacity: ${heroT0.cardOpacity})`);

    // Wait for initial hero transition (t=1500ms)
    await page1440.waitForTimeout(1500);
    const heroT15 = await page1440.evaluate(() => {
      const card = document.getElementById('hero-dossier-card');
      const fill = document.getElementById('dossier-rail-fill');
      return {
        cardTransform: card ? window.getComputedStyle(card).transform : '',
        cardOpacity: card ? window.getComputedStyle(card).opacity : '',
        fillWidth: fill ? window.getComputedStyle(fill).width : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-1440-t1.5.png`) });
    console.log(`  ✓ Saved ${label}-desktop-1440-t1.5.png (t1.5 Rendered Fill: "${heroT15.fillWidth}", CardOpacity: ${heroT15.cardOpacity})`);

    // Assert visible progression between t0 and t1.5
    const heroHasDelta = heroT0.fillWidth !== heroT15.fillWidth || heroT0.cardTransform !== heroT15.cardTransform;
    if (!heroHasDelta) {
      results.passed = false;
      results.errors.push(`Hero t0 and t1.5 frames are static! No entrance transition or metric delta.`);
    } else {
      console.log(`  ✓ Hero staged entrance delta verified (Rail fill: ${heroT0.fillWidth} -> ${heroT15.fillWidth}).`);
    }

    // Scroll 300px to check Hero Parallax Shift
    await page1440.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
    await page1440.waitForTimeout(200);
    const heroScrolledTransform = await page1440.evaluate(() => {
      const el = document.getElementById('hero-dossier-card');
      return el ? window.getComputedStyle(el).transform : null;
    });

    console.log(`  Hero Dossier Transform initial:  ${heroT15.cardTransform}`);
    console.log(`  Hero Dossier Transform scrolled: ${heroScrolledTransform}`);

    // -------------------------------------------------------------------------
    // Chapter 1: The Six-Stage Career Pipeline Runway (#milestones)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Chapter 1: Pipeline Runway (#milestones) ---`);
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
      return {
        carriageTransform: carriage ? window.getComputedStyle(carriage).transform : '',
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        text
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
      return {
        carriageTransform: carriage ? window.getComputedStyle(carriage).transform : '',
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        text
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter1-after.png`) });

    console.log(`  Chapter 1 Carriage Before: ${c1Before.carriageTransform}`);
    console.log(`  Chapter 1 Carriage After:  ${c1After.carriageTransform}`);
    console.log(`  Chapter 1 Bar Before:      ${c1Before.barTransform}`);
    console.log(`  Chapter 1 Bar After:       ${c1After.barTransform}`);
    console.log(`  Chapter 1 Telemetry:       ${c1Before.text} -> ${c1After.text}`);

    const c1Delta = c1Before.carriageTransform !== c1After.carriageTransform;
    results.chapters.chapter1 = { before: c1Before, after: c1After, delta: c1Delta };
    if (!c1Delta) {
      results.passed = false;
      results.errors.push(`Chapter 1 failed: No computed transform delta on carriage!`);
    } else {
      console.log(`  ✓ Chapter 1 PASSED: Measurable carriage transform delta confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Chapter 2: STAR Evidence Matrix Physically Assembling (#star-matrix)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Chapter 2: STAR Evidence Assembly Deck (#star-matrix) ---`);
    const c2Pos = await page1440.evaluate(() => {
      const el = document.getElementById('star-matrix');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Scroll to Chapter 2 Entry
    await page1440.evaluate((top) => window.scrollTo({ top: top - 450, behavior: 'instant' }), c2Pos);
    await page1440.waitForTimeout(300);

    const c2Before = await page1440.evaluate(() => {
      const fragS = document.getElementById('star-frag-situation');
      const fragT = document.getElementById('star-frag-task');
      const seal = document.getElementById('star-assembly-seal');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter2-before.png`) });

    // Scroll through Chapter 2 to assemble fragments
    await page1440.evaluate((top) => window.scrollTo({ top: top + 420, behavior: 'instant' }), c2Pos);
    await page1440.waitForTimeout(300);

    const c2After = await page1440.evaluate(() => {
      const fragS = document.getElementById('star-frag-situation');
      const fragT = document.getElementById('star-frag-task');
      const seal = document.getElementById('star-assembly-seal');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter2-after.png`) });

    console.log(`  Chapter 2 FragS Before: transform=${c2Before.fragSTransform}, opacity=${c2Before.fragSOpacity}`);
    console.log(`  Chapter 2 FragS After:  transform=${c2After.fragSTransform}, opacity=${c2After.fragSOpacity}`);
    console.log(`  Chapter 2 Seal Before:  transform=${c2Before.sealTransform}, opacity=${c2Before.sealOpacity}`);
    console.log(`  Chapter 2 Seal After:   transform=${c2After.sealTransform}, opacity=${c2After.sealOpacity}`);

    const c2Delta = c2Before.fragSTransform !== c2After.fragSTransform && c2Before.fragSOpacity !== c2After.fragSOpacity;
    results.chapters.chapter2 = { before: c2Before, after: c2After, delta: c2Delta };
    if (!c2Delta) {
      results.passed = false;
      results.errors.push(`Chapter 2 failed: No computed transform/opacity delta on STAR fragments!`);
    } else {
      console.log(`  ✓ Chapter 2 PASSED: Measurable fragment assembly delta confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Chapter 3: Sovereign Dossier Folding & Sealing (#privacy-vault)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Chapter 3: Sovereign Dossier Vault (#privacy-vault) ---`);
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
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : '',
        drawerOpacity: drawer ? window.getComputedStyle(drawer).opacity : ''
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
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : '',
        drawerOpacity: drawer ? window.getComputedStyle(drawer).opacity : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter3-after.png`) });

    console.log(`  Chapter 3 Flap Before:   transform=${c3Before.flapTransform}, opacity=${c3Before.flapOpacity}`);
    console.log(`  Chapter 3 Flap After:    transform=${c3After.flapTransform}, opacity=${c3After.flapOpacity}`);
    console.log(`  Chapter 3 Seal Before:   transform=${c3Before.sealTransform}, opacity=${c3Before.sealOpacity}`);
    console.log(`  Chapter 3 Seal After:    transform=${c3After.sealTransform}, opacity=${c3After.sealOpacity}`);
    console.log(`  Chapter 3 Drawer Before: transform=${c3Before.drawerTransform}`);
    console.log(`  Chapter 3 Drawer After:  transform=${c3After.drawerTransform}`);

    const c3Delta = c3Before.flapTransform !== c3After.flapTransform && c3Before.sealOpacity !== c3After.sealOpacity;
    results.chapters.chapter3 = { before: c3Before, after: c3After, delta: c3Delta };
    if (!c3Delta) {
      results.passed = false;
      results.errors.push(`Chapter 3 failed: No computed transform/opacity delta on vault envelope/seal!`);
    } else {
      console.log(`  ✓ Chapter 3 PASSED: Measurable envelope fold and wax seal delta confirmed.`);
    }

    // -------------------------------------------------------------------------
    // Capture 25%, 50%, 75% Scroll States
    // -------------------------------------------------------------------------
    console.log(`\n--- Capturing 25%, 50%, 75% scroll states ---`);
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

    // -------------------------------------------------------------------------
    // Sticky Heading Clearance
    // -------------------------------------------------------------------------
    console.log(`\n--- Checking Sticky Heading Clearance for all anchor links ---`);
    const anchors = ['#hero', '#milestones', '#star-matrix', '#privacy-vault', '#app-tour'];
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
      if (targetRect && targetRect.top < headerHeight - 5) {
        console.warn(`  Warning: Target top is ${targetRect.top}px`);
      }
    }
    console.log(`  ✓ Sticky heading clearance verified.`);

    // -------------------------------------------------------------------------
    // Reduced Motion Fallback
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Reduced Motion Fallback ---`);
    await page1440.emulateMedia({ reducedMotion: 'reduce' });
    await page1440.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page1440.waitForTimeout(300);

    const reducedMotionState = await page1440.evaluate(() => {
      const bar = document.getElementById('pipeline-scroll-bar');
      const fragS = document.getElementById('star-frag-situation');
      return {
        barTransform: bar ? window.getComputedStyle(bar).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : ''
      };
    });
    console.log(`  Reduced Motion State: barTransform=${reducedMotionState.barTransform}, fragSOpacity=${reducedMotionState.fragSOpacity}`);
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-reduced-motion.png`) });
    console.log(`  ✓ Saved ${label}-desktop-reduced-motion.png`);

    // Reset media
    await page1440.emulateMedia({ reducedMotion: 'no-preference' });

    // -------------------------------------------------------------------------
    // Theme Toggle
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Theme Toggle ---`);
    await page1440.click('#theme-toggle');
    await page1440.waitForTimeout(300);
    const currentTheme = await page1440.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`  Toggled theme. Current data-theme: ${currentTheme}`);
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-desktop-theme-toggle.png`) });

    // Toggle back to default
    await page1440.click('#theme-toggle');
    await page1440.waitForTimeout(200);

    await context1440.close();

    // -------------------------------------------------------------------------
    // 2. Mobile Viewport (390x844)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Mobile 390x844 Viewport ---`);
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
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-mobile-390-hero.png`) });

    if (mobileMetrics.hasOverflow) {
      results.passed = false;
      results.errors.push(`Mobile 390px has horizontal overflow! scrollWidth=${mobileMetrics.scrollWidth} > 390`);
    } else {
      console.log(`  ✓ Mobile 390px horizontal containment PASSED (exact 390px).`);
    }

    // Open Mobile Drawer and inspect
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
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-mobile-390-menu-open.png`) });

    if (!drawerMetrics.isOpen || !drawerMetrics.allVisible || drawerMetrics.linksCount < 8) {
      results.passed = false;
      results.errors.push(`Mobile drawer failed: Not all links visible!`);
    } else {
      console.log(`  ✓ Mobile drawer PASSED: All links visible and rendered.`);
    }

    // Close drawer
    await page390.click('#mobile-menu-toggle');
    await page390.waitForTimeout(200);

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

    // -------------------------------------------------------------------------
    // 4. Linked Pages (/guide.html, /privacy.html, /app/)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Linked Pages (/guide.html, /privacy.html, /app/) ---`);
    const auxContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const auxPage = await auxContext.newPage();

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

    // App
    const appRes = await auxPage.goto(`${baseUrl}/app/`, { waitUntil: 'networkidle' });
    await auxPage.waitForTimeout(2500); // Flutter web boot
    const appStatus = appRes ? appRes.status() : 0;
    const appTitle = await auxPage.title();
    console.log(`  /app/ title: "${appTitle}", status: ${appStatus}`);
    if (appStatus !== 200 || !appTitle.includes('Pathfolio')) {
      results.passed = false;
      results.errors.push(`/app/ failed to load properly! Status: ${appStatus}, title: "${appTitle}"`);
    } else {
      console.log(`  ✓ /app/ PASSED.`);
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
  let localResult = null;
  let remoteResult = null;

  if (targetMode === 'local' || targetMode === 'both') {
    localResult = await runGateForBaseUrl(LOCAL_BASE, 'local');
  }

  if (targetMode === 'remote' || targetMode === 'both') {
    remoteResult = await runGateForBaseUrl(REMOTE_BASE, 'remote');
  }

  const allPassed = (localResult ? localResult.passed : true) && (remoteResult ? remoteResult.passed : true);

  if (!allPassed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
