import pc from 'picocolors';

export async function addAction(commands: string[]): Promise<void> {
  console.log(pc.cyan(`add called with: ${commands.join(', ')}`));
}
