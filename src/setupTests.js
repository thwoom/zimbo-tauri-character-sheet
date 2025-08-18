import { webcrypto } from 'node:crypto';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Provide Web Crypto API in test environment if missing
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('0.0.0'),
}));

// Force reduced motion in tests to make modal exit instantaneous
vi.mock('framer-motion', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useReducedMotion: () => true,
  };
});
