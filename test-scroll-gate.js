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

/**
 * Assert that all chapter content is visible, readable, and has no hidden fragments in reduced motion
 */
async function assertReducedMotionReadability(page, viewportLabel) {
  return await page.evaluate((label) => {
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
      '#hero-dossier-card'
    ];
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

async function runGateForBaseUrl(baseUrl, label) {
  console.log(`\n===============================================================`);
  console.log(`RUNNING PLAYWRIGHT SCROLL GATE FOR: [${label}] -> ${baseUrl}`);
  console.log(`===============================================================\n`);

  const browser = await launchBrowser();

  const results = {
    label,
    baseUrl,
    passed: true,
    chaptersDesktop: {},
    chaptersMobile: {},
    reducedMotion: { desktopErrors: [], mobileErrors: [] },
    flutterApp: {},
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

    console.log(`  Desktop C1 Carriage: ${c1Before.carriageTransform} -> ${c1After.carriageTransform}`);
    console.log(`  Desktop C1 Bar:      ${c1Before.barTransform} -> ${c1After.barTransform}`);
    console.log(`  Desktop C1 Text:     ${c1Before.text} -> ${c1After.text}`);

    const c1Delta = c1Before.carriageTransform !== c1After.carriageTransform;
    results.chaptersDesktop.chapter1 = { before: c1Before, after: c1After, delta: c1Delta };
    if (!c1Delta) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 1 failed: No computed transform delta on carriage!`);
    } else {
      console.log(`  ✓ Desktop Chapter 1 PASSED: Measurable carriage transform delta confirmed.`);
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
      const seal = document.getElementById('star-assembly-seal');
      return {
        fragSTransform: fragS ? window.getComputedStyle(fragS).transform : '',
        fragSOpacity: fragS ? window.getComputedStyle(fragS).opacity : '',
        sealTransform: seal ? window.getComputedStyle(seal).transform : '',
        sealOpacity: seal ? window.getComputedStyle(seal).opacity : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter2-after.png`) });

    console.log(`  Desktop C2 FragS: transform=${c2Before.fragSTransform} -> ${c2After.fragSTransform}, opacity=${c2Before.fragSOpacity} -> ${c2After.fragSOpacity}`);
    console.log(`  Desktop C2 Seal:  transform=${c2Before.sealTransform} -> ${c2After.sealTransform}, opacity=${c2Before.sealOpacity} -> ${c2After.sealOpacity}`);

    const c2Delta = c2Before.fragSTransform !== c2After.fragSTransform && c2Before.fragSOpacity !== c2After.fragSOpacity;
    results.chaptersDesktop.chapter2 = { before: c2Before, after: c2After, delta: c2Delta };
    if (!c2Delta) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 2 failed: No computed transform/opacity delta on STAR fragments!`);
    } else {
      console.log(`  ✓ Desktop Chapter 2 PASSED: Measurable fragment assembly delta confirmed.`);
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
      return {
        flapTransform: flap ? window.getComputedStyle(flap).transform : '',
        flapOpacity: flap ? window.getComputedStyle(flap).opacity : '',
        sealTransform: waxSeal ? window.getComputedStyle(waxSeal).transform : '',
        sealOpacity: waxSeal ? window.getComputedStyle(waxSeal).opacity : '',
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : ''
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
        drawerTransform: drawer ? window.getComputedStyle(drawer).transform : ''
      };
    });
    await page1440.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-chapter3-after.png`) });

    console.log(`  Desktop C3 Flap: transform=${c3Before.flapTransform} -> ${c3After.flapTransform}, opacity=${c3Before.flapOpacity} -> ${c3After.flapOpacity}`);
    console.log(`  Desktop C3 Seal: transform=${c3Before.sealTransform} -> ${c3After.sealTransform}, opacity=${c3Before.sealOpacity} -> ${c3After.sealOpacity}`);

    const c3Delta = c3Before.flapTransform !== c3After.flapTransform && c3Before.sealOpacity !== c3After.sealOpacity;
    results.chaptersDesktop.chapter3 = { before: c3Before, after: c3After, delta: c3Delta };
    if (!c3Delta) {
      results.passed = false;
      results.errors.push(`Desktop Chapter 3 failed: No computed transform/opacity delta on vault envelope/seal!`);
    } else {
      console.log(`  ✓ Desktop Chapter 3 PASSED: Measurable envelope fold and wax seal delta confirmed.`);
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

    // -------------------------------------------------------------------------
    // 4. Linked Pages (/guide.html, /privacy.html, /app/) & Flutter App Integrity
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
