import pc from 'picocolors';
import { normalizeNigerianAddress } from '@ng-address/core';
import { ExitCode } from '../utils/exit.js';
import { formatJson } from '../formatters/json.js';
import { formatAddressCard } from '../formatters/card.js';
import { readStdin } from '../utils/stdin.js';

export interface NormalizeOptions {
  json?: boolean;
  compact?: boolean;
}

export async function normalizeCommand(
  inputArg?: string,
  options: NormalizeOptions = {}
): Promise<number> {
  const input = inputArg?.trim() || (await readStdin());

  if (!input) {
    console.error(pc.red('Error: Input address text is required to normalize.'));
    return ExitCode.VALIDATION_ERROR;
  }

  const normalized = normalizeNigerianAddress(input);

  if (options.json) {
    console.log(formatJson(normalized, options.compact));
  } else if (options.compact) {
    console.log(normalized.raw);
  } else {
    console.log(formatAddressCard(normalized));
  }

  return ExitCode.SUCCESS;
}
