#!/usr/bin/env node
/**
 * Solana RPC Client Generator CLI
 * 
 * Usage:
 *   npx solana-rpc-gen [options]
 *   npx solana-rpc-gen --lang typescript,python,go
 *   npx solana-rpc-gen --all
 */

import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const LANGUAGES = [
  'typescript', 'python', 'go', 'java', 'csharp', 
  'rust', 'php', 'ruby', 'swift', 'kotlin'
];

const LANG_ALIASES: Record<string, string> = {
  'ts': 'typescript',
  'js': 'typescript',
  'py': 'python',
  'golang': 'go',
  'c#': 'csharp',
  'cs': 'csharp',
  'dotnet': 'csharp',
  'rs': 'rust',
  'rb': 'ruby',
  'kt': 'kotlin',
};

function printHelp() {
  console.log(`
Solana RPC Client Generator

Usage:
  solana-rpc-gen [options]

Options:
  --lang, -l <langs>   Languages to generate (comma-separated)
  --all, -a            Generate all languages
  --list               List available languages
  --out, -o <dir>      Output directory (default: ./generated)
  --help, -h           Show this help

Languages:
  ${LANGUAGES.join(', ')}

Aliases:
  ts/js → typescript, py → python, rs → rust, rb → ruby, 
  cs/c#/dotnet → csharp, kt → kotlin, golang → go

Examples:
  solana-rpc-gen --all
  solana-rpc-gen -l typescript,python,go
  solana-rpc-gen -l ts,py,rs -o ./src/generated
`);
}

function parseLangs(input: string): string[] {
  return input.split(',').map(l => {
    const normalized = l.trim().toLowerCase();
    return LANG_ALIASES[normalized] || normalized;
  }).filter(l => LANGUAGES.includes(l));
}

async function generate(langs: string[]) {
  console.log(`\n🔧 Solana RPC Client Generator\n`);
  console.log(`Generating: ${langs.join(', ')}\n`);

  for (const lang of langs) {
    const script = path.join(ROOT, 'scripts', `generate-${lang === 'typescript' ? 'client' : lang}.ts`);
    console.log(`📦 ${lang}...`);
    try {
      execSync(`npx ts-node --esm "${script}"`, { 
        cwd: ROOT, 
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      console.log(`   ✅ Done`);
    } catch (err: any) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`   Output: ${path.join(ROOT, 'generated')}\n`);
}

// Parse args
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  printHelp();
  process.exit(0);
}

if (args.includes('--list')) {
  console.log('Available languages:', LANGUAGES.join(', '));
  process.exit(0);
}

let langs: string[] = [];

if (args.includes('--all') || args.includes('-a')) {
  langs = [...LANGUAGES];
} else {
  const langIdx = args.findIndex(a => a === '--lang' || a === '-l');
  if (langIdx !== -1 && args[langIdx + 1]) {
    langs = parseLangs(args[langIdx + 1]);
  }
}

if (langs.length === 0) {
  console.error('No valid languages specified. Use --help for usage.');
  process.exit(1);
}

generate(langs);
