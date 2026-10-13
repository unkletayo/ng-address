import pc from 'picocolors';
import {
  isValidPostcodeFormat,
  findNigerianState,
  NIGERIAN_STATES
} from '@ng-address/core';
import { ExitCode } from '../utils/exit.js';
import { formatJson } from '../formatters/json.js';
import { readStdin } from '../utils/stdin.js';

export interface ValidateOptions {
  json?: boolean;
  compact?: boolean;
  quiet?: boolean;
}

export async function validateCommand(
  inputArg?: string,
  options: ValidateOptions = {}
): Promise<number> {
  const input = inputArg?.trim() || (await readStdin());

  if (!input) {
    if (!options.quiet) {
      console.error(pc.red('Error: Address or postcode input is required.'));
    }
    return ExitCode.VALIDATION_ERROR;
  }

  const isPostcode = isValidPostcodeFormat(input);
  const matchedState = findNigerianState(input);

  // Check if input references any known LGA
  let matchedLgaState: string | undefined;
  for (const s of NIGERIAN_STATES) {
    if (s.lgas.some((l) => l.toLowerCase() === input.toLowerCase())) {
      matchedLgaState = s.name;
      break;
    }
  }

  const isValid = isPostcode || Boolean(matchedState) || Boolean(matchedLgaState);

  const result = {
    input,
    valid: isValid,
    details: {
      isPostcode,
      state: matchedState?.name ?? matchedLgaState ?? null,
      stateCode: matchedState?.code ?? null,
      recognizedLgaInState: matchedLgaState ?? null
    }
  };

  if (options.json) {
    console.log(formatJson(result, options.compact));
  } else if (!options.quiet) {
    if (isValid) {
      console.log(pc.bold(pc.green(`✔ Valid Nigerian Address / Format: "${input}"`)));
      if (isPostcode) {
        console.log(`  ${pc.dim('Type:')} NDAPS / NIPOST Postcode`);
      }
      if (matchedState) {
        console.log(`  ${pc.dim('Recognized State:')} ${matchedState.name} (${matchedState.code})`);
      }
      if (matchedLgaState) {
        console.log(`  ${pc.dim('Recognized LGA:')} ${input} in ${matchedLgaState} State`);
      }
    } else {
      console.error(pc.bold(pc.red(`✗ Invalid or Unrecognized Nigerian Address Input: "${input}"`)));
    }
  }

  return isValid ? ExitCode.SUCCESS : ExitCode.VALIDATION_ERROR;
}
