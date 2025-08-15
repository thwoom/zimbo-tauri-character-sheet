import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { _electron as electron, test, expect } from '@playwright/test';

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
  const panel = await page.$('.panel');

  const initialStyles = await page.evaluate((panelEl) => {
    const root = getComputedStyle(document.documentElement);
    const panelStyles = panelEl ? getComputedStyle(panelEl) : null;
    return {
      bg: root.getPropertyValue('--color-bg-start').trim(),
      border: panelStyles ? panelStyles.borderColor : '',
      text: getComputedStyle(document.body).color,
    };
  }, panel);

  await themeSelect.selectOption('classic');
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(theme).toBe('classic');

  const updatedStyles = await page.evaluate((panelEl) => {
    const root = getComputedStyle(document.documentElement);
    const panelStyles = panelEl ? getComputedStyle(panelEl) : null;
    return {
      bg: root.getPropertyValue('--color-bg-start').trim(),
      border: panelStyles ? panelStyles.borderColor : '',
      text: getComputedStyle(document.body).color,
    };
  }, panel);

  expect(updatedStyles.bg).not.toBe(initialStyles.bg);
  expect(updatedStyles.border).not.toBe(initialStyles.border);
  expect(updatedStyles.text).not.toBe(initialStyles.text);
});

test('applies unique tokens for each theme', async () => {
  const themeSelect = await page.$('#theme-select');
  const themes = ['cosmic', 'classic', 'moebius'];
  const tokens: string[] = [];

  for (const theme of themes) {
    await themeSelect.selectOption(theme);
    const tokenValues = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        colorText: styles.getPropertyValue('--color-text').trim(),
        panelBorder: styles.getPropertyValue('--panel-border').trim(),
      };
    });
    tokens.push(`${tokenValues.colorText}|${tokenValues.panelBorder}`);
  }

  expect(new Set(tokens).size).toBe(themes.length);
});

test('captures visual regressions across themes', async () => {
  const themeSelect = await page.$('#theme-select');
  for (const theme of ['cosmic', 'classic', 'moebius']) {
    await themeSelect.selectOption(theme);
    await expect(page).toHaveScreenshot(`theme-${theme}.png`);
  }
});
