#!/usr/bin/env node

import { exec } from 'child_process';
import { watch } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Directories to watch
const watchDirs = ['src', 'public'];

// File extensions to watch
const watchExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.html',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
];

// Debounce rebuild to avoid multiple rapid rebuilds
let rebuildTimeout = null;
let isRebuilding = false;

async function rebuild() {
  if (isRebuilding) {
    console.log('🔄 Rebuild already in progress, skipping...');
    return;
  }

  isRebuilding = true;
  console.log('🔨 Rebuilding app...');

  try {
    const { stdout, stderr } = await execAsync('npm run build');
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Rebuild completed successfully!');
    console.log('🔄 Tauri app will automatically reload...');
  } catch (error) {
    console.error('❌ Rebuild failed:', error.message);
  } finally {
    isRebuilding = false;
  }
}

function debouncedRebuild() {
  if (rebuildTimeout) {
    clearTimeout(rebuildTimeout);
  }

  rebuildTimeout = setTimeout(() => {
    rebuild();
  }, 500); // 500ms debounce
}

function shouldWatchFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return watchExtensions.includes(ext);
}

function setupWatcher(dir) {
  console.log(`👀 Watching directory: ${dir}`);

  watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename || !shouldWatchFile(filename)) return;

    console.log(`📝 File changed: ${filename}`);
    debouncedRebuild();
  });
}

console.log('🚀 Starting file watcher for auto-rebuild...');
console.log('📁 Watching directories:', watchDirs.join(', '));
console.log('📄 Watching file types:', watchExtensions.join(', '));
console.log('⏱️  Debounce delay: 500ms');
console.log('');

// Set up watchers for each directory
watchDirs.forEach(setupWatcher);

console.log('✅ File watcher is running!');
console.log('💡 Make changes to your source files and the app will automatically rebuild.');
console.log('🔄 The Tauri app will reload with your changes.');
console.log('');
console.log('Press Ctrl+C to stop the watcher.');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping file watcher...');
  process.exit(0);
});
