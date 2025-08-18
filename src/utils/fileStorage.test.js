import { describe, it, expect, vi, afterEach } from 'vitest';
import { saveFile, loadFile } from './fileStorage.js';

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
  BaseDirectory: { AppData: 'app' },
}));

afterEach(() => {
  delete window.__TAURI__;
  vi.clearAllMocks();
});

describe('fileStorage tauri integration', () => {
  it('writes file using fs API when Tauri is available', async () => {
    window.__TAURI__ = {};
    const { writeTextFile, BaseDirectory } = await import('@tauri-apps/plugin-fs');
    await saveFile('test.json', '{"a":1}');
    expect(writeTextFile).toHaveBeenCalledWith('test.json', '{"a":1}', {
      dir: BaseDirectory.AppData,
    });
  });

  it('reads file using fs API when Tauri is available', async () => {
    window.__TAURI__ = {};
    const { readTextFile, BaseDirectory } = await import('@tauri-apps/plugin-fs');
    readTextFile.mockResolvedValueOnce('content');
    await expect(loadFile('test.json')).resolves.toBe('content');
    expect(readTextFile).toHaveBeenCalledWith('test.json', {
      dir: BaseDirectory.AppData,
    });
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
    const file = new File([fileContent], 'test.json', {
      type: 'application/json',
    });

    const handlers = {};
    const input = {
      type: 'file',
      accept: '',
      addEventListener: vi.fn((event, handler) => {
        handlers[event] = handler;
      }),
      removeEventListener: vi.fn(),
      click: vi.fn(() => {
        handlers.change();
      }),
      files: [file],
    };

    const createSpy = vi.spyOn(document, 'createElement').mockReturnValue(input);

    const originalReader = global.FileReader;
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
    global.FileReader = originalReader;
  });

  it('rejects when file input dialog is cancelled', async () => {
    const originalStorage = global.localStorage;
    global.localStorage = { getItem: () => null };

    const handlers = {};
    const input = {
      type: 'file',
      accept: '',
      addEventListener: vi.fn((event, handler) => {
        handlers[event] = handler;
      }),
      removeEventListener: vi.fn(),
      click: vi.fn(() => {
        handlers.cancel();
      }),
    };

    const createSpy = vi.spyOn(document, 'createElement').mockReturnValue(input);

    await expect(loadFile('key')).rejects.toThrow('File selection cancelled');
    expect(input.removeEventListener).toHaveBeenCalledWith('change', handlers.change);
    expect(input.removeEventListener).toHaveBeenCalledWith('cancel', handlers.cancel);

    global.localStorage = originalStorage;
    createSpy.mockRestore();
  });

  it('rejects with an error when file reading fails', async () => {
    const originalStorage = global.localStorage;
    global.localStorage = { getItem: () => null };

    const handlers = {};
    const input = {
      type: 'file',
      accept: '',
      addEventListener: vi.fn((event, handler) => {
        handlers[event] = handler;
      }),
      removeEventListener: vi.fn(),
      click: vi.fn(() => {
        handlers.change();
      }),
      files: [{}],
    };

    const createSpy = vi.spyOn(document, 'createElement').mockReturnValue(input);

    const originalReader = global.FileReader;
    class MockReader {
      readAsText() {
        this.error = new Error('read error');
        this.onerror();
      }
    }
    global.FileReader = MockReader;

    await expect(loadFile('key')).rejects.toThrow('read error');

    global.localStorage = originalStorage;
    createSpy.mockRestore();
    global.FileReader = originalReader;
  });
});
