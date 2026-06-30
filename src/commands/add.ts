import pc from 'picocolors';
import ora from 'ora';
import { createRegistryClient } from '../registry/index.js';
import { createInstaller } from '../installer/index.js';
import { createOpenCodeProvider } from '../providers/index.js';
import type { CommandPackage } from '../types/index.js';
import { CommandNotFoundError, DownloadError } from '../registry/errors.js';

type CommandStatus = 'installed' | 'skipped' | 'failed';

export async function addAction(commandNames: string[], global = false): Promise<void> {
  const provider = createOpenCodeProvider(global);

  if (!(await provider.detect())) {
    if (global) {
      console.error(pc.red('No global OpenCode installation was found.\n'));
      console.error('Checked:');
      console.error(pc.dim('  \u2022 ~/.config/opencode'));
      console.error(pc.dim('  \u2022 ~/.opencode'));
    } else {
      console.error(pc.red('No .opencode directory found in the current project.\n'));
      console.error('This does not appear to be an OpenCode project.\n');
      console.error('Run:\n');
      console.error(pc.cyan('  opencode init\n'));
      console.error('or install globally using:\n');
      console.error(pc.cyan('  ocmd add --global <command>'));
    }
    process.exit(1);
  }

  const registry = createRegistryClient();
  const installer = createInstaller();
  const counts: Record<CommandStatus, number> = { installed: 0, skipped: 0, failed: 0 };

  for (const name of commandNames) {
    const spinner = ora({ text: `Installing ${name}...`, color: 'cyan' }).start();

    try {
      const pkg: CommandPackage = await registry.downloadCommand(name);
      const result = await installer.install(pkg, provider);

      if (result.failed.length > 0) {
        spinner.fail(pc.red(`Failed to install ${name}`));
        counts.failed++;
      } else if (result.skipped.length > 0) {
        spinner.info(pc.yellow(`${name} is already installed. Use --force to overwrite.`));
        counts.skipped++;
      } else {
        spinner.succeed(pc.green(`Installed ${name}`));
        counts.installed++;
      }
    } catch (err) {
      if (err instanceof CommandNotFoundError) {
        spinner.fail(pc.red(`Command "${name}" was not found in the registry.`));
      } else if (err instanceof DownloadError && err.statusCode === 404) {
        spinner.fail(pc.red(`Command "${name}" was not found in the registry.`));
      } else if (err instanceof Error) {
        spinner.fail(pc.red(err.message));
      } else {
        spinner.fail(pc.red(`Failed to install ${name}.`));
      }
      counts.failed++;
    }
  }

  if (commandNames.length > 0) {
    console.log('');
    console.log(`${pc.green(`Installed: ${counts.installed}`)}`);
    console.log(`${pc.yellow(`Skipped: ${counts.skipped}`)}`);
    console.log(`${pc.red(`Failed: ${counts.failed}`)}`);
  }

  process.exit(counts.failed > 0 ? 1 : 0);
}
