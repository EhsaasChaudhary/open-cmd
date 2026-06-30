import fs from 'fs-extra';

export async function ensureDirectory(dir: string): Promise<void> {
  await fs.ensureDir(dir);
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest);
}

export async function writeFile(path: string, content: string): Promise<void> {
  await fs.outputFile(path, content, 'utf-8');
}

export async function fileExists(path: string): Promise<boolean> {
  return fs.pathExists(path);
}
