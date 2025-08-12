import { webcrypto } from 'node:crypto';

// Provide Web Crypto API in test environment if missing
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import '@testing-library/jest-dom/vitest';

// Enable automatic XP gain on a miss during tests
globalThis.autoXpOnMiss = true;
