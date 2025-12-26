import { defineConfig } from "tsup";

export default defineConfig({
  format: 'esm',
  dts: false,
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  bundle: true,
  minify: true,
  noExternal: [/.*/], // Включаем ВСЕ зависимости
  target: 'node20',
  platform: 'node',
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
      global.require = require;
      global.__filename = import.meta.url;
      global.__dirname = new URL('.', import.meta.url).pathname;
    `
  }
});
