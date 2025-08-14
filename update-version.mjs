import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = pkg.version;

const tauriConfigPath = './src-tauri/tauri.conf.json';
const tauriConfig = JSON.parse(readFileSync(tauriConfigPath, 'utf8'));
tauriConfig.version = version;
writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');

const cargoTomlPath = './src-tauri/Cargo.toml';
let cargoToml = readFileSync(cargoTomlPath, 'utf8');
cargoToml = cargoToml.replace(/version = "[^"]+"/, `version = "${version}"`);
writeFileSync(cargoTomlPath, cargoToml);
