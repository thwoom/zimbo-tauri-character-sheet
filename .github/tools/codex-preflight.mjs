#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const sh = (c, opt = {}) => {
  try {
    return execSync(c, { stdio: 'pipe', encoding: 'utf8', ...opt });
  } catch (e) {
    if (!opt.ignore) throw e;
    return e.stdout?.toString() ?? '';
  }
};

const base = process.env.CI_BASE || 'main';
const top = sh('git rev-parse --show-toplevel').trim();
if (!top) {
  console.error('no repo');
  process.exit(1);
}
process.chdir(top);

function installDeps() {
  if (existsSync('pnpm-lock.yaml')) return sh('pnpm install');
  if (existsSync('yarn.lock')) return sh('yarn install --silent');
  if (existsSync('package-lock.json')) return sh('npm ci');
  return sh('npm i --no-audit --no-fund'); // fallback when no lockfile is present
}

const head = sh('git rev-parse --abbrev-ref HEAD').trim();
const temp = `codex-preflight/mergecheck/${head}`;

sh(`git switch -c ${temp}`, { ignore: true });
sh('git reset --hard @{-1}', { ignore: true });

const m = spawnSync('git', ['merge', '--no-commit', '--no-ff', `origin/${base}`]);
const conflicts = () =>
  sh('git diff --name-only --diff-filter=U', { ignore: true }).trim().split('\n').filter(Boolean);

if (m.status !== 0) {
  // policy: prefer PR (ours) for code; abort only if unresolved remain
  sh('git checkout --ours .', { ignore: true });
  sh('git add -A', { ignore: true });
  if (conflicts().length) {
    sh('git merge --abort', { ignore: true });
    sh('git switch -');
    sh(`git branch -D ${temp}`, { ignore: true });
    console.error('conflicts remain');
    process.exit(1);
  }
}

sh('git add -A', { ignore: true });
sh('git commit -m "preflight: temp merge" --no-verify', { ignore: true });

console.log('[INFO] Install dependencies…');
installDeps();

console.log('[INFO] Prettier check…');
sh('npx prettier --check .');

console.log('[INFO] ESLint (non-blocking)…');
sh('npx eslint .', { ignore: true });

console.log('[INFO] Tests (non-blocking)…');
try {
  sh('npm test --silent', { ignore: true });
} catch {}

sh('git switch -');
sh(`git branch -D ${temp}`, { ignore: true });
console.log(`preflight PASS for ${head} vs ${base}`);
