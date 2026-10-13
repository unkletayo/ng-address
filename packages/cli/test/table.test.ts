import { describe, it, expect } from 'vitest';
import { formatStatesTable, formatLgasList } from '../src/formatters/table.js';
import { NIGERIAN_STATES } from '@ng-address/core';

describe('Table Formatters', () => {
  it('formats states into a structured table with headers and data', () => {
    const table = formatStatesTable(NIGERIAN_STATES.slice(0, 3));
    expect(table).toContain('CODE');
    expect(table).toContain('STATE NAME');
    expect(table).toContain('CAPITAL');
    expect(table).toContain('ZONE');
    expect(table).toContain('LGAS');
    expect(table).toContain('Abia');
    expect(table).toContain('Adamawa');
    expect(table).toContain('Akwa Ibom');
  });

  it('formats LGAs for a state into columns', () => {
    const lgas = ['Ikeja', 'Eti Osa', 'Lagos Island', 'Surulere'];
    const output = formatLgasList('Lagos', lgas);
    expect(output).toContain('LGAs in Lagos (4 total):');
    expect(output).toContain('Ikeja');
    expect(output).toContain('Eti Osa');
    expect(output).toContain('Surulere');
  });
});
