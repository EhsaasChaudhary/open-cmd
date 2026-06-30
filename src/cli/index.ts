import { Command } from 'commander';
import { addAction } from '../commands/add.js';
import { listAction } from '../commands/list.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('ocmd')
    .description('Generic package manager for AI assistant commands')
    .version('0.1.0');

  program
    .command('add <commands...>')
    .description('Add commands from the registry (-g for global)')
    .option('-g, --global', 'Install globally (system-wide)')
    .action(async (commands: string[], options: { global?: boolean }) => {
      await addAction(commands, options.global ?? false);
    });

  program
    .command('list')
    .description('List all available commands from the registry')
    .action(async () => {
      await listAction();
    });

  return program;
}
