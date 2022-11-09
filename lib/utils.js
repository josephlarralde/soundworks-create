import fs from 'node:fs';
import path from 'node:path';

import mkdirp from 'mkdirp';
import readdir from 'recursive-readdir';

export const ignoreFiles = ['.DS_Store', 'Thumbs.db'];

// to valid npm package name
export function toValidName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9~.-]+/g, '-');
}

export async function copyDir(srcDir, distDir) {
  const files = await readdir(srcDir, ignoreFiles);

  await mkdirp(distDir);

  for (let src of files) {
    const file = path.relative(srcDir, src);
    const dest = path.join(distDir, file);

    await mkdirp(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}
