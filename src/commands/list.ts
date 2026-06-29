import pc from 'picocolors';
import ora from 'ora';
import { createRegistryClient } from '../registry/index.js';
import { formatCommandList } from '../formatters/command-list.js';
import { RegistryFetchError, RegistryParseError } from '../registry/errors.js';

export async function listAction(): Promise<void> {
  const spinner = ora({ text: 'Fetching registry...', color: 'cyan' }).start();

  try {
    const client = createRegistryClient();
    const entries = await client.listCommands();

    spinner.succeed(pc.green('Registry loaded'));

    const output = formatCommandList(entries);
    console.log(`\n${output}\n`);

    process.exit(0);
  } catch (err) {
    spinner.fail(pc.red('Failed to load registry'));

    if (err instanceof RegistryFetchError) {
      console.error(pc.red('Could not reach the registry. Check your internet connection.'));
    } else if (err instanceof RegistryParseError) {
      console.error(pc.red('The registry data is invalid.'));
    } else if (err instanceof Error) {
      console.error(pc.red(err.message));
    } else {
      console.error(pc.red('An unexpected error occurred.'));
    }

    process.exit(1);
  }
}
