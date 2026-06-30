# ocmd

Package manager for AI assistant commands and skills.

## Installation

```bash
npm install -g ocmd
```

Or run directly:

```bash
npx ocmd
```

## Usage

```bash
ocmd add <commands...>
ocmd list
```

## Development

```bash
npm install
npm run dev
```

## Configuration

### Registry URL

By default, `ocmd` fetches commands from the official registry at `EhsaasChaudhary/open-cmd-registry`.

Override the registry URL for development, testing, or private registries:

```bash
export OPEN_CMD_REGISTRY=https://raw.githubusercontent.com/your-org/your-registry/main
```

The URL should point to the root of a registry repository on `raw.githubusercontent.com`.

## License

MIT
