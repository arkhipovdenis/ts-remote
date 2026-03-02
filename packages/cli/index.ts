#!/usr/bin/env node

import process from 'node:process';
import { fetchCommand } from './commands/fetch';

type ParsedArgs = {
  command: string;
  flags: Record<string, string | boolean>;
};

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const command = args[0] ?? 'help';
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];

      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }

  return { command, flags };
}

function printHelp(): void {
  console.log(`
ts-remote — TypeScript declaration builder for sharing types between independent modules.

Usage: ts-remote <command> [options]

Commands:
  fetch    Download remote .d.ts files to the local cache

Options:
  --config <path>      Path to tsconfig.json (default: ./tsconfig.json)
  --cache-dir <path>   Cache directory (default: node_modules/.ts-remote/)
  --force              Re-fetch all remotes, ignoring cache
  --help               Show this help message
`);
}

async function main(): Promise<void> {
  const { command, flags } = parseArgs(process.argv);

  if (flags['help']) {
    printHelp();
    return;
  }

  switch (command) {
    case 'fetch':
      await fetchCommand(flags);
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
