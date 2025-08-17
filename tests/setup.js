import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const tauriDir = path.resolve(__dirname, '../src-tauri');

const ext = process.platform === 'win32' ? '.exe' : '';
export const appPath = path.resolve(tauriDir, `target/debug/zimbomate${ext}`);
