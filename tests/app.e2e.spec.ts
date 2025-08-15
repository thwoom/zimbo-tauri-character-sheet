/* eslint-disable import/no-unresolved */
import { test, expect } from '@playwright/test';
import { launch } from 'playwright-tauri';

test.beforeAll(async () => {
  // Ensure the Tauri app is built in debug mode
  // e.g., `npx tauri build --debug` run separately or via scripts
});

test('increments XP on button click', async () => {
  const app = await launch({ path: 'src-tauri/target/debug/zimbo-panel' });
  const window = await app.firstWindow();

  await window.click('button:has-text("+1 XP")');
  await expect(window.locator('div:has-text("XP:")')).toContainText('XP: 1');

  await app.close();
});
