import { webcrypto } from 'node:crypto';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Provide Web Crypto API in test environment if missing
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('0.0.0'),
}));
