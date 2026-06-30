import { $fetch } from 'ofetch';
import type { Command, CommandPackage, RegistryClient, RegistryEntry, RegistryIndex } from '../types/index.js';
import { DEFAULT_REGISTRY } from '../config/index.js';
import {
  RegistryFetchError,
  RegistryParseError,
  CommandNotFoundError,
  DownloadError,
} from './errors.js';

export function createRegistryClient(): RegistryClient {
  const baseUrl = DEFAULT_REGISTRY.baseUrl;

  function registryUrl(): string {
    return `${baseUrl}/registry.json`;
  }

  function commandJsonUrl(name: string): string {
    return `${baseUrl}/commands/${name}/command.json`;
  }

  function commandMdUrl(name: string): string {
    return `${baseUrl}/commands/${name}/command.md`;
  }

  async function fetchJson<T>(url: string): Promise<T> {
    try {
      const response = await $fetch.raw(url);
      const raw: unknown = response._data;
      const text = typeof raw === 'string' ? raw : new TextDecoder().decode(raw as ArrayBuffer);
      return JSON.parse(text) as T;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        throw new DownloadError(url, (err as { statusCode: number }).statusCode);
      }
      throw new RegistryFetchError(url, 0);
    }
  }

  async function fetchText(url: string): Promise<string> {
    try {
      return await $fetch(url, { responseType: 'text' });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        throw new DownloadError(url, (err as { statusCode: number }).statusCode);
      }
      throw new RegistryFetchError(url, 0);
    }
  }

  function validateRegistryIndex(data: unknown, url: string): RegistryIndex {
    if (!data || typeof data !== 'object') {
      throw new RegistryParseError(url, 'Expected an object');
    }
    const d = data as Record<string, unknown>;

    if (typeof d.schemaVersion !== 'number') {
      throw new RegistryParseError(url, 'Missing or invalid schemaVersion');
    }
    if (typeof d.generatedAt !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid generatedAt');
    }
    if (!d.commands || typeof d.commands !== 'object') {
      throw new RegistryParseError(url, 'Missing or invalid commands');
    }

    const validatedCommands: Record<string, RegistryEntry> = {};
    for (const [key, value] of Object.entries(d.commands as Record<string, unknown>)) {
      validatedCommands[key] = validateRegistryEntry(value, key, `${url}#commands.${key}`);
    }

    return {
      schemaVersion: d.schemaVersion,
      generatedAt: d.generatedAt,
      name: typeof d.name === 'string' ? d.name : DEFAULT_REGISTRY.name,
      url: typeof d.url === 'string' ? d.url : baseUrl,
      description: typeof d.description === 'string' ? d.description : undefined,
      commands: validatedCommands,
    };
  }

  function validateRegistryEntry(data: unknown, name: string, url: string): RegistryEntry {
    if (!data || typeof data !== 'object') {
      throw new RegistryParseError(url, 'Expected a registry entry object');
    }
    const d = data as Record<string, unknown>;

    if (typeof d.displayName !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid displayName');
    }
    if (typeof d.description !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid description');
    }
    if (typeof d.provider !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid provider');
    }
    if (typeof d.version !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid version');
    }
    if (!Array.isArray(d.keywords)) {
      throw new RegistryParseError(url, 'Missing or invalid keywords');
    }

    return {
      name,
      displayName: d.displayName,
      description: d.description,
      provider: d.provider,
      version: d.version,
      keywords: d.keywords as string[],
    };
  }

  function validateCommand(data: unknown, url: string): Command {
    if (!data || typeof data !== 'object') {
      throw new RegistryParseError(url, 'Expected an object');
    }
    const d = data as Record<string, unknown>;

    if (typeof d.name !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid name');
    }
    if (typeof d.displayName !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid displayName');
    }
    if (typeof d.version !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid version');
    }
    if (typeof d.provider !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid provider');
    }
    if (typeof d.description !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid description');
    }
    if (!Array.isArray(d.keywords)) {
      throw new RegistryParseError(url, 'Missing or invalid keywords');
    }
    if (typeof d.entry !== 'string') {
      throw new RegistryParseError(url, 'Missing or invalid entry');
    }

    return {
      name: d.name,
      displayName: d.displayName,
      version: d.version,
      provider: d.provider,
      description: d.description,
      keywords: d.keywords as string[],
      entry: d.entry,
    };
  }

  return {
    async fetchRegistry(): Promise<RegistryIndex> {
      const url = registryUrl();
      try {
        const data = await fetchJson<unknown>(url);
        return validateRegistryIndex(data, url);
      } catch (err) {
        if (err instanceof DownloadError) {
          throw new RegistryFetchError(url, err.statusCode);
        }
        throw err;
      }
    },

    async listCommands(): Promise<RegistryEntry[]> {
      const index = await this.fetchRegistry();
      return Object.values(index.commands);
    },

    async getCommand(name: string): Promise<Command> {
      const url = commandJsonUrl(name);
      try {
        const data = await fetchJson<unknown>(url);
        return validateCommand(data, url);
      } catch (err) {
        if (err instanceof DownloadError && err.statusCode === 404) {
          throw new CommandNotFoundError(name);
        }
        throw err;
      }
    },

    async downloadCommand(name: string): Promise<CommandPackage> {
      const command = await this.getCommand(name);
      const mdUrl = commandMdUrl(name);
      const markdown = await fetchText(mdUrl);
      return {
        command,
        files: [{ path: 'command.md', content: markdown }],
      };
    },

    async downloadAsset(_name: string, _assetPath: string): Promise<string> {
      throw new Error('Not implemented');
    },
  };
}
