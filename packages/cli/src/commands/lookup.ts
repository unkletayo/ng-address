import pc from 'picocolors';
import { isValidPostcodeFormat, AddressError } from '@ng-address/core';
import { NipostProvider } from '@ng-address/nipost';
import { resolveNipostApiKey } from '../utils/env.js';
import { ExitCode } from '../utils/exit.js';
import { formatAddressCard } from '../formatters/card.js';
import { formatJson } from '../formatters/json.js';

export interface LookupOptions {
  apiKey?: string;
  json?: boolean;
  compact?: boolean;
}

export async function lookupCommand(
  postcode: string,
  options: LookupOptions = {}
): Promise<number> {
  const code = postcode?.trim();

  if (!code) {
    console.error(pc.red('Error: Postcode argument is required.'));
    return ExitCode.VALIDATION_ERROR;
  }

  // 1. Offline syntax check first
  if (!isValidPostcodeFormat(code)) {
    if (options.json) {
      console.log(
        formatJson(
          {
            success: false,
            error: 'Invalid Nigerian postcode format',
            postcode: code
          },
          options.compact
        )
      );
    } else {
      console.error(pc.red(`✗ Error: "${code}" is not a valid Nigerian postcode format.`));
      console.error(pc.dim('  Valid formats: "LA-11-W06-TC-10" (digital) or "100001" (traditional).'));
    }
    return ExitCode.VALIDATION_ERROR;
  }

  // 2. Authentication check
  const apiKey = resolveNipostApiKey(options.apiKey);
  if (!apiKey) {
    if (options.json) {
      console.log(
        formatJson(
          {
            success: false,
            error: 'Missing NIPOST_API_KEY environment variable or --api-key flag'
          },
          options.compact
        )
      );
    } else {
      console.error(pc.yellow('⚠ Missing NIPOST API credentials.'));
      console.error(
        pc.dim(
          '  Online postcode resolution requires an API key.\n' +
          '  Set it via: export NIPOST_API_KEY="your_api_key" or use --api-key <key>'
        )
      );
    }
    return ExitCode.SYSTEM_ERROR;
  }

  // 3. Resolution via NipostProvider
  try {
    const provider = new NipostProvider({ apiKey });
    const resolved = await provider.resolvePostcode(code);

    if (options.json) {
      console.log(formatJson(resolved, options.compact));
    } else {
      console.log(formatAddressCard(resolved.address));
    }

    return ExitCode.SUCCESS;
  } catch (err: unknown) {
    if (err instanceof AddressError) {
      if (options.json) {
        console.log(
          formatJson(
            {
              success: false,
              code: err.code,
              message: err.message
            },
            options.compact
          )
        );
      } else {
        console.error(pc.red(`✗ Address Error [${err.code}]: ${err.message}`));
      }

      if (err.code === 'NOT_FOUND' || err.code === 'INVALID_POSTCODE') {
        return ExitCode.VALIDATION_ERROR;
      }
      return ExitCode.SYSTEM_ERROR;
    }

    const msg = err instanceof Error ? err.message : String(err);
    if (options.json) {
      console.log(formatJson({ success: false, error: msg }, options.compact));
    } else {
      console.error(pc.red(`✗ Unexpected Error: ${msg}`));
    }
    return ExitCode.SYSTEM_ERROR;
  }
}
