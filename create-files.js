import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  if (!existsSync(path.join(__dirname, 'dist'))) {
    mkdirSync(path.join(__dirname, 'dist'));
  }

  writeFileSync(path.join(__dirname, 'dist', 'users.txt'), '');
  writeFileSync(path.join(__dirname, 'dist', 'new-year-settings.json'), '{}');
  console.log('✅ Файл users.txt успешно создан');
  console.log('✅ Файл new-year-settings.json успешно создан');
} catch (error) {
  console.error(error);
}
