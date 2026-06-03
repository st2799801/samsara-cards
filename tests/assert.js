// Shared assertion state — ESM singleton, shared across all imports
export let pass = 0, fail = 0;

export function eq(actual, expected, msg) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; }
  else { fail++; console.error(`✗ ${msg}\n   expected ${e}\n   got      ${a}`); }
}
export function ok(cond, msg) {
  if (cond) { pass++; } else { fail++; console.error(`✗ ${msg}`); }
}
export function group(name, fn) { console.log(`\n# ${name}`); fn(); }
