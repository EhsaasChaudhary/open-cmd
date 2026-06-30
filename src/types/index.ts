export interface RegistryEntry {
  name: string;
  displayName: string;
  description: string;
  provider: string;
  version: string;
  keywords: string[];
}

export interface Command {
  name: string;
  displayName: string;
  version: string;
  provider: string;
  description: string;
  keywords: string[];
  entry: string;
}

export interface CommandFile {
  path: string;
  content: string;
}

export interface CommandPackage {
  command: Command;
  files: CommandFile[];
}

export interface Registry {
  schemaVersion: number;
  generatedAt: string;
  name: string;
  url: string;
  description?: string;
}

export interface RegistryIndex {
  schemaVersion: number;
  generatedAt: string;
  name: string;
  url: string;
  description?: string;
  commands: Record<string, RegistryEntry>;
}

export interface CommandProvider {
  readonly id: string;
  readonly displayName: string;
  detect(): Promise<boolean>;
  commandDirectory(): string;
}

export interface InstallResult {
  installed: string[];
  skipped: string[];
  failed: string[];
}

export interface Installer {
  install(pkg: CommandPackage, provider: CommandProvider): Promise<InstallResult>;
}

export interface RegistryClient {
  fetchRegistry(): Promise<RegistryIndex>;
  getCommand(name: string): Promise<Command>;
  listCommands(): Promise<RegistryEntry[]>;
  downloadCommand(name: string): Promise<CommandPackage>;
  downloadAsset(name: string, assetPath: string): Promise<string>;
}
