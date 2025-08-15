import { _electron as electron, test, expect } from '@playwright/test';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let app;
let page;

test.beforeAll(async () => {
  const tauriDir = path.resolve(__dirname, '../../src-tauri');
  spawnSync('npx', ['tauri', 'build', '--debug'], {
    cwd: tauriDir,
    stdio: 'inherit',
  });
  app = await electron.launch({
    executablePath: path.resolve(tauriDir, 'target/debug/zimbo-panel'),
  });
  page = await app.firstWindow();
});

test.afterAll(async () => {
  if (app) {
    await app.close();
  }
});

test('changes theme via dropdown', async () => {
  const themeSelect = await page.$('#theme-select');
  const initialBg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-bg-start'),
  );
  await themeSelect.selectOption('classic');
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(theme).toBe('classic');
  const updatedBg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-bg-start'),
  );
  expect(updatedBg.trim()).not.toBe(initialBg.trim());
});
