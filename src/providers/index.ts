import { OpenCodeCommandProvider, createOpenCodeProvider } from './open-code.js';
import type { CommandProvider } from '../types/index.js';

export const commandProviders: CommandProvider[] = [OpenCodeCommandProvider];

export { OpenCodeCommandProvider, createOpenCodeProvider } from './open-code.js';
