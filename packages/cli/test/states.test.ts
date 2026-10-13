import { describe, it, expect, vi } from 'vitest';
import { listStatesCommand } from '../src/commands/states.js';
import { listLgasCommand } from '../src/commands/lgas.js';
import { ExitCode } from '../src/utils/exit.js';

describe('listStatesCommand and listLgasCommand', () => {
  it('lists all states as JSON', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await listStatesCommand({ json: true });

    expect(code).toBe(ExitCode.SUCCESS);
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed.length).toBe(37); // 36 States + FCT
    logSpy.mockRestore();
  });

  it('filters states by geopolitical zone', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await listStatesCommand({ zone: 'South West', json: true });

    expect(code).toBe(ExitCode.SUCCESS);
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed.length).toBe(6); // Ekiti, Lagos, Ogun, Ondo, Osun, Oyo
    logSpy.mockRestore();
  });

  it('lists LGAs for a state', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await listLgasCommand('Lagos', { json: true });

    expect(code).toBe(ExitCode.SUCCESS);
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed.state).toBe('Lagos');
    expect(parsed.lgas).toContain('Ikeja');
    expect(parsed.lgas).toContain('Eti Osa');
    logSpy.mockRestore();
  });

  it('returns VALIDATION_ERROR for unknown state', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await listLgasCommand('Atlantis');
    expect(code).toBe(ExitCode.VALIDATION_ERROR);
    errorSpy.mockRestore();
  });
});
