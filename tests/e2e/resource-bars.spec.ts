import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { waitTauriDriverReady } from '@crabnebula/tauri-driver';
import { beforeAll, afterAll, test, expect } from 'vitest';
import { remote } from 'webdriverio';

let browser: any;
let tauriDriver: any;

beforeAll(async () => {
  const tauriDir = path.resolve(__dirname, '../../src-tauri');
  spawnSync('npx', ['tauri', 'build', '--debug'], {
    cwd: tauriDir,
    stdio: 'inherit',
  });

  tauriDriver = spawn('npx', ['tauri-driver'], {
    stdio: 'inherit',
    shell: true,
  });
  await waitTauriDriverReady();

  const appPath = path.resolve(tauriDir, 'target/debug/zimbo-panel');
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

const getWidthPercent = async (element: any) => {
  const style = await element.getAttribute('style');
  const match = /width: ([0-9.]+)%/.exec(style || '');
  return match ? parseFloat(match[1]) : 0;
};

test('resource bars reflect HP and XP changes', async () => {
  const hpBar = await browser.$('[aria-label="Health points"]');
  const xpBar = await browser.$('[aria-label="Experience points"]');

  const hpFill = await hpBar.$('div');
  const xpFill = await xpBar.$('div');

  const maxHp = Number(await hpBar.getAttribute('aria-valuemax'));
  const maxXp = Number(await xpBar.getAttribute('aria-valuemax'));

  const initialHp = Number(await hpBar.getAttribute('aria-valuenow'));
  const initialHpWidth = await getWidthPercent(hpFill);
  expect(initialHpWidth).toBeCloseTo((initialHp / maxHp) * 100, 1);

  const initialXp = Number(await xpBar.getAttribute('aria-valuenow'));
  const initialXpWidth = await getWidthPercent(xpFill);
  expect(initialXpWidth).toBeCloseTo((initialXp / maxXp) * 100, 1);

  // Damage HP
  await (await browser.$('button=-1 HP')).click();
  const damagedHp = Number(await hpBar.getAttribute('aria-valuenow'));
  expect(damagedHp).toBe(initialHp - 1);
  const damagedHpWidth = await getWidthPercent(hpFill);
  expect(damagedHpWidth).toBeCloseTo((damagedHp / maxHp) * 100, 1);

  // Heal HP
  await (await browser.$('button=+1 HP')).click();
  const healedHp = Number(await hpBar.getAttribute('aria-valuenow'));
  expect(healedHp).toBe(initialHp);
  const healedHpWidth = await getWidthPercent(hpFill);
  expect(healedHpWidth).toBeCloseTo((healedHp / maxHp) * 100, 1);

  // Spend XP
  await (await browser.$('button=-1 XP')).click();
  const spentXp = Number(await xpBar.getAttribute('aria-valuenow'));
  expect(spentXp).toBe(initialXp - 1);
  const spentXpWidth = await getWidthPercent(xpFill);
  expect(spentXpWidth).toBeCloseTo((spentXp / maxXp) * 100, 1);

  // Gain XP
  await (await browser.$('button=+1 XP')).click();
  const regainedXp = Number(await xpBar.getAttribute('aria-valuenow'));
  expect(regainedXp).toBe(initialXp);
  const regainedXpWidth = await getWidthPercent(xpFill);
  expect(regainedXpWidth).toBeCloseTo((regainedXp / maxXp) * 100, 1);
}, 120000);
