import { NIGERIAN_STATES } from '@ng-address/core';
import { ExitCode } from '../utils/exit.js';
import { formatStatesTable } from '../formatters/table.js';
import { formatJson } from '../formatters/json.js';

export interface StatesOptions {
  zone?: string;
  json?: boolean;
  compact?: boolean;
}

export async function listStatesCommand(options: StatesOptions = {}): Promise<number> {
  let states = NIGERIAN_STATES;

  if (options.zone) {
    const targetZone = options.zone.toLowerCase().replace(/[-_\s]/g, '');
    states = states.filter((s) => {
      const normalizedZone = s.geoZone.toLowerCase().replace(/[-_\s]/g, '');
      return normalizedZone.includes(targetZone);
    });
  }

  if (options.json) {
    console.log(formatJson(states, options.compact));
  } else {
    console.log(formatStatesTable(states));
  }

  return ExitCode.SUCCESS;
}
