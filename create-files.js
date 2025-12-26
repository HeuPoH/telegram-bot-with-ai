import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  if (!existsSync(path.join(__dirname, 'dist'))) {
    mkdirSync(path.join(__dirname, 'dist'));
  }

  const envPath = path.join(__dirname, '.env');
  const distEnvPath = path.join(__dirname, 'dist', '.env');
  if (existsSync(envPath)) {
    copyFileSync(envPath, distEnvPath);
    console.log('✅ Файл .env скопирован в dist');
  } else {
    console.log('⚠️  Файл .env не найден, создайте его вручную');
  }
} catch (error) {
  console.error(error);
}
