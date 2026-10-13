import { createCli } from './cli.js';
import { exitSystemError } from './utils/exit.js';

const cli = createCli();

try {
  cli.parse(process.argv, { run: true });
} catch (error: unknown) {
  exitSystemError(error);
}
