import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// Copy locale files from src/locales to public/locales
const srcLocalesDir = join(process.cwd(), 'src', 'locales');
const publicLocalesDir = join(process.cwd(), 'public', 'locales');

// Create public/locales directory if it doesn't exist
mkdirSync(publicLocalesDir, { recursive: true });

// Copy all JSON files
const files = readdirSync(srcLocalesDir).filter(file => file.endsWith('.json'));
files.forEach(file => {
  const srcPath = join(srcLocalesDir, file);
  const destPath = join(publicLocalesDir, file);
  copyFileSync(srcPath, destPath);
  console.log(`Copied ${file} to public/locales/`);
});

console.log(`✅ Copied ${files.length} locale files to public/locales/`);
