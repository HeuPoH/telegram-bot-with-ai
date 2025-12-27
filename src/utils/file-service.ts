import { randomBytes } from 'node:crypto';
import { writeFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

export async function atomicWriteFile(file: string, content: string) {
  const dirName = path.dirname(file);
  const fileExt = path.extname(file);
  const fileName = path.basename(file, fileExt);

  const date = Date.now();
  const random = randomBytes(4).join('');
  const tempFileName = `${random}-${date}-${fileName}${fileExt}`;
  const tempFile = path.join(dirName, tempFileName);

  try {
    await writeFile(tempFile, content, 'utf8');
    await rename(tempFile, file);
  } catch (error) {
    try {
      await unlink(tempFile);
    } catch {
    }
    console.log(`AtomicWriteFile throw the error: ${error}`);
  }
}
