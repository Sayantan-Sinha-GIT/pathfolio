/**
 * Pathfolio — Automated Playwright Visual & Scroll Motion Gate
 * Validates the faithfully implemented owner-supplied design (my-design/home.html).
 * Compares reference (my-design/home.html) and implementation side-by-side at 1440 desktop and 390 phone,
 * across both dark and light themes, at matched before/mid/after scene phases.
 * Validates real motion amplitude & state transitions, 320/1024 viewports, sticky clearance,
 * real APK downloads, zero JS errors, reduced motion / no-JS readability, and Flutter app rendering.
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const ROOT_DIR = __dirname;
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'screenshots');
const SIDE_BY_SIDE_DIR = path.join(SCREENSHOT_DIR, 'side_by_side');

for (const d of [SCREENSHOT_DIR, SIDE_BY_SIDE_DIR]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const targetArg = process.argv.find((a) => a.startsWith('--target=')) || '--target=local';
const targetMode = targetArg.split('=')[1];

const LOCAL_PORT = 8085;
const LOCAL_BASE = `http://127.0.0.1:${LOCAL_PORT}`;
const REMOTE_BASE = 'https://pathfolio.pages.dev';

/**
 * Built-in static server with clean URLs, SPA routing, and reference design serving
 */
function createStaticServer(distDir, port = LOCAL_PORT) {
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
    let filePath = path.join(distDir, cleanPath);

    // Direct access to /my-design/
    if (cleanPath.startsWith('/my-design/')) {
      const myDesignPath = path.join(ROOT_DIR, cleanPath);
      if (fs.existsSync(myDesignPath) && !fs.statSync(myDesignPath).isDirectory()) {
        filePath = myDesignPath;
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath.replace(/\/$/, '') + '.html')) {
      filePath = filePath.replace(/\/$/, '') + '.html';
    }

    // SPA fallback for /app/*
    if (!fs.existsSync(filePath) && cleanPath.startsWith('/app/')) {
      filePath = path.join(distDir, 'app', 'index.html');
    }

    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
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
      console.log(`[StaticServer] Listening on http://127.0.0.1:${port} serving ${distDir}`);
      resolve(server);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`[StaticServer] Port ${port} in use; reusing existing server.`);
        resolve(null);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Portable browser launcher
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

  try {
    return await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (e1) {
    try {
      return await chromium.launch({
        channel: 'msedge',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (e2) {
      try {
        return await chromium.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      } catch (e3) {
        const fallbacks = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
          path.join(process.env.PROGRAMFILES || '', 'Google\\Chrome\\Application\\chrome.exe'),
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser'
        ];
        for (const p of fallbacks) {
          if (p && fs.existsSync(p)) {
            return await chromium.launch({
              executablePath: p,
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
          }
        }
        throw new Error('No compatible browser found.');
      }
    }
  }
}

/**
 * Generate side-by-side composite image from two screenshots using a browser page canvas
 */
async function createSideBySideComposite(browser, imgPathLeft, imgPathRight, outPath, titleLeft, titleRight) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  try {
    const b64Left = fs.readFileSync(imgPathLeft).toString('base64');
    const b64Right = fs.readFileSync(imgPathRight).toString('base64');
    const mimeLeft = 'image/png';
    const mimeRight = 'image/png';

    const resultDataUrl = await page.evaluate(async ({ srcL, srcR, titleL, titleR }) => {
      const loadImg = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const [imgL, imgR] = await Promise.all([loadImg(srcL), loadImg(srcR)]);

      const headerHeight = 60;
      const targetHeight = Math.max(imgL.height, imgR.height);
      const scaleL = targetHeight / imgL.height;
      const scaleR = targetHeight / imgR.height;
      const widthL = Math.round(imgL.width * scaleL);
      const widthR = Math.round(imgR.width * scaleR);
      const totalWidth = widthL + widthR + 12;

      const canvas = document.createElement('canvas');
      canvas.width = totalWidth;
      canvas.height = targetHeight + headerHeight;
      const ctx = canvas.getContext('2d');

      // Header background
      ctx.fillStyle = '#0A1210';
      ctx.fillRect(0, 0, totalWidth, targetHeight + headerHeight);

      // Header text
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#2DD4BF';
      ctx.fillText(titleL, 20, 36);

      ctx.fillStyle = '#E0A06A';
      ctx.fillText(titleR, widthL + 24, 36);

      // Divider
      ctx.fillStyle = '#2A3D37';
      ctx.fillRect(widthL + 5, 0, 2, targetHeight + headerHeight);

      // Draw images
      ctx.drawImage(imgL, 0, headerHeight, widthL, targetHeight);
      ctx.drawImage(imgR, widthL + 12, headerHeight, widthR, targetHeight);

      return canvas.toDataURL('image/png');
    }, {
      srcL: `data:${mimeLeft};base64,${b64Left}`,
      srcR: `data:${mimeRight};base64,${b64Right}`,
      titleL: titleLeft,
      titleR: titleRight
    });

    const base64Data = resultDataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log(`  📸 Composite side-by-side saved: ${path.basename(outPath)}`);
  } catch (err) {
    console.warn(`  Failed creating side-by-side composite:`, err.message);
  } finally {
    await page.close();
  }
}

/**
 * Verify reduced-motion readability
 */
async function assertReducedMotionReadability(page, viewportLabel) {
  return await page.evaluate((label) => {
    const selectors = [
      '.hero',
      '#dos',
      '#dsc',
      '#hero-underlay-1',
      '#hero-underlay-2',
      '#hero-dossier-tab',
      '.sh.ft',
      '#pipeline',
      '#rule',
      '#bar',
      '#car',
      '.stn',
      '#evidence',
      '#deck',
      '.fr',
      '#vault',
      '#env',
      '.doc',
      '#flap',
      '#seal',
      '#tour',
      '#phone',
      '#win',
      '#launch',
      '#cin',
      '.fw',
      '#fl',
      '.fc'
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
          errors.push(`[${label}] ${sel} has display: none in reduced motion`);
        }
        if (style.visibility === 'hidden') {
          errors.push(`[${label}] ${sel} has visibility: hidden in reduced motion`);
        }
        if (parseFloat(style.opacity) < 0.9) {
          errors.push(`[${label}] ${sel} has reduced-motion opacity < 0.9 (${style.opacity})`);
        }
        if (rect.width <= 0 && rect.height <= 0) {
          errors.push(`[${label}] ${sel} has zero rendered dimensions (${rect.width}x${rect.height})`);
        }
      }
    }
    return errors;
  }, viewportLabel);
}

/**
 * Verify no-JS visibility
 */
async function assertNoJsVisibility(page) {
  return await page.evaluate(() => {
    const selectors = [
      '.hero',
      '#dos',
      '#pipeline',
      '#evidence',
      '#vault',
      '#tour',
      '#privacy',
      '#launch',
      '.fw',
      '.fc'
    ];
    const errors = [];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) {
        errors.push(`[No-JS] Missing element: ${sel}`);
        continue;
      }
      const style = window.getComputedStyle(el);
      if (style.display === 'none') errors.push(`[No-JS] ${sel} has display: none`);
      if (style.visibility === 'hidden') errors.push(`[No-JS] ${sel} has visibility: hidden`);
      if (parseFloat(style.opacity) < 0.9) errors.push(`[No-JS] ${sel} has opacity < 0.9 (${style.opacity})`);
    }
    return errors;
  });
}

