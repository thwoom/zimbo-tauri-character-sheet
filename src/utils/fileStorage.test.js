/* eslint-env jest */
import { invoke } from '@tauri-apps/api/core';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { saveFile, loadFile } from './fileStorage.js';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

afterEach(() => {
  delete window.__TAURI__;
  vi.clearAllMocks();
});

describe('fileStorage tauri integration', () => {
  it('calls invoke to save file when Tauri is available', async () => {
    window.__TAURI__ = {};
    await saveFile('test.json', '{"a":1}');
    expect(invoke).toHaveBeenCalledWith('write_file', { path: 'test.json', contents: '{"a":1}' });
  });

  it('calls invoke to load file when Tauri is available', async () => {
    window.__TAURI__ = {};
    invoke.mockResolvedValueOnce('content');
    await expect(loadFile('test.json')).resolves.toBe('content');
    expect(invoke).toHaveBeenCalledWith('read_file', { path: 'test.json' });
  });
});

describe('fileStorage browser fallback', () => {
  it('saves to localStorage when Tauri is unavailable', async () => {
    const original = global.localStorage;
    const setItem = vi.fn();
    global.localStorage = { setItem };
    await saveFile('key', 'value');
    expect(setItem).toHaveBeenCalledWith('key', 'value');
    global.localStorage = original;
  });

  it('loads from localStorage when present', async () => {
    const original = global.localStorage;
    const getItem = vi.fn(() => 'stored');
    global.localStorage = { getItem };
    await expect(loadFile('key')).resolves.toBe('stored');
    expect(getItem).toHaveBeenCalledWith('key');
    global.localStorage = original;
  });

  it('uses file input when localStorage has no item', async () => {
    const originalStorage = global.localStorage;
    const getItem = vi.fn(() => null);
    global.localStorage = { getItem };
    const fileContent = '{"foo":"bar"}';
    const file = new File([fileContent], 'test.json', { type: 'application/json' });

    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    input.click = () => {
      input.onchange();
    };

    const createSpy = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'input') return input;
      return document.createElement(tag);
    });

    const OriginalFileReader = global.FileReader;
    class MockReader {
      readAsText() {
        this.result = fileContent;
        this.onload();
      }
    }
    global.FileReader = MockReader;

    await expect(loadFile('key')).resolves.toBe(fileContent);

    global.localStorage = originalStorage;
    createSpy.mockRestore();
    global.FileReader = OriginalFileReader;
  });
});
