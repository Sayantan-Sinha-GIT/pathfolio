import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createPreviewServer } from './preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright-core');

const server = process.env.APP_BASE_URL ? null : createPreviewServer();
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = process.env.APP_BASE_URL || `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
try {
  browser = await chromium.launch({headless:true, channel:process.env.BROWSER_CHANNEL || 'chrome'});
  const context = await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.setDefaultTimeout(15_000);
  async function semantics() {
    await page.locator('flt-semantics-placeholder, flt-semantics').first().waitFor({state:'attached',timeout:45_000});
    const placeholder = page.locator('flt-semantics-placeholder');
    if (await placeholder.count()) await placeholder.first().evaluate(el => el.click());
  }
  async function textIncludes(text) {
    for (let i=0;i<30;i++) {
      if ((await page.locator('body').ariaSnapshot()).includes(text)) return;
      await page.waitForTimeout(100);
    }
    throw new Error(`Expected accessible content: ${text}`);
  }
  async function chooseBackup(buffer) {
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button',{name:'Open Backup File',exact:true}).click();
    await (await chooser).setFiles({name:'pathfolio-backup.json',mimeType:'application/json',buffer});
  }
  await page.goto(`${base}/app/`);
  await semantics();
  await page.getByRole('button',{name:'Start Fresh & Empty',exact:true}).click();
  await page.getByRole('tab',{name:'Pipeline',exact:true}).click();
  await page.getByRole('button',{name:'Add Opportunity',exact:true}).click();
  await page.getByRole('textbox',{name:'Company name *',exact:true}).fill('Release Check Labs');
  await page.getByRole('textbox',{name:'Role title *',exact:true}).fill('UI Engineer');
  await page.getByRole('textbox',{name:'Job posting / referral URL',exact:true}).fill('https://example.com/job');
  await page.getByRole('button',{name:'Create Opportunity',exact:true}).click();
  await textIncludes('Release Check Labs UI Engineer');
  await page.getByRole('tab',{name:'Settings',exact:true}).click();
  await page.getByRole('button',{name:'Export JSON Backup',exact:true}).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button',{name:'Save Backup File',exact:true}).click();
  const download = await downloadEvent;
  assert.match(download.suggestedFilename(), /^pathfolio-backup-.+\.json$/);
  const bytes = await readFile(await download.path());
  const backup = JSON.parse(bytes.toString('utf8'));
  assert.equal(backup.schemaVersion, 1);
  assert.equal(backup.opportunities[0].company, 'Release Check Labs');
  await page.waitForTimeout(350);
  await chooseBackup(bytes);
  await textIncludes('Confirm Restore & Replace');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await chooseBackup(Buffer.from('{"schemaVersion":99}'));
  await textIncludes('Invalid Backup File');
  await page.getByRole('button',{name:'OK',exact:true}).click();
  backup.opportunities[0].company = 'Restored Labs';
  await chooseBackup(Buffer.from(JSON.stringify(backup)));
  await textIncludes('Confirm Restore & Replace');
  await page.getByRole('button',{name:'Confirm & Replace Current Data',exact:true}).click();
  await page.getByRole('tab',{name:'Pipeline',exact:true}).click();
  await textIncludes('Restored Labs UI Engineer');
  // Verify the real built service worker completes installation before offline use.
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await semantics();
  await page.getByRole('tab',{name:'Pipeline',exact:true}).click();
  await textIncludes('Restored Labs UI Engineer');
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await semantics();
  await page.getByRole('tab',{name:'Pipeline',exact:true}).click();
  await textIncludes('Restored Labs UI Engineer');
  assert.deepEqual(errors, [], 'Browser must have no unhandled JavaScript errors');
  console.log('PASS: create opportunity, real JSON file download, import cancel, invalid file rejection, confirmed restore, reload persistence, and offline reload.');
} finally {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
