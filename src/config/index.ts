export const DEFAULT_REGISTRY = {
  id: 'official',
  name: 'Official Registry',
  baseUrl:
    process.env.OPEN_CMD_REGISTRY ??
    'https://raw.githubusercontent.com/EhsaasChaudhary/open-cmd-registry/main',
};
