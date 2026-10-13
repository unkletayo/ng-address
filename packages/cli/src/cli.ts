import { cac } from 'cac';
import { lookupCommand } from './commands/lookup.js';
import { validateCommand } from './commands/validate.js';
import { normalizeCommand } from './commands/normalize.js';
import { listStatesCommand } from './commands/states.js';
import { listLgasCommand } from './commands/lgas.js';
import { interactiveWizard } from './commands/wizard.js';
import { ExitCode } from './utils/exit.js';

export function createCli() {
  const cli = cac('ng-address');

  // 1. Root wizard command when no subcommand provided
  cli
    .command('', 'Run interactive address assistant')
    .action(async () => {
      if (process.stdout.isTTY && process.stdin.isTTY) {
        const code = await interactiveWizard();
        process.exit(code);
      } else {
        cli.outputHelp();
        process.exit(ExitCode.SUCCESS);
      }
    });

  // 2. Lookup command
  cli
    .command('lookup <postcode>', 'Resolve a Nigerian digital or traditional postcode')
    .option('--api-key <key>', 'NIPOST API Key (defaults to NIPOST_API_KEY env var)')
    .option('--json', 'Output raw JSON')
    .option('--compact', 'Output compact single-line JSON')
    .action(async (postcode: string, options) => {
      const code = await lookupCommand(postcode, options);
      process.exit(code);
    });

  // 3. Validate command
  cli
    .command('validate [address]', 'Validate an address or postcode format (offline)')
    .option('--json', 'Output validation diagnostics as JSON')
    .option('--compact', 'Output compact JSON')
    .option('--quiet', 'Suppress standard output and rely only on exit code')
    .action(async (address: string | undefined, options) => {
      const code = await validateCommand(address, options);
      process.exit(code);
    });

  // 4. Normalize command
  cli
    .command('normalize [address]', 'Normalize raw address string into canonical structure')
    .option('--json', 'Output structured JSON breakdown')
    .option('--compact', 'Output single normalized string')
    .action(async (address: string | undefined, options) => {
      const code = await normalizeCommand(address, options);
      process.exit(code);
    });

  // 5. List states command
  cli
    .command('list-states', 'List all 36 Nigerian states and FCT')
    .option('--zone <zone>', 'Filter by geopolitical zone (e.g. "South West")')
    .option('--json', 'Output states as JSON')
    .option('--compact', 'Output compact JSON')
    .action(async (options) => {
      const code = await listStatesCommand(options);
      process.exit(code);
    });

  // 6. List LGAs command
  cli
    .command('list-lgas <state>', 'List all official LGAs for a state')
    .option('--json', 'Output LGAs as JSON')
    .option('--compact', 'Output compact JSON')
    .action(async (state: string, options) => {
      const code = await listLgasCommand(state, options);
      process.exit(code);
    });

  cli.help();
  cli.version('0.1.0');

  return cli;
}
