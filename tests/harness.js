import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import * as A from './assert.js';

// Re-export so test files can do: import { group, eq, ok } from './harness.js'
export const { eq, ok, group } = A;

const here = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(here).filter(f => f.endsWith('.test.js'));
for (const f of files) { await import(pathToFileURL(join(here, f)).href); }

console.log(`\n${A.fail ? '✗' : '✓'} ${A.pass} passed, ${A.fail} failed`);
process.exit(A.fail ? 1 : 0);
