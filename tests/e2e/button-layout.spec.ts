import { test, expect } from '@playwright/test';

test('HUD buttons respect spacing and radius tokens', async ({ page }) => {
  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';
  await page.goto(baseUrl);

  const xpButton = page.getByRole('button', { name: '+1 XP' });
  await expect(xpButton).toBeVisible();

  const settings = page.locator('#theme-select');
  await expect(settings).toBeVisible();

  const { hudSpacing, hudRadius } = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const fontSize = parseFloat(styles.fontSize);
    return {
      hudSpacing: `${parseFloat(styles.getPropertyValue('--hud-spacing')) * fontSize}px`,
      hudRadius: `${parseFloat(styles.getPropertyValue('--hud-radius-sm')) * fontSize}px`,
    };
  });

  const xpPanelPadding = await xpButton.evaluate((el) => {
    const panel = el.closest('[class*="panel"]');
    return panel ? getComputedStyle(panel).padding : '';
  });
  expect(xpPanelPadding).toBe(hudSpacing);

  const xpRadius = await xpButton.evaluate((el) => getComputedStyle(el).borderRadius);
  expect(xpRadius).toBe(hudRadius);

  const xpBox = await xpButton.boundingBox();
  const settingsBox = await settings.boundingBox();
  if (xpBox && settingsBox) {
    expect(xpBox.x + xpBox.width).toBeLessThan(settingsBox.x);
  } else {
    throw new Error('Could not determine element positions');
  }
});
