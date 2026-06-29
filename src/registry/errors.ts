export class RegistryFetchError extends Error {
  constructor(url: string, statusCode: number) {
    super(`Failed to fetch registry from ${url} (status ${statusCode})`);
    this.name = 'RegistryFetchError';
  }
}

export class RegistryParseError extends Error {
  constructor(url: string, detail: string) {
    super(`Failed to parse registry from ${url}: ${detail}`);
    this.name = 'RegistryParseError';
  }
}

export class CommandNotFoundError extends Error {
  constructor(name: string) {
    super(`Command "${name}" not found in registry`);
    this.name = 'CommandNotFoundError';
  }
}

export class DownloadError extends Error {
  readonly statusCode: number;

  constructor(url: string, statusCode: number) {
    super(`Failed to download from ${url} (status ${statusCode})`);
    this.name = 'DownloadError';
    this.statusCode = statusCode;
  }
}
