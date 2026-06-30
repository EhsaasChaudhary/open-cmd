# cmdforge

Package manager for AI assistant commands and skills.

## Installation

```bash
npm install -g cmdforge
```

Or run directly:

```bash
npx cmdforge
```

## Usage

Run via npx:

```bash
npx cmdforge add <commands...>
npx cmdforge list
```

Or after global install:

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

By default, `cmdforge` fetches commands from the official registry at `EhsaasChaudhary/open-cmd-registry`.

Override the registry URL for development, testing, or private registries:

```bash
export OPEN_CMD_REGISTRY=https://raw.githubusercontent.com/your-org/your-registry/main
```

The URL should point to the root of a registry repository on `raw.githubusercontent.com`.

## License

MIT
