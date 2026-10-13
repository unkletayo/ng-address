import pc from 'picocolors';
import type { NigerianStateData } from '@ng-address/core';

const STATES_TABLE_DIVIDER_LENGTH = 70;
const LGAS_LIST_DIVIDER_LENGTH = 50;

const STATE_CODE_COL_WIDTH = 4;
const STATE_NAME_COL_WIDTH = 20;
const STATE_CAPITAL_COL_WIDTH = 16;
const STATE_ZONE_COL_WIDTH = 14;

const LGA_COLUMNS_PER_ROW = 2;
const LGA_FIRST_COL_WIDTH = 24;

/**
 * Formats a list of Nigerian states into an aligned terminal table.
 */
export function formatStatesTable(states: readonly NigerianStateData[] | NigerianStateData[]): string {
  const header = `${pc.bold('CODE')}  ${pc.bold('STATE NAME'.padEnd(STATE_NAME_COL_WIDTH))}  ${pc.bold('CAPITAL'.padEnd(STATE_CAPITAL_COL_WIDTH))}  ${pc.bold('ZONE'.padEnd(STATE_ZONE_COL_WIDTH))}  ${pc.bold('LGAS')}`;
  const divider = pc.dim('─'.repeat(STATES_TABLE_DIVIDER_LENGTH));

  const rows = states.map((state) => {
    const code = pc.cyan(state.code.padEnd(STATE_CODE_COL_WIDTH));
    const name = state.name.padEnd(STATE_NAME_COL_WIDTH);
    const capital = state.capital.padEnd(STATE_CAPITAL_COL_WIDTH);
    const zone = state.geoZone.padEnd(STATE_ZONE_COL_WIDTH);
    const count = String(state.lgas.length);
    return `${code}  ${name}  ${capital}  ${zone}  ${count}`;
  });

  return [divider, header, divider, ...rows, divider].join('\n');
}

/**
 * Formats LGAs for a given state into clean columnar list.
 */
export function formatLgasList(stateName: string, lgas: string[]): string {
  const header = pc.bold(`LGAs in ${pc.cyan(stateName)} (${lgas.length} total):`);
  const divider = pc.dim('─'.repeat(LGAS_LIST_DIVIDER_LENGTH));

  // 2-column formatting
  const rows: string[] = [];
  for (let i = 0; i < lgas.length; i += LGA_COLUMNS_PER_ROW) {
    const col1 = lgas[i]?.padEnd(LGA_FIRST_COL_WIDTH) ?? '';
    const col2 = lgas[i + 1] ? lgas[i + 1] : '';
    rows.push(`  • ${col1}${col2 ? `• ${col2}` : ''}`);
  }

  return [header, divider, ...rows, divider].join('\n');
}

