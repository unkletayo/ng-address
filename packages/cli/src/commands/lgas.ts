import pc from 'picocolors';
import { findNigerianState } from '@ng-address/core';
import { ExitCode } from '../utils/exit.js';
import { formatLgasList } from '../formatters/table.js';
import { formatJson } from '../formatters/json.js';

export interface LgasOptions {
  json?: boolean;
  compact?: boolean;
}

export async function listLgasCommand(
  stateQuery: string,
  options: LgasOptions = {}
): Promise<number> {
  const query = stateQuery?.trim();

  if (!query) {
    console.error(pc.red('Error: State name or code is required (e.g. "Lagos" or "LA").'));
    return ExitCode.VALIDATION_ERROR;
  }

  const state = findNigerianState(query);

  if (!state) {
    if (options.json) {
      console.log(
        formatJson(
          {
            success: false,
            error: `State "${query}" not found.`
          },
          options.compact
        )
      );
    } else {
      console.error(pc.red(`✗ Error: Could not find Nigerian state matching "${query}".`));
    }
    return ExitCode.VALIDATION_ERROR;
  }

  if (options.json) {
    console.log(
      formatJson(
        {
          state: state.name,
          stateCode: state.code,
          capital: state.capital,
          zone: state.geoZone,
          lgaCount: state.lgas.length,
          lgas: state.lgas
        },
        options.compact
      )
    );
  } else {
    console.log(formatLgasList(state.name, state.lgas));
  }

  return ExitCode.SUCCESS;
}
