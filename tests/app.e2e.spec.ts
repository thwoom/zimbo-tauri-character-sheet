import { spawn, spawnSync } from 'child_process';
import { waitTauriDriverReady } from '@crabnebula/tauri-driver';
import { remote } from 'webdriverio';
import { beforeAll, afterAll, test, expect } from 'vitest';
import { tauriDir, appPath } from './setup.js';

let browser; // WebdriverIO.Browser
let tauriDriver;

beforeAll(async () => {
  spawnSync('npx', ['tauri', 'build', '--debug'], {
    cwd: tauriDir,
    stdio: 'inherit',
  });

  tauriDriver = spawn('npx', ['tauri-driver'], {
    stdio: 'inherit',
    shell: true,
  });
  await waitTauriDriverReady();
  browser = await remote({
    hostname: '127.0.0.1',
    port: 4444,
    capabilities: {
      'tauri:options': {
        application: appPath,
      },
    },
    logLevel: 'error',
  });
}, 120000);

afterAll(async () => {
  if (browser) {
    await browser.deleteSession();
  }
  if (tauriDriver) {
    tauriDriver.kill();
  }
});

test('increments XP on button click', async () => {
  const xpEl = await browser.$('[data-testid="xp-display"]');
  const initialXp = parseXp(await xpEl.getText());
  const xpButton = await browser.$('[data-testid="increment-xp"]');
  await xpButton.click();
  expect(parseXp(await xpEl.getText())).toBe(initialXp + 1);
}, 120000);

test('character flow with save and load', async () => {
  // wait for XP text to be available
  const xpEl = await browser.$('div*=XP:');
  const initialXpText = await xpEl.getText();
  const initialXp = parseXp(initialXpText);
  const xpButton = await browser.$('button=+1 XP');
  await xpButton.click();
  expect(parseXp(await xpEl.getText())).toBe(initialXp + 1);

  // Inventory modal
  const inventoryButton = await browser.$('button=Inventory');
  await inventoryButton.click();
  await expect(await browser.$('h2*=Inventory').isExisting()).resolves.toBe(true);
  await expect(await browser.$('div=Phases through time occasionally').isExisting()).resolves.toBe(
    true,
  );
  const unequipBtn = await browser.$('button=Unequip');
  await unequipBtn.click();
  await expect(await browser.$('button=Equip').isExisting()).resolves.toBe(true);
  await (await browser.$('button=Close')).click();

  // Settings
  const themeSelect = await browser.$('#theme-select');
  await themeSelect.selectByVisibleText('classic');
  expect(await browser.$('html').getAttribute('data-theme')).toBe('classic');

  // Save character
  const exportButton = await browser.$('button=Export/Save');
  await exportButton.click();
  const saveButton = await browser.$('button=Save');
  await saveButton.click();
  await expect(await browser.$('div=Character saved!').isExisting()).resolves.toBe(true);
  await (await browser.$('button=Close')).click();

  // change XP then load
  await xpButton.click();
  expect(parseXp(await xpEl.getText())).toBe(initialXp + 2);

  await exportButton.click();
  const loadButton = await browser.$('button=Load');
  await loadButton.click();
  await expect(await browser.$('div=Character loaded!').isExisting()).resolves.toBe(true);
  await (await browser.$('button=Close')).click();

  expect(parseXp(await xpEl.getText())).toBe(initialXp + 1);
}, 120000);
