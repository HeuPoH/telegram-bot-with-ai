import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  if (!existsSync(path.join(__dirname, 'dist'))) {
    mkdirSync(path.join(__dirname, 'dist'));
  }

  writeFileSync(path.join(__dirname, 'dist', 'users-storage.json'), '{}');
  writeFileSync(path.join(__dirname, 'dist', 'settings.json'), '{}');
  console.log('✅ Файл users.txt успешно создан');
  console.log('✅ Файл settings.json успешно создан');

  const environmentPath = path.join(__dirname, '.env.production');
  const distributionEnvironmentPath = path.join(__dirname, 'dist', '.env');
  if (existsSync(environmentPath)) {
    copyFileSync(environmentPath, distributionEnvironmentPath);
    console.log('✅ Файл .env.production скопирован в dist');
  } else {
    console.log('⚠️  Файл .env.production не найден, создайте его вручную');
  }
} catch (error) {
  console.error(error);
}
