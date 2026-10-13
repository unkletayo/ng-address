import { describe, it, expect } from 'vitest';
import { createCli } from '../src/cli.js';

describe('createCli', () => {
  it('creates CLI instance with all required commands and options', () => {
    const cli = createCli();
    expect(cli.name).toBe('ng-address');

    const commandNames = cli.commands.map((cmd) => cmd.name);
    expect(commandNames).toContain('');
    expect(commandNames).toContain('lookup');
    expect(commandNames).toContain('validate');
    expect(commandNames).toContain('normalize');
    expect(commandNames).toContain('list-states');
    expect(commandNames).toContain('list-lgas');
  });
});
