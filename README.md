# open-cmd

Generic package manager for AI assistant commands.

## Installation

```bash
npm install -g open-cmd
```

Or run directly:

```bash
npx open-cmd
```

## Usage

```bash
open-cmd add <commands...>
open-cmd list
```

## Development

```bash
npm install
npm run dev
```

## Configuration

### Registry URL

By default, `open-cmd` fetches commands from the official registry at `EhsaasChaudhary/open-cmd-registry`.

Override the registry URL for development, testing, or private registries:

```bash
export OPEN_CMD_REGISTRY=https://raw.githubusercontent.com/your-org/your-registry/main
```

The URL should point to the root of a registry repository on `raw.githubusercontent.com`.

## License

MIT
