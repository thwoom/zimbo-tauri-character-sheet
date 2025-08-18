import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { waitTauriDriverReady } from '@crabnebula/tauri-driver';
import { remote, type Browser } from 'webdriverio';
import { beforeAll } from 'vitest';

declare global {
  // eslint-disable-next-line no-var
  var browser: Browser;
  // eslint-disable-next-line no-var
  var __E2E_BROWSER_PROMISE__: Promise<Browser> | undefined;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tauriDir = path.resolve(__dirname, '../src-tauri');

if (!globalThis.__E2E_BROWSER_PROMISE__) {
  globalThis.__E2E_BROWSER_PROMISE__ = (async () => {
    spawnSync('npx', ['tauri', 'build', '--debug'], {
      cwd: tauriDir,
      stdio: 'inherit',
    });

    const tauriDriver = spawn('npx', ['tauri-driver'], {
      stdio: 'inherit',
      shell: true,
    });
    await waitTauriDriverReady();

    const appPath = path.resolve(tauriDir, 'target/debug/zimbo-panel');
    const browser = await remote({
      hostname: '127.0.0.1',
      port: 4444,
      capabilities: {
        'tauri:options': {
          application: appPath,
        },
      },
      logLevel: 'error',
    });

    process.once('exit', async () => {
      await browser.deleteSession();
      tauriDriver.kill();
    });

    return browser;
  })();
}

beforeAll(async () => {
  globalThis.browser = await globalThis.__E2E_BROWSER_PROMISE__;
}, 120000);

export {};
