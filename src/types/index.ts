export interface RegistryEntry {
  displayName: string;
  description: string;
  provider: string;
  version: string;
  keywords: string[];
}

export interface Command {
  name: string;
  version: string;
  provider: string;
  description: string;
  keywords: string[];
  path: string;
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

export interface Installer {
  install(pkg: CommandPackage, provider: CommandProvider): Promise<void>;
}

export interface RegistryClient {
  fetchRegistry(): Promise<RegistryIndex>;
  getCommand(name: string): Promise<Command>;
  listCommands(): Promise<RegistryEntry[]>;
  downloadCommand(name: string): Promise<CommandPackage>;
  downloadAsset(name: string, assetPath: string): Promise<string>;
}
