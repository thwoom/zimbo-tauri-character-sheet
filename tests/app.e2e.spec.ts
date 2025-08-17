import { test, expect } from 'vitest';

const parseXp = (text: string): number => {
  const match = /XP: (\d+)/.exec(text);
  return match ? Number(match[1]) : 0;
};

test('increments XP on button click', async () => {
  const xpEl = await browser.$('div*=XP:');
  const initialXp = parseXp(await xpEl.getText());
  const xpButton = await browser.$('button=+1 XP');
  await xpButton.click();
  expect(parseXp(await xpEl.getText())).toBe(initialXp + 1);
}, 120000);
