import { describe, it, expect, vi } from 'vitest';
import { validateCommand } from '../src/commands/validate.js';
import { ExitCode } from '../src/utils/exit.js';

describe('validateCommand', () => {
  it('returns SUCCESS on valid digital postcode', async () => {
    const code = await validateCommand('LA-11-W06-TC-10', { quiet: true });
    expect(code).toBe(ExitCode.SUCCESS);
  });

  it('returns SUCCESS on valid traditional postcode', async () => {
    const code = await validateCommand('100001', { quiet: true });
    expect(code).toBe(ExitCode.SUCCESS);
  });

  it('returns SUCCESS on recognized state name', async () => {
    const code = await validateCommand('Lagos', { quiet: true });
    expect(code).toBe(ExitCode.SUCCESS);
  });

  it('returns SUCCESS on recognized LGA name', async () => {
    const code = await validateCommand('Ikeja', { quiet: true });
    expect(code).toBe(ExitCode.SUCCESS);
  });

  it('returns VALIDATION_ERROR on unrecognized random string', async () => {
    const code = await validateCommand('Atlantis Ocean 99999', { quiet: true });
    expect(code).toBe(ExitCode.VALIDATION_ERROR);
  });

  it('returns VALIDATION_ERROR when input is empty', async () => {
    const code = await validateCommand('', { quiet: true });
    expect(code).toBe(ExitCode.VALIDATION_ERROR);
  });
});
