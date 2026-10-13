import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
  NIGERIAN_STATES,
  findNigerianState,
  normalizeNigerianAddress,
  isValidPostcodeFormat
} from '@ng-address/core';
import { lookupCommand } from './lookup.js';
import { validateCommand } from './validate.js';
import { ExitCode } from '../utils/exit.js';

export async function interactiveWizard(): Promise<number> {
  p.intro(pc.bold(pc.bgCyan(pc.black(' @ng-address/cli — Nigerian Address Utilities '))));

  const action = await p.select({
    message: 'What address operation would you like to perform?',
    options: [
      { value: 'lookup', label: '1. Resolve NDAPS Postcode', hint: 'Online lookup via NIPOST' },
      { value: 'validate', label: '2. Validate Address / Postcode', hint: 'Offline validation' },
      { value: 'normalize', label: '3. Normalize Address String', hint: 'Standardize format' },
      { value: 'browse', label: '4. Browse States & LGAs', hint: 'Offline administrative taxonomy' },
      { value: 'exit', label: '5. Exit' }
    ]
  });

  if (p.isCancel(action) || action === 'exit') {
    p.outro('Operation cancelled. Bye!');
    return ExitCode.SUCCESS;
  }

  if (action === 'lookup') {
    const postcode = await p.text({
      message: 'Enter NDAPS digital or traditional postcode:',
      placeholder: 'e.g. LA-11-W06-TC-10',
      validate: (val) => {
        if (!val || !val.trim()) return 'Postcode is required';
        if (!isValidPostcodeFormat(val.trim())) return 'Invalid Nigerian postcode format';
        return undefined;
      }
    });

    if (p.isCancel(postcode)) {
      p.outro('Cancelled.');
      return ExitCode.SUCCESS;
    }

    const s = p.spinner();
    s.start('Resolving postcode with NIPOST NDAPS...');
    const code = await lookupCommand(String(postcode));
    s.stop('Finished.');
    p.outro('Done!');
    return code;
  }

  if (action === 'validate') {
    const input = await p.text({
      message: 'Enter address or postcode to validate:',
      placeholder: 'e.g. Ikeja, Lagos or 100001',
      validate: (val) => (!val || !val.trim() ? 'Input is required' : undefined)
    });

    if (p.isCancel(input)) {
      p.outro('Cancelled.');
      return ExitCode.SUCCESS;
    }

    const code = await validateCommand(String(input));
    p.outro('Validation complete.');
    return code;
  }

  if (action === 'normalize') {
    const input = await p.text({
      message: 'Enter raw address string to normalize:',
      placeholder: 'e.g. 10 marina str lagos island',
      validate: (val) => (!val || !val.trim() ? 'Input is required' : undefined)
    });

    if (p.isCancel(input)) {
      p.outro('Cancelled.');
      return ExitCode.SUCCESS;
    }

    const normalized = normalizeNigerianAddress(String(input));
    p.note(normalized.raw, 'Normalized Address:');
    p.outro('Normalization complete.');
    return ExitCode.SUCCESS;
  }

  if (action === 'browse') {
    const stateChoice = await p.select({
      message: 'Select a Nigerian State to view its LGAs:',
      options: NIGERIAN_STATES.map((s) => ({
        value: s.name,
        label: `${s.name} (${s.code})`,
        hint: `Capital: ${s.capital} • ${s.lgas.length} LGAs`
      }))
    });

    if (p.isCancel(stateChoice)) {
      p.outro('Cancelled.');
      return ExitCode.SUCCESS;
    }

    const state = findNigerianState(String(stateChoice));
    if (state) {
      p.note(
        state.lgas.map((lga, i) => `${(i + 1).toString().padStart(2)}. ${lga}`).join('\n'),
        `Official LGAs in ${state.name} (${state.lgas.length}):`
      );
    }

    p.outro('Browsing complete.');
    return ExitCode.SUCCESS;
  }

  return ExitCode.SUCCESS;
}
