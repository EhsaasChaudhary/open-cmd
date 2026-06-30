import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import type { CommandProvider } from '../types/index.js';

const GLOBAL_DIRS = ['~/.config/opencode', '~/.opencode'];

function expandHome(filePath: string): string {
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return filePath;
}

export function createOpenCodeProvider(global = false): CommandProvider {
  let resolvedGlobalDir: string | null = null;

  return {
    id: 'opencode',
    displayName: 'OpenCode',
    async detect(): Promise<boolean> {
      if (global) {
        for (const dir of GLOBAL_DIRS) {
          const expanded = expandHome(dir);
          if (await fs.pathExists(expanded)) {
            resolvedGlobalDir = expanded;
            return true;
          }
        }
        return false;
      }
      return fs.pathExists(path.join(process.cwd(), '.opencode'));
    },
    commandDirectory(): string {
      if (global) {
        const base = resolvedGlobalDir ?? expandHome(GLOBAL_DIRS[0]);
        return path.join(base, 'commands');
      }
      return path.join(process.cwd(), '.opencode', 'commands');
    },
  };
}

export const OpenCodeCommandProvider: CommandProvider = createOpenCodeProvider(false);
