export { createProgram } from './cli/index.js';

export { commandProviders, OpenCodeCommandProvider } from './providers/index.js';

export type {
  Command,
  CommandPackage,
  CommandProvider,
  InstallResult,
  Installer,
  Registry,
  RegistryClient,
  RegistryEntry,
  RegistryIndex,
} from './types/index.js';

export { createRegistryClient } from './registry/index.js';
export { createInstaller } from './installer/index.js';
export { ensureDirectory, copyFile, fileExists } from './filesystem/index.js';
export { formatCommandList } from './formatters/command-list.js';

export { DEFAULT_REGISTRY } from './config/index.js';
