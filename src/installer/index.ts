import type { Installer } from '../types/index.js';

export const createInstaller = (): Installer => ({
  async install() {
    throw new Error('Not implemented');
  },
});
