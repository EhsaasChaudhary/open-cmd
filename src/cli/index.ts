import { Command } from 'commander';
import { addAction } from '../commands/add.js';
import { listAction } from '../commands/list.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('open-cmd')
    .description('Generic package manager for AI assistant commands')
    .version('0.1.0');

  program
    .command('add <commands...>')
    .description('Add one or more commands')
    .action(async (commands: string[]) => {
      await addAction(commands);
    });

  program
    .command('list')
    .description('List all available commands from the registry')
    .action(async () => {
      await listAction();
    });

  return program;
}
