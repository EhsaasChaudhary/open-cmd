import pc from 'picocolors';
import type { RegistryEntry } from '../types/index.js';

const DIVIDER = pc.dim('\u2500'.repeat(34));

export function formatCommandList(entries: RegistryEntry[]): string {
  if (entries.length === 0) {
    return 'No commands available.';
  }

  const sorted = [...entries].sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );

  const lines: string[] = [];

  lines.push(pc.bold('📦 Available Commands'));
  lines.push('');

  for (const entry of sorted) {
    lines.push(pc.cyan(entry.displayName));
    lines.push(entry.description);
    lines.push('');
  }

  lines.push(DIVIDER);
  lines.push(pc.dim(`Total: ${entries.length} command${entries.length === 1 ? '' : 's'}`));

  return lines.join('\n');
}