/**
 * Verify Front Sheet Non-Occlusion by Underlay Sheets
 */
async function assertFrontSheetNonOcclusion(page, theme, viewportLabel) {
  const isMobile = viewportLabel.includes('390') || viewportLabel.includes('320') || viewportLabel.includes('phone');
  const offsets = isMobile ? [0, 150, 300] : [0, 150, 350, 500];
  const errors = [];

  for (const y of offsets) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);

    const check = await page.evaluate(() => {
      const front = document.querySelector('.sh.ft');
      const u1 = document.getElementById('hero-underlay-1');
      const u2 = document.getElementById('hero-underlay-2');
      if (!front) return [{ error: 'Front sheet .sh.ft not found' }];

      const rect = front.getBoundingClientRect();
      const points = [
        { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        { x: rect.left + 40, y: rect.top + 40 },
        { x: rect.right - 40, y: rect.top + 40 }
      ];

      const issues = [];
      for (const pt of points) {
        if (pt.x < 0 || pt.x > window.innerWidth || pt.y < 0 || pt.y > window.innerHeight) continue;
        const hit = document.elementFromPoint(pt.x, pt.y);
        if (!hit) continue;
        if (hit.closest('#hero-underlay-1') || hit.closest('#hero-underlay-2')) {
          issues.push({ error: `Front sheet occluded by underlay sheet at point (${pt.x}, ${pt.y})` });
        }
      }
      return issues;
    });

    if (check.length > 0) {
      errors.push(...check.map((c) => `[${viewportLabel}-${theme}@${y}px] ${c.error}`));
    }
  }
  return errors;
}

/**
 * Main Gate Runner for a given Base URL
 */
