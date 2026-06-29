import type { CommandProvider } from '../types/index.js';

export const OpenCodeCommandProvider: CommandProvider = {
  id: 'opencode',
  displayName: 'OpenCode',
  async detect(): Promise<boolean> {
    return true;
  },
  commandDirectory(): string {
    return '.opencode/commands';
  },
};
