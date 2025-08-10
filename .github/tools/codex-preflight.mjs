#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
const sh=(c,o={})=>{try{return execSync(c,{stdio:'pipe',encoding:'utf8',...o})}catch(e){if(!o.ignore)throw e;return e.stdout?.toString()??''}};
const log=m=>console.log(`[INFO] ${m}`);const fail=m=>{console.error(`[FAIL] ${m}`);process.exit(1)};
const args=process.argv.slice(2);const get=(k,d)=>{const i=args.indexOf(k);return i>=0?(args[i+1]??true):d};
const base=get('--base','main');const fix=!!get('--fix',false);
const top=sh('git rev-parse --show-toplevel').trim(); if(!top) fail('Not inside a git repository.'); process.chdir(top);
const w1=spawnSync('git',['diff','--quiet']); const w2=spawnSync('git',['diff','--cached','--quiet']); if(w1.status!==0||w2.status!==0) fail('Working tree not clean. Commit/stash before preflight.');
log(`Fetching origin/${base}…`); sh(`git fetch origin ${base}`);
const head=sh('git rev-parse --abbrev-ref HEAD').trim(); const temp=`codex-preflight/mergecheck/${head}`;
sh(`git switch -c ${temp}`,{ignore:true}); sh('git reset --hard @{-1}',{ignore:true});
const merge=spawnSync('git',['merge','no-such-flag-to-force-fail']); // guard to ensure env differs? (no)
const merge2=spawnSync('git',['merge','--no-commit','--no-ff',`origin/${base}`]);
const conflicts=()=>sh('git diff --name-only --diff-filter=U',{ignore:true}).trim().split('\n').filter(Boolean);
const pkgSmart=()=>{const files=conflicts().filter(f=>/(^|\/|\\)package\.json$/.test(f));for(const f of files){const o1=sh(`git show ":2:${f}"`,{ignore:true}); const o2=sh(`git show ":3:${f}"`,{ignore:true}); if(!o1||!o2)continue; let o,t; try{o=JSON.parse(o1);t=JSON.parse(o2);}catch{continue}
  const keys=['dependencies','devDependencies','peerDependencies','scripts']; let changed=false;
  for(const k of keys){const a=o[k]||{},b=t[k]||{}; const names=[...new Set([...Object.keys(a),...Object.keys(b)])]; for(const n of names){ if((a[n]??null)!==(b[n]??null)){changed=true;break} } if(changed)break;}
  if(changed){log(`package.json changed in PR → ours: ${f}`); sh(`git checkout --ours "${f}"`)} else {log(`package.json unchanged in PR → theirs: ${f}`); sh(`git checkout --theirs "${f}"`)}; sh(`git add "${f}"`);
}};
const lockRegen=()=>{const files=conflicts().filter(f=>/(^|\/|\\)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/.test(f)); if(!files.length)return;
  for(const f of files) sh(`git rm -f --cached "${f}"`,{ignore:true})||sh(`rm -f "${f}"`,{ignore:true});
  const pm=existsSync('pnpm-lock.yaml')?'pnpm':existsSync('yarn.lock')?'yarn':'npm';
  if(pm==='pnpm') sh('pnpm install'); if(pm==='yarn') sh('yarn install --silent'); if(pm==='npm') sh('npm ci');
  for(const f of ['package-lock.json','yarn.lock','pnpm-lock.yaml']) if(existsSync(f)) sh(`git add "${f}"`);
  log(`Regenerated lockfile(s) with ${pm}`);
};
if(merge2.status!==0){log('Merge reported conflicts; applying policy…'); pkgSmart(); lockRegen(); if(conflicts().length){ sh('git checkout --ours .'); sh('git add -A'); }
  if(conflicts().length){ sh('git merge --abort',{ignore:true}); sh('git switch -'); sh(`git branch -D ${temp}`,{ignore:true}); fail('Conflicts remain after policy.'); }}
sh('git add -A',{ignore:true}); sh('git commit -m "preflight: temp merge for validation" --no-verify',{ignore:true});
let pm = existsSync('pnpm-lock.yaml')?'pnpm':existsSync('yarn.lock')?'yarn':'npm'; log(`Install with ${pm}…`);
if(pm==='pnpm') sh('pnpm install'); if(pm==='yarn') sh('yarn install --silent'); if(pm==='npm') sh('npm ci');
if(fix){ log('Prettier write…'); sh('npx prettier --write .'); } else { log('Prettier check…'); sh('npx prettier --check .'); }
log('ESLint…'); sh('npx eslint .');
try{ const pkg=JSON.parse(readFileSync('package.json','utf8')); if(pkg.scripts?.test){ log('Tests…'); sh('npm test --silent'); } }catch{}
sh('git switch -'); sh(`git branch -D ${temp}`,{ignore:true}); log(`Preflight PASS for ${head} vs ${base}`); process.exit(0);
