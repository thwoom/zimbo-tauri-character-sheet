#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

process.env.HUSKY = '0';

function run(cmd) {
  console.log(`$ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: true });
    return true;
  } catch {
    console.error(`Command failed: ${cmd}`);
    return false;
  }
}

function writePrettierIgnore() {
  const content = `node_modules\ndist\nbuild\ncoverage\n.next\n.out\nstorybook-static\ncodex.md\nsrc-tauri/capabilities/default.json\nsrc/App.css\nsrc/App.jsx\nsrc/components/InventoryModal.jsx\nsrc/components/StatusModal.jsx\nsrc/main.jsx\nsrc/components/LevelUpModal.jsx\n`;
  fs.writeFileSync('.prettierignore', content);
}

function writeVSCodeSettings() {
  fs.mkdirSync('.vscode', { recursive: true });
  const settings = {
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': 'explicit',
      'source.organizeImports': 'explicit',
    },
    'eslint.validate': ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    'eslint.alwaysShowStatus': true,
    'prettier.requireConfig': true,
  };
  fs.writeFileSync(path.join('.vscode', 'settings.json'), JSON.stringify(settings, null, 2) + '\n');
}

function normalizePackageJson() {
  const pkg = {
    name: 'zimbomate',
    private: true,
    version: '0.1.0',
    license: 'MIT',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      tauri: 'tauri',
      test: 'vitest run',
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
      sync: 'bash git-sync-ask.sh',
      'fix-prs': 'node fix-prs.mjs',
      prepare: 'husky',
    },
    dependencies: {
      '@tauri-apps/api': '^2',
      '@tauri-apps/plugin-opener': '^2',
      react: '^19.1.0',
      'react-dom': '^19.1.0',
      'react-icons': '^5.5.0',
    },
    devDependencies: {
      '@tauri-apps/cli': '^2',
      '@testing-library/jest-dom': '^6.6.4',
      '@testing-library/react': '^16.3.0',
      '@testing-library/user-event': '^14.6.1',
      '@vitejs/plugin-react': '^4.6.0',
      eslint: '^9.33.0',
      'eslint-config-prettier': '^10.1.8',
      'eslint-plugin-import': '^2.32.0',
      'eslint-plugin-jsx-a11y': '^6.10.2',
      'eslint-plugin-react': '^7.37.5',
      'eslint-plugin-react-hooks': '^5.2.0',
      rimraf: '^4.4.1',
      husky: '^9.1.7',
      jsdom: '^26.1.0',
      'lint-staged': '^16.1.5',
      prettier: '^3.6.2',
      rollup: '^4.46.2',
      vite: '^7.0.4',
      vitest: '^3.2.4',
    },
    overrides: {
      'file-entry-cache': '^10.1.3',
      rimraf: '^4.4.1',
    },
    'lint-staged': {
      '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
      '*.{json,md,css,scss,html,yml,yaml}': ['prettier --write'],
    },
    engines: {
      node: '>=20',
    },
  };
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
}

function patchLevelUpModal() {
  const jsxPath = path.join('src', 'components', 'LevelUpModal.jsx');
  if (fs.existsSync(jsxPath)) {
    run(`git checkout --theirs ${jsxPath}`);
    run(`git add ${jsxPath}`);
    const raw = fs.readFileSync(jsxPath, 'utf8');
    const fixed = raw.replace(
      /border:\s*`?1px solid \${isComplete \? ['"]?rgba\(0, 255, 136, 0\.3\)['"]? : ['"]?rgba\(255, 170, 68, 0\.3\)['"]?}`?,/,
      "border: `1px solid ${isComplete ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 170, 68, 0.3)'}`,",
    );
    if (fixed !== raw) {
      fs.writeFileSync(jsxPath, fixed);
      run(`git add ${jsxPath}`);
    }
  }
}

if (!fs.existsSync('.git')) {
  console.error('ERROR: Run from repo root (contains .git)');
  process.exit(1);
}

let prs = [];
try {
  const prOutput = execSync('gh pr list --state open --json number,headRefName,baseRefName,title', {
    encoding: 'utf8',
  });
  prs = JSON.parse(prOutput);
} catch (err) {
  console.error('Unable to fetch PR list via gh');
  console.error(err);
  process.exit(1);
}

if (!prs.length) {
  console.log('No open PRs.');
  process.exit(0);
}

for (const pr of prs) {
  console.log(`\n=== PR #${pr.number}: ${pr.title} [${pr.headRefName} -> ${pr.baseRefName}] ===`);

  run('git merge --abort >/dev/null 2>&1');

  if (!run(`gh pr checkout ${pr.number}`)) continue;
  run(`git fetch origin ${pr.baseRefName}`);

  if (!run(`git merge --no-ff --no-edit origin/${pr.baseRefName}`)) {
    const conflictOutput = execSync('git ls-files -u', { encoding: 'utf8' });
    const conflictFiles = conflictOutput
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split('\t').pop())
      .filter(Boolean);
    if (conflictFiles.includes('.prettierignore')) {
      writePrettierIgnore();
      run('git add .prettierignore');
    }
    if (conflictFiles.includes('.vscode/settings.json')) {
      writeVSCodeSettings();
      run('git add .vscode/settings.json');
    }
    const pkgHasMarkers =
      fs.existsSync('package.json') && fs.readFileSync('package.json', 'utf8').includes('<<<<<<<');
    if (conflictFiles.includes('package.json') || pkgHasMarkers) {
      normalizePackageJson();
      run('git add package.json');
    }
    if (conflictFiles.includes('src/components/LevelUpModal.jsx')) {
      patchLevelUpModal();
    }
    if (conflictFiles.includes('package-lock.json')) {
      run('git rm -f package-lock.json');
    }
    const leftovers = execSync("git grep -n '<<<<<<<' || true", {
      encoding: 'utf8',
    }).trim();
    if (leftovers) {
      console.log('Markers still present; manual fix needed in:\n' + leftovers);
      run('git merge --abort');
      continue;
    }
    if (fs.existsSync(path.join('.git', 'MERGE_HEAD'))) {
      run(`git commit -m "merge ${pr.baseRefName} into ${pr.headRefName}" --no-verify`);
    }
  } else if (fs.existsSync(path.join('.git', 'MERGE_HEAD'))) {
    run(`git commit -m "merge ${pr.baseRefName} into ${pr.headRefName}" --no-verify`);
  }

  fs.rmSync('package-lock.json', { force: true });
  fs.rmSync('node_modules', { recursive: true, force: true });
  if (!run('npm install')) continue;

  run('npx prettier --write .');
  run('npx eslint . --fix');
  if (!run('npm test')) {
    console.log('Tests failed (non-blocking for this script).');
  }

  run('git add -A');
  try {
    execSync('git diff --cached --quiet', { stdio: 'inherit' });
    console.log('No changes to commit.');
  } catch {
    run(
      'git commit -m "chore: auto-merge base, resolve common conflicts, format/lint" --no-verify',
    );
    run('git push -u origin HEAD');
  }
}

console.log('\nAll PRs processed.');
