import { describe, it, expect, vi } from 'vitest';
import { normalizeCommand } from '../src/commands/normalize.js';
import { ExitCode } from '../src/utils/exit.js';

describe('normalizeCommand', () => {
  it('normalizes Nigerian address string and outputs compact string', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await normalizeCommand('plot 10 admiralty way, lekki phase 1, lagos', {
      compact: true
    });

    expect(code).toBe(ExitCode.SUCCESS);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('plot 10 admiralty way, lekki phase 1, lagos')
    );
    logSpy.mockRestore();
  });

  it('normalizes address and outputs JSON structure', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await normalizeCommand('Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102', {
      json: true
    });

    expect(code).toBe(ExitCode.SUCCESS);
    expect(logSpy).toHaveBeenCalled();
    const output = JSON.parse(logSpy.mock.calls[0][0]);
    expect(output.administrative.state).toBe('Lagos');
    expect(output.administrative.lga).toBe('Eti Osa');
    logSpy.mockRestore();
  });

  it('returns VALIDATION_ERROR on empty input', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await normalizeCommand('');
    expect(code).toBe(ExitCode.VALIDATION_ERROR);
    errorSpy.mockRestore();
  });
});
