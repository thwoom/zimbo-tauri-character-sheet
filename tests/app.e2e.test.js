import { test, expect } from 'vitest';

const parseXp = (text) => {
  const match = /XP: (\d+)/.exec(text);
  return match ? Number(match[1]) : 0;
};

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
