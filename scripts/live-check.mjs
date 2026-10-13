// Live check of @ng-address/nipost against the real NIPOST gateway.
// Usage (key from env, never printed):
//   NIPOST_API_KEY=... pnpm --filter @ng-address/nipost build && node scripts/live-check.mjs
// Optional: NIPOST_LEVEL (1-5, default 1), NIPOST_CODE (postcode to look up).
import { NipostProvider } from '../packages/nipost/dist/index.js';

const apiKey = process.env.NIPOST_API_KEY;
if (!apiKey) {
  console.error('NIPOST_API_KEY is not set in this shell.');
  process.exit(1);
}

const level = Number(process.env.NIPOST_LEVEL ?? 1);
const provider = new NipostProvider({ apiKey, level, maxRetries: 0 });
const BASE = 'https://api.postcode.gov.ng';

const trim = (v) => {
  const s = JSON.stringify(v, null, 2);
  return s.length > 900 ? `${s.slice(0, 900)}\n… (${s.length} chars)` : s;
};

let failures = 0;
async function step(name, fn) {
  try {
    const out = await fn();
    console.log(`\nPASS ${name}\n${trim(out)}`);
    return out;
  } catch (err) {
    failures += 1;
    const e = err ?? {};
    console.log(
      `\nFAIL ${name}\n  ${e.name ?? 'Error'}: ${e.message}` +
        `${e.httpStatus ? ` (HTTP ${e.httpStatus})` : ''}` +
        `${e.details ? `\n  details: ${JSON.stringify(e.details)}` : ''}`
    );
    return undefined;
  }
}

async function raw(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'X-API-Key': apiKey } });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body };
}

console.log(`Live check, lookup level ${level}, base ${BASE}`);

await step('healthCheck', () => provider.healthCheck());

const states = await step('listStates', () => provider.listStates());
const stateCode = states?.[0]?.code ?? 'EK';
const lgas = await step(`listLgas(${stateCode})`, () => provider.listLgas(stateCode));
const lgaCode = lgas?.[0]?.code ?? '01';
const districts = await step(`listDistricts(${stateCode}, ${lgaCode})`, () =>
  provider.listDistricts(stateCode, lgaCode)
);
const districtCode = districts?.[0]?.code;
const areas = districtCode
  ? await step(`listAreas(${stateCode}, ${lgaCode}, ${districtCode})`, () =>
      provider.listAreas(stateCode, lgaCode, districtCode)
    )
  : undefined;

await step(`autocomplete("${stateCode}")`, () => provider.autocomplete(stateCode));
await step(`search("${stateCode}${lgaCode}")`, () => provider.search({ query: `${stateCode}${lgaCode}` }));

// Find a real postcode in the sandbox instead of assuming one exists.
let code = process.env.NIPOST_CODE;
if (!code && districtCode && areas?.[0]?.code) {
  const assembled = await step('assemble (from first real segments)', () =>
    provider.assemble({
      state: stateCode,
      lga: lgaCode,
      district: districtCode,
      area: areas[0].code,
      unit: '01'
    })
  );
  code = assembled?.postcode;
}
code ??= 'EK-01-A03-FK-01';

await step(`disassemble("${code}")`, () => provider.disassemble(code));

console.log(`\n--- RAW lookup (dashed) for ${code}`);
console.log(trim(await raw(`/v1/lookup?code=${encodeURIComponent(code)}&level=${level}`)));
console.log(`--- RAW lookup (compact) for ${code}`);
console.log(trim(await raw(`/v1/lookup?code=${encodeURIComponent(code.replace(/-/g, ''))}&level=${level}`)));

await step(`resolvePostcode("${code}")`, async () => {
  const r = await provider.resolvePostcode(code);
  return { status: r.status, postcode: r.address.postcode, administrative: r.address.administrative, street: r.address.street };
});

// Reverse / nearby need a real coordinate; Abuja city centre is only a probe, not an assumption of a hit.
await step('reverseGeocode(9.0765, 7.3986)', () => provider.reverseGeocode({ latitude: 9.0765, longitude: 7.3986 }, { maxDistanceM: 250 }));
await step('nearby(9.0765, 7.3986)', () => provider.nearby({ latitude: 9.0765, longitude: 7.3986 }));

console.log(`\nDone. ${failures} failing step(s).`);
process.exit(failures ? 1 : 0);