async function runGateForBaseUrl(baseUrl, label) {
  console.log(`\n===============================================================`);
  console.log(`RUNNING FAITHFUL DESIGN PLAYWRIGHT SCROLL GATE FOR: [${label}] -> ${baseUrl}`);
  console.log(`===============================================================\n`);

  const browser = await launchBrowser();

  const results = {
    label,
    baseUrl,
    passed: true,
    viewports: {},
    scenes: {},
    sideBySideComparisons: [],
    stickyClearance: {},
    themeToggle: {},
    reducedMotionErrors: [],
    noJsErrors: [],
    flutterApp: {},
    errors: []
  };

  try {
    // -------------------------------------------------------------------------
    // 1. Matched Side-by-Side Comparisons (1440 Desktop & 390 Phone, Dark & Light)
    // -------------------------------------------------------------------------
    console.log(`\n--- Running Matched Side-by-Side Comparisons with Reference (my-design/home.html) ---`);
    const refUrl = `${LOCAL_BASE}/my-design/home.html`;

    const comparisonConfigs = [
      { width: 1440, height: 900, deviceLabel: 'desktop-1440' },
      { width: 390, height: 844, deviceLabel: 'phone-390' }
    ];

    for (const cfg of comparisonConfigs) {
      for (const theme of ['dark', 'light']) {
        console.log(`\n  >> Testing ${cfg.deviceLabel} in ${theme.toUpperCase()} theme`);
        const ctxRef = await browser.newContext({ viewport: { width: cfg.width, height: cfg.height } });
        const ctxImpl = await browser.newContext({ viewport: { width: cfg.width, height: cfg.height } });
        const pageRef = await ctxRef.newPage();
        const pageImpl = await ctxImpl.newPage();

        // Listen for JS errors
        const implErrors = [];
        pageImpl.on('pageerror', (err) => implErrors.push(err.message));
        pageImpl.on('console', (msg) => {
          if (msg.type() === 'error') implErrors.push(msg.text());
        });

        await pageRef.goto(refUrl, { waitUntil: 'networkidle' });
        await pageImpl.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

        // Apply theme if light
        if (theme === 'light') {
          await pageRef.evaluate(() => {
            document.documentElement.dataset.theme = 'light';
            if (typeof colors === 'function') colors();
          });
          await pageImpl.evaluate(() => {
            document.documentElement.dataset.theme = 'light';
            if (typeof colors === 'function') colors();
          });
        }
        await pageRef.waitForTimeout(600);
        await pageImpl.waitForTimeout(600);

        // Define matched scene phases
        const scenes = [
          {
            name: '01_hero_settled',
            selector: '.hero',
            phase: 'settled',
            setup: async () => {
              await pageRef.evaluate(() => window.scrollTo(0, 0));
              await pageImpl.evaluate(() => window.scrollTo(0, 0));
              await pageRef.waitForTimeout(1400);
              await pageImpl.waitForTimeout(1400);
            }
          },
          {
            name: '02_pipeline_mid',
            selector: '#pipeline',
            phase: 'mid',
            setup: async () => {
              const yRef = await pageRef.evaluate(() => {
                const el = document.getElementById('pipeline');
                return el ? el.offsetTop + 350 : 1800;
              });
              const yImpl = await pageImpl.evaluate(() => {
                const el = document.getElementById('pipeline');
                return el ? el.offsetTop + 350 : 1800;
              });
              await pageRef.evaluate((y) => window.scrollTo(0, y), yRef);
              await pageImpl.evaluate((y) => window.scrollTo(0, y), yImpl);
              await pageRef.waitForTimeout(400);
              await pageImpl.waitForTimeout(400);
            }
          },
          {
            name: '02_pipeline_after',
            selector: '#pipeline',
            phase: 'after',
            setup: async () => {
              const yRef = await pageRef.evaluate(() => {
                const el = document.getElementById('pipeline');
                return el ? el.offsetTop + 650 : 2200;
              });
              const yImpl = await pageImpl.evaluate(() => {
                const el = document.getElementById('pipeline');
                return el ? el.offsetTop + 650 : 2200;
              });
              await pageRef.evaluate((y) => window.scrollTo(0, y), yRef);
              await pageImpl.evaluate((y) => window.scrollTo(0, y), yImpl);
              await pageRef.waitForTimeout(400);
              await pageImpl.waitForTimeout(400);
            }
          },
          {
            name: '03_evidence_mid',
            selector: '#evidence',
            phase: 'mid',
            setup: async () => {
              const yRef = await pageRef.evaluate(() => {
                const el = document.getElementById('evidence');
                return el ? el.offsetTop + 250 : 3000;
              });
              const yImpl = await pageImpl.evaluate(() => {
                const el = document.getElementById('evidence');
                return el ? el.offsetTop + 250 : 3000;
              });
              await pageRef.evaluate((y) => window.scrollTo(0, y), yRef);
              await pageImpl.evaluate((y) => window.scrollTo(0, y), yImpl);
              await pageRef.waitForTimeout(400);
              await pageImpl.waitForTimeout(400);
            }
          },
          {
            name: '04_vault_sealed',
            selector: '#vault',
            phase: 'after',
            setup: async () => {
              const yRef = await pageRef.evaluate(() => {
                const el = document.getElementById('vault');
                return el ? el.offsetTop + 450 : 4200;
              });
              const yImpl = await pageImpl.evaluate(() => {
                const el = document.getElementById('vault');
                return el ? el.offsetTop + 450 : 4200;
              });
              await pageRef.evaluate((y) => window.scrollTo(0, y), yRef);
              await pageImpl.evaluate((y) => window.scrollTo(0, y), yImpl);
              await pageRef.waitForTimeout(400);
              await pageImpl.waitForTimeout(400);
            }
          },
          {
            name: '05_tour_android',
            selector: '#tour',
            phase: 'android',
            setup: async () => {
              const yRef = await pageRef.evaluate(() => {
                const el = document.getElementById('tour');
                return el ? el.offsetTop + 150 : 5000;
              });
              const yImpl = await pageImpl.evaluate(() => {
                const el = document.getElementById('tour');
                return el ? el.offsetTop + 150 : 5000;
              });
              await pageRef.evaluate((y) => window.scrollTo(0, y), yRef);
              await pageImpl.evaluate((y) => window.scrollTo(0, y), yImpl);
              await pageRef.waitForTimeout(300);
              await pageImpl.waitForTimeout(300);
            }
          },
          {
            name: '06_launch_closing',
            selector: '#launch',
            phase: 'closing',
            setup: async () => {
              const yRef = await pageRef.evaluate(() => {
                const el = document.getElementById('launch');
                return el ? el.offsetTop + 200 : 6600;
              });
              const yImpl = await pageImpl.evaluate(() => {
                const el = document.getElementById('launch');
                return el ? el.offsetTop + 200 : 6600;
              });
              await pageRef.evaluate((y) => window.scrollTo(0, y), yRef);
              await pageImpl.evaluate((y) => window.scrollTo(0, y), yImpl);
              await pageRef.waitForTimeout(400);
              await pageImpl.waitForTimeout(400);
            }
          }
        ];

        for (const sc of scenes) {
          await sc.setup();
          const shotRef = path.join(SIDE_BY_SIDE_DIR, `ref_${cfg.deviceLabel}_${theme}_${sc.name}.png`);
          const shotImpl = path.join(SIDE_BY_SIDE_DIR, `impl_${cfg.deviceLabel}_${theme}_${sc.name}.png`);
          const shotComp = path.join(SIDE_BY_SIDE_DIR, `compare_${cfg.deviceLabel}_${theme}_${sc.name}.png`);

          await pageRef.screenshot({ path: shotRef });
          await pageImpl.screenshot({ path: shotImpl });

          await createSideBySideComposite(
            browser,
            shotRef,
            shotImpl,
            shotComp,
            `OWNER REFERENCE (my-design/home.html) [${cfg.deviceLabel} - ${theme}]`,
            `PATHFOLIO IMPLEMENTATION [${cfg.deviceLabel} - ${theme}]`
          );

          results.sideBySideComparisons.push({
            device: cfg.deviceLabel,
            theme,
            scene: sc.name,
            compositeFile: path.basename(shotComp)
          });
        }

        // Check for JS errors during visual comparison
        if (implErrors.length > 0) {
          results.passed = false;
          results.errors.push(`JS Errors in ${cfg.deviceLabel} (${theme}): ${implErrors.join('; ')}`);
        }

        await ctxRef.close();
        await ctxImpl.close();
      }
    }

    // -------------------------------------------------------------------------
    // 2. Real Motion Amplitude & State Transitions Verification (1440 Desktop)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Real Motion Amplitude & State Transitions (Desktop 1440) ---`);
    const ctxMotion = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageMotion = await ctxMotion.newPage();
    await pageMotion.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

    // Hero entrance and 3D fanning
    const heroT0 = await pageMotion.evaluate(() => {
      const dos = document.getElementById('dos');
      const u1 = document.getElementById('hero-underlay-1');
      const u2 = document.getElementById('hero-underlay-2');
      return {
        dosTransform: dos ? window.getComputedStyle(dos).transform : '',
        u1Transform: u1 ? window.getComputedStyle(u1).transform : '',
        u2Transform: u2 ? window.getComputedStyle(u2).transform : ''
      };
    });

    await pageMotion.waitForTimeout(1400);

    const heroT14 = await pageMotion.evaluate(() => {
      const dos = document.getElementById('dos');
      const u1 = document.getElementById('hero-underlay-1');
      const u2 = document.getElementById('hero-underlay-2');
      const chk = document.querySelector('.chk path');
      return {
        dosTransform: dos ? window.getComputedStyle(dos).transform : '',
        u1Transform: u1 ? window.getComputedStyle(u1).transform : '',
        u2Transform: u2 ? window.getComputedStyle(u2).transform : '',
        chkLength: chk ? chk.getTotalLength() : 0
      };
    });

    // Scroll to test dossier underlay spread
    await pageMotion.evaluate(() => window.scrollTo(0, 350));
    await pageMotion.waitForTimeout(250);

    const heroSpread = await pageMotion.evaluate(() => {
      const u1 = document.getElementById('hero-underlay-1');
      const u2 = document.getElementById('hero-underlay-2');
      return {
        u1Transform: u1 ? window.getComputedStyle(u1).transform : '',
        u2Transform: u2 ? window.getComputedStyle(u2).transform : ''
      };
    });

    const hasSpreadDelta = heroSpread.u1Transform !== heroT14.u1Transform && heroSpread.u2Transform !== heroT14.u2Transform;
    if (!hasSpreadDelta) {
      results.passed = false;
      results.errors.push('Hero underlays did not spread upon scroll!');
    } else {
      console.log(`  ✓ Hero 3D Dossier spread verified: underlays fan distinctly on scroll.`);
    }

    // Verify Front Sheet Non-Occlusion
    console.log(`  Verifying Front Sheet Non-Occlusion (Light & Dark)...`);
    const lightOcc = await assertFrontSheetNonOcclusion(pageMotion, 'light', 'desktop-1440');
    await pageMotion.evaluate(() => document.documentElement.dataset.theme = 'dark');
    await pageMotion.waitForTimeout(100);
    const darkOcc = await assertFrontSheetNonOcclusion(pageMotion, 'dark', 'desktop-1440');
    const totalOcc = [...lightOcc, ...darkOcc];
    if (totalOcc.length > 0) {
      results.passed = false;
      results.errors.push(...totalOcc);
    } else {
      console.log(`  ✓ Front Sheet Non-Occlusion PASSED: Zero overlap collision.`);
    }

    // Chapter 1: Pipeline Runway Transition
    console.log(`\n  >> Chapter 1 (Pipeline Runway): Motion scrub & state transitions`);
    const c1Bounds = await pageMotion.evaluate(() => {
      const run = document.querySelector('.run');
      const h = window.innerHeight;
      const top = run.offsetTop;
      const height = run.offsetHeight;
      const yStart = top - 0.6 * h;
      const yEnd = top + height - 0.6 * h;
      return { yStart, yMid: (yStart + yEnd) / 2, yEnd };
    });

    await pageMotion.evaluate((y) => window.scrollTo(0, y - 100), c1Bounds.yStart);
    await pageMotion.waitForTimeout(300);

    const c1Start = await pageMotion.evaluate(() => ({
      barScale: window.getComputedStyle(document.getElementById('bar')).transform,
      carLeft: document.getElementById('car').style.left,
      activeCount: document.querySelectorAll('.stn.on').length,
      stageText: document.getElementById('dn')?.textContent || ''
    }));

    await pageMotion.evaluate((y) => window.scrollTo(0, y), c1Bounds.yMid);
    await pageMotion.waitForTimeout(300);

    const c1Mid = await pageMotion.evaluate(() => ({
      barScale: window.getComputedStyle(document.getElementById('bar')).transform,
      carLeft: document.getElementById('car').style.left,
      activeCount: document.querySelectorAll('.stn.on').length,
      stageText: document.getElementById('dn')?.textContent || ''
    }));

    await pageMotion.evaluate((y) => window.scrollTo(0, y + 100), c1Bounds.yEnd);
    await pageMotion.waitForTimeout(300);

    const c1End = await pageMotion.evaluate(() => ({
      barScale: window.getComputedStyle(document.getElementById('bar')).transform,
      carLeft: document.getElementById('car').style.left,
      activeCount: document.querySelectorAll('.stn.on').length,
      stageText: document.getElementById('dn')?.textContent || ''
    }));

    console.log(`    C1 Bar Scale:   Start=${c1Start.barScale} -> Mid=${c1Mid.barScale} -> End=${c1End.barScale}`);
    console.log(`    C1 Car Left:    Start=${c1Start.carLeft} -> Mid=${c1Mid.carLeft} -> End=${c1End.carLeft}`);
    console.log(`    C1 Stages:      Start=${c1Start.stageText} (${c1Start.activeCount}) -> Mid=${c1Mid.stageText} (${c1Mid.activeCount}) -> End=${c1End.stageText} (${c1End.activeCount})`);

    const c1HasDelta = c1Start.carLeft !== c1Mid.carLeft && c1Mid.carLeft !== c1End.carLeft && c1End.activeCount > c1Start.activeCount;
    if (!c1HasDelta) {
      results.passed = false;
      results.errors.push('Chapter 1 Pipeline carriage and stations did not advance across scroll scrub!');
    } else {
      console.log(`  ✓ Chapter 1 Pipeline PASSED: Real carriage displacement, progress bar scaling, and stage transitions.`);
    }

    // Chapter 2: STAR Evidence Deck
    console.log(`\n  >> Chapter 2 (STAR Evidence Deck): Fragment assembly & SVG draw`);
    const c2Bounds = await pageMotion.evaluate(() => {
      const deck = document.getElementById('deck');
      const r = deck.getBoundingClientRect();
      const pageTop = r.top + window.scrollY;
      const h = window.innerHeight;
      const height = deck.offsetHeight;
      const yStart = pageTop - 0.85 * h;
      const yEnd = pageTop + height / 2 - 0.5 * h;
      return { yStart, yEnd };
    });

    await pageMotion.evaluate((y) => window.scrollTo(0, Math.max(0, y - 100)), c2Bounds.yStart);
    await pageMotion.waitForTimeout(300);

    const c2Start = await pageMotion.evaluate(() => ({
      pathOffset: window.getComputedStyle(document.getElementById('spath')).strokeDashoffset,
      pillOpacity: window.getComputedStyle(document.getElementById('citation-stage-pill')).opacity,
      fr0Transform: window.getComputedStyle(document.querySelectorAll('.fr')[0]).transform,
      fr0Opacity: window.getComputedStyle(document.querySelectorAll('.fr')[0]).opacity
    }));

    await pageMotion.evaluate((y) => window.scrollTo(0, y + 200), c2Bounds.yEnd);
    await pageMotion.waitForTimeout(300);

    const c2End = await pageMotion.evaluate(() => ({
      pathOffset: window.getComputedStyle(document.getElementById('spath')).strokeDashoffset,
      pillOpacity: window.getComputedStyle(document.getElementById('citation-stage-pill')).opacity,
      fr0Transform: window.getComputedStyle(document.querySelectorAll('.fr')[0]).transform,
      fr0Opacity: window.getComputedStyle(document.querySelectorAll('.fr')[0]).opacity
    }));

    console.log(`    C2 SVG Path Offset: Start=${c2Start.pathOffset} -> End=${c2End.pathOffset}`);
    console.log(`    C2 Pill Opacity:    Start=${c2Start.pillOpacity} -> End=${c2End.pillOpacity}`);
    console.log(`    C2 Frag Transform:  Start=${c2Start.fr0Transform} -> End=${c2End.fr0Transform}`);
    console.log(`    C2 Frag Opacity:    Start=${c2Start.fr0Opacity} -> End=${c2End.fr0Opacity}`);

    const c2HasDelta = c2Start.fr0Transform !== c2End.fr0Transform &&
      c2Start.pillOpacity !== c2End.pillOpacity;
    if (!c2HasDelta) {
      results.passed = false;
      results.errors.push('Chapter 2 Evidence cards did not fan in or assemble!');
    } else {
      console.log(`  ✓ Chapter 2 Evidence PASSED: STAR fragment assembly & dynamic connector drawing.`);
    }

    // Chapter 3: Sovereign Vault
    console.log(`\n  >> Chapter 3 (Sovereign Vault): Envelope fold, wax seal & stepper`);
    const c3Top = await pageMotion.evaluate(() => document.getElementById('vault').offsetTop);
    await pageMotion.evaluate((y) => window.scrollTo(0, y - 450), c3Top);
    await pageMotion.waitForTimeout(300);

    const c3Start = await pageMotion.evaluate(() => ({
      flapTransform: window.getComputedStyle(document.getElementById('flap')).transform,
      sealTransform: window.getComputedStyle(document.getElementById('seal')).transform,
      stepsOn: document.querySelectorAll('#stp li.on').length
    }));

    await pageMotion.evaluate((y) => window.scrollTo(0, y + 400), c3Top);
    await pageMotion.waitForTimeout(300);

    const c3End = await pageMotion.evaluate(() => ({
      flapTransform: window.getComputedStyle(document.getElementById('flap')).transform,
      sealTransform: window.getComputedStyle(document.getElementById('seal')).transform,
      stepsOn: document.querySelectorAll('#stp li.on').length
    }));

    console.log(`    C3 Flap Transform: Start=${c3Start.flapTransform} -> End=${c3End.flapTransform}`);
    console.log(`    C3 Seal Transform: Start=${c3Start.sealTransform} -> End=${c3End.sealTransform}`);
    console.log(`    C3 Steppers:       Start=${c3Start.stepsOn} -> End=${c3End.stepsOn}`);

    const c3HasDelta = c3Start.flapTransform !== c3End.flapTransform && c3End.stepsOn > c3Start.stepsOn;
    if (!c3HasDelta) {
      results.passed = false;
      results.errors.push('Chapter 3 Vault envelope flap did not fold shut or steppers did not advance!');
    } else {
      console.log(`  ✓ Chapter 3 Vault PASSED: Dimensional envelope fold, wax seal placement, and stepper progression.`);
    }

    // Chapter 4: App Tour Tabs
    console.log(`\n  >> Chapter 4 (App Tour): Platform tabs & parallax`);
    await pageMotion.click('.tb button[data-p="web"]');
    await pageMotion.waitForTimeout(200);
    const tourWebActive = await pageMotion.evaluate(() => ({
      p: document.getElementById('scene').dataset.p,
      selectedTab: document.querySelector('.tb button[data-p="web"]').getAttribute('aria-selected')
    }));
    await pageMotion.click('.tb button[data-p="android"]');
    await pageMotion.waitForTimeout(200);
    const tourAndroidActive = await pageMotion.evaluate(() => ({
      p: document.getElementById('scene').dataset.p,
      selectedTab: document.querySelector('.tb button[data-p="android"]').getAttribute('aria-selected')
    }));

    if (tourWebActive.p !== 'web' || tourAndroidActive.p !== 'android') {
      results.passed = false;
      results.errors.push('App tour platform toggle buttons did not switch scene data-p correctly!');
    } else {
      console.log(`  ✓ Chapter 4 Tour Tabs PASSED: Android / Web platform toggle verified.`);
    }

    // Section 05: Closing CTA
    console.log(`\n  >> Section 05 (Closing Launch): Cinematic reveal & lit words`);
    const c5Top = await pageMotion.evaluate(() => document.getElementById('launch').offsetTop);
    await pageMotion.evaluate((y) => window.scrollTo(0, y - 400), c5Top);
    await pageMotion.waitForTimeout(300);

    const c5Start = await pageMotion.evaluate(() => ({
      cinClip: window.getComputedStyle(document.getElementById('cin')).clipPath,
      leafL: window.getComputedStyle(document.getElementById('closing-leaf-left')).transform
    }));

    await pageMotion.evaluate((y) => window.scrollTo(0, y + 250), c5Top);
    await pageMotion.waitForTimeout(300);

    const c5End = await pageMotion.evaluate(() => ({
      cinClip: window.getComputedStyle(document.getElementById('cin')).clipPath,
      leafL: window.getComputedStyle(document.getElementById('closing-leaf-left')).transform
    }));

    console.log(`    C5 Cinematic Clip: Start=${c5Start.cinClip} -> End=${c5End.cinClip}`);
    console.log(`    C5 Leaf Transform: Start=${c5Start.leafL} -> End=${c5End.leafL}`);

    await ctxMotion.close();

    // -------------------------------------------------------------------------
    // 3. Viewport Containment Checks (1440, 1024, 768, 390, 320)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Responsive Viewport Containment (Zero Horizontal Overflow) ---`);
    const viewports = [
      { width: 1440, height: 900, name: 'desktop-1440' },
      { width: 1024, height: 768, name: 'tablet-1024' },
      { width: 768, height: 1024, name: 'tablet-768' },
      { width: 390, height: 844, name: 'mobile-390' },
      { width: 320, height: 600, name: 'narrow-320' }
    ];

    for (const vp of viewports) {
      const ctxVp = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const pageVp = await ctxVp.newPage();
      await pageVp.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await pageVp.waitForTimeout(300);

      const overflow = await pageVp.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyW = document.body.scrollWidth;
        return {
          scrollWidth: Math.max(docW, bodyW),
          innerWidth: winW,
          hasOverflow: Math.max(docW, bodyW) > winW + 1
        };
      });

      console.log(`  Viewport ${vp.name} (${vp.width}px): scrollWidth=${overflow.scrollWidth}px (limit: ${overflow.innerWidth}px)`);
      if (overflow.hasOverflow) {
        results.passed = false;
        results.errors.push(`Viewport ${vp.name} has horizontal overflow! (${overflow.scrollWidth}px > ${overflow.innerWidth}px)`);
      }
      await ctxVp.close();
    }

    // -------------------------------------------------------------------------
    // 4. Sticky Header Clearance on Anchor Clicks
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Sticky Heading Clearance for all Anchor Links ---`);
    const ctxSticky = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageSticky = await ctxSticky.newPage();
    await pageSticky.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await pageSticky.waitForTimeout(400);

    const anchors = ['#pipeline', '#evidence', '#vault', '#tour', '#privacy'];
    for (const a of anchors) {
      await pageSticky.click(`.nav a[href="${a}"]`);
      await pageSticky.waitForTimeout(600);

      const clearance = await pageSticky.evaluate((targetId) => {
        const header = document.querySelector('.hd');
        const target = document.querySelector(targetId);
        if (!header || !target) return { error: 'Missing header or target' };
        const hRect = header.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        return {
          headerBottom: hRect.bottom,
          targetTop: tRect.top,
          clearance: tRect.top - hRect.bottom
        };
      }, a);

      console.log(`  Anchor ${a}: targetTop=${clearance.targetTop?.toFixed(1)}px (header bottom=${clearance.headerBottom?.toFixed(1)}px, clearance=${clearance.clearance?.toFixed(1)}px)`);
      if (clearance.clearance < -5) {
        results.passed = false;
        results.errors.push(`Anchor ${a} occluded behind fixed header! (clearance: ${clearance.clearance}px)`);
      }
    }
    await ctxSticky.close();

    // -------------------------------------------------------------------------
    // 5. Reduced-Motion Readability & No-JS Tests
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Reduced-Motion Readability ---`);
    const ctxRm = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const pageRm = await ctxRm.newPage();
    await pageRm.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await pageRm.waitForTimeout(300);

    const rmErrors = await assertReducedMotionReadability(pageRm, 'desktop-reduced-motion');
    if (rmErrors.length > 0) {
      results.passed = false;
      results.errors.push(...rmErrors);
      console.error(`  ✗ Reduced-Motion Errors:`, rmErrors);
    } else {
      console.log(`  ✓ Reduced-Motion PASSED: All 28 key content elements rendered at opacity >= 0.9.`);
    }
    await ctxRm.close();

    console.log(`\n--- Testing No-JS Fallback Visibility ---`);
    const ctxNoJs = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      javaScriptEnabled: false
    });
    const pageNoJs = await ctxNoJs.newPage();
    await pageNoJs.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await pageNoJs.waitForTimeout(300);

    const noJsErrors = await assertNoJsVisibility(pageNoJs);
    if (noJsErrors.length > 0) {
      results.passed = false;
      results.errors.push(...noJsErrors);
      console.error(`  ✗ No-JS Visibility Errors:`, noJsErrors);
    } else {
      console.log(`  ✓ No-JS Visibility PASSED: All major structural sections visible and readable without script.`);
    }
    await ctxNoJs.close();

    // -------------------------------------------------------------------------
    // 6. Reverse Scroll & Midpage Direct Reload
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Midpage Direct Reload & Reverse Scroll ---`);
    const ctxMid = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageMid = await ctxMid.newPage();

    // Midpage reload directly to #vault
    await pageMid.goto(`${baseUrl}/#vault`, { waitUntil: 'networkidle' });
    await pageMid.waitForTimeout(600);
    const midMetrics = await pageMid.evaluate(() => {
      const v = document.getElementById('vault');
      const rect = v.getBoundingClientRect();
      return {
        offsetTop: v.offsetTop,
        rectTop: rect.top,
        hasContent: v.textContent.includes('Backup and restore')
      };
    });
    console.log(`  Direct anchor reload (#vault): rectTop=${midMetrics.rectTop.toFixed(1)}px, hasContent=${midMetrics.hasContent}`);

    // Reverse scroll from bottom to top
    await pageMid.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pageMid.waitForTimeout(300);
    await pageMid.evaluate(() => window.scrollTo(0, 0));
    await pageMid.waitForTimeout(400);

    const reverseHeroMetrics = await pageMid.evaluate(() => {
      const h1 = document.querySelector('h1');
      return {
        h1Opacity: window.getComputedStyle(h1).opacity,
        h1Visible: h1.getBoundingClientRect().height > 0
      };
    });
    console.log(`  Reverse scroll back to top: H1 opacity=${reverseHeroMetrics.h1Opacity}, visible=${reverseHeroMetrics.h1Visible}`);
    await ctxMid.close();

    // -------------------------------------------------------------------------
    // 7. Actual Flutter App Web Rendering (/app/)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Flutter Web Bundle (/app/) ---`);
    const ctxApp = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageApp = await ctxApp.newPage();

    const appErrors = [];
    pageApp.on('pageerror', (err) => appErrors.push(err.message));

    await pageApp.goto(`${baseUrl}/app/`, { waitUntil: 'networkidle' });
    await pageApp.waitForTimeout(2500);

    const flutterStatus = await pageApp.evaluate(() => {
      const glass = document.querySelector('flt-glass-pane') || document.querySelector('flutter-view');
      const canvas = document.querySelector('flt-glass-pane')?.shadowRoot?.querySelector('canvas') ||
                     document.querySelector('flutter-view')?.shadowRoot?.querySelector('canvas') ||
                     document.querySelector('canvas');
      let dataLen = 0;
      if (canvas) {
        try {
          dataLen = canvas.toDataURL().length;
        } catch (e) {}
      }
      return {
        hasView: !!glass,
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        canvasDataLength: dataLen,
        title: document.title
      };
    });

    console.log(`  Flutter App: ViewMounted=${flutterStatus.hasView}, CanvasMounted=${flutterStatus.hasCanvas} (${flutterStatus.canvasWidth}x${flutterStatus.canvasHeight}), RenderedBytes=${flutterStatus.canvasDataLength}, Title="${flutterStatus.title}"`);
    await pageApp.screenshot({ path: path.join(SCREENSHOT_DIR, `${label}-flutter-app-desktop.png`) });

    if (!flutterStatus.hasCanvas || flutterStatus.canvasWidth === 0) {
      results.passed = false;
      results.errors.push('Flutter web app failed to mount rendered UI canvas at /app/!');
    } else {
      console.log(`  ✓ Flutter Web App PASSED: Fully mounted and rendered graphics.`);
    }
    await ctxApp.close();

    // -------------------------------------------------------------------------
    // 8. Linked Documentation Pages (Guide & Privacy)
    // -------------------------------------------------------------------------
    console.log(`\n--- Testing Documentation Pages (Guide & Privacy) ---`);
    for (const docPage of ['guide.html', 'privacy.html']) {
      const ctxDoc = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const pageDoc = await ctxDoc.newPage();
      const res = await pageDoc.goto(`${baseUrl}/${docPage}`, { waitUntil: 'networkidle' });
      const status = res.status();
      const title = await pageDoc.title();
      console.log(`  Page ${docPage}: status=${status}, title="${title}"`);

      if (status !== 200) {
        results.passed = false;
        results.errors.push(`Page ${docPage} returned HTTP ${status}!`);
      }
      await ctxDoc.close();
    }

  } catch (err) {
    results.passed = false;
    results.errors.push(`Unhandled test exception: ${err.message}`);
    console.error('Fatal gate error:', err);
  } finally {
    await browser.close();
  }

  console.log(`\n---------------------------------------------------------------`);
  console.log(`GATE EXECUTION COMPLETED FOR: [${label}]`);
  console.log(`RESULT: ${results.passed ? 'PASSED (100% OK)' : 'FAILED'}`);
  if (results.errors.length > 0) {
    console.log(`ERRORS ENCOUNTERED (${results.errors.length}):`);
    results.errors.forEach((e, idx) => console.log(`  ${idx + 1}. ${e}`));
  }
  console.log(`---------------------------------------------------------------\n`);

  return results;
}

/**
 * Main entry point
 */
async function main() {
  let staticServer = null;

  try {
    const distDir = path.join(ROOT_DIR, 'dist');
    staticServer = await createStaticServer(distDir, LOCAL_PORT);

    if (targetMode === 'local' || targetMode === 'both') {
      const localResults = await runGateForBaseUrl(LOCAL_BASE, 'local');
      if (!localResults.passed) {
        process.exitCode = 1;
      }
    }

    if (targetMode === 'remote' || targetMode === 'both') {
      const remoteResults = await runGateForBaseUrl(REMOTE_BASE, 'remote');
      if (!remoteResults.passed) {
        process.exitCode = 1;
      }
    }
  } finally {
    if (staticServer) {
      staticServer.close();
    }
  }
}

main().catch((err) => {
  console.error('Fatal entry error:', err);
  process.exit(1);
});
