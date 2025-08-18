
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
  const xpEl = await browser.$(xpSelector);
  const initialXp = parseXp(await xpEl.getText());
  const xpButton = await browser.$(xpButtonSelector);
  await xpButton.click();
  expect(parseXp(await xpEl.getText())).toBe(initialXp + 1);
}, 120000);
