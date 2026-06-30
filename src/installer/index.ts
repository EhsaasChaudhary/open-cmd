import path from 'node:path';
import type { CommandPackage, CommandProvider, Installer, InstallResult } from '../types/index.js';
import { ensureDirectory, writeFile, fileExists } from '../filesystem/index.js';

export const createInstaller = (): Installer => ({
  async install(pkg: CommandPackage, provider: CommandProvider): Promise<InstallResult> {
    const result: InstallResult = { installed: [], skipped: [], failed: [] };
    const destDir = provider.commandDirectory();

    await ensureDirectory(destDir);

    for (const file of pkg.files) {
      const ext = path.extname(file.path);
      const fileName = `${pkg.command.name}${ext}`;
      const destPath = path.join(destDir, fileName);

      if (await fileExists(destPath)) {
        result.skipped.push(destPath);
        continue;
      }

      try {
        await writeFile(destPath, file.content);
        result.installed.push(destPath);
      } catch {
        result.failed.push(destPath);
      }
    }

    return result;
  },
});
