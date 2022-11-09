#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import chalk from 'chalk';
import prompts from 'prompts';
import mkdirp from 'mkdirp';
import readdir from 'recursive-readdir';
import JSON5 from 'json5';

import { toValidName, ignoreFiles, onCancel } from './lib/utils.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));

console.log(`\
${chalk.gray(`[@soundworks/create#v${version}]`)}

${chalk.yellow('> welcome to soundworks')}

- documentation: ${chalk.cyan('https://soundworks.dev')}
- issues: ${chalk.cyan('https://github.com/collective-soundworks/soundworks/issues')}
`);

let targetDir = process.argv[2] || '.';

if (targetDir === '.') {
  const result = await prompts([
    {
      type: 'text',
      name: 'dir',
      message: 'Where should we create your project?\n  (leave blank to use current directory)',
    },
  ]);

  if (result.dir) {
    targetDir = result.dir;
  }
}

const targetWorkingDir = path.normalize(path.join(process.cwd(), targetDir));

if (fs.existsSync(targetWorkingDir) && fs.readdirSync(targetWorkingDir).length > 0) {
  console.log(chalk.red(`> "${targetDir}" directory exists and is not empty, aborting...`));
  process.exit(1);
}

const templatesDir = path.join(__dirname, 'app-templates');
const templatesMetas = JSON.parse(fs.readFileSync(path.join(templatesDir, 'metas.json')));

const options = await prompts([
  {
    type: 'select',
    name: 'template',
    message: 'Choose a soundworks app template?',
    choices: Object.entries(templatesMetas).map(([dir, infos]) => {
      return {
        title: infos.description,
        value: dir,
      };
    }),
  },
], { onCancel });

options.name = path.basename(targetWorkingDir);
options.language = 'js';
options.linting = true;

const templateDir = path.join(templatesDir, options.template);
const files = await readdir(templateDir, ignoreFiles);

await mkdirp(targetWorkingDir);

console.log('');
console.log(`> creating ${options.template} template in:`, targetWorkingDir);

for (let src of files) {
  const file = path.relative(templateDir, src);
  const dest = path.join(targetWorkingDir, file);

  await mkdirp(path.dirname(dest));

  if (file === 'package.json') {
    const pkg = JSON.parse(fs.readFileSync(src));
    pkg.name = toValidName(options.name);
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2));
  } else if (file == 'config/application.json') {
    const obj = JSON5.parse(fs.readFileSync(src));
    obj.name = options.name;
    fs.writeFileSync(dest, JSON5.stringify(obj, null, 2));
  } else {
    fs.copyFileSync(src, dest);
  }
}

// write options in .soundworksrc file
fs.writeFileSync(path.join(targetWorkingDir, '.soundworksrc'), JSON.stringify(options, null, 2));

console.log(`> installing dependencies`);

const execOptions = {
  cwd: targetWorkingDir,
  stdio: 'inherit',
};

execSync(`npm install`, execOptions);
// launch init wizard
execSync(`npx soundworks --init`, execOptions);


// await create(cwd, options);
// console.log(bold(green('\nYour project is ready!')));

// if (options.typescript) {
//   console.log(bold('✔ Typescript'));
// }

// // if (options.eslint) {
// //   console.log(bold('✔ ESLint'));
// // }

// // if (options.prettier) {
// //   console.log(bold('✔ Prettier'));
// // }

// if (options.linting) {
//   console.log(bold('✔ ESLint'));
//   console.log(bold('✔ Prettier'));
// }

// console.log('\nNext steps:');
// let i = 1;

// const relative = path.relative(process.cwd(), cwd);
// if (relative !== '') {
//   console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`);
// }

// console.log(`  ${i++}: ${bold(cyan('npm install'))} (or pnpm install, etc)`);
// // prettier-ignore
// console.log(`  ${i++}: ${bold(cyan('git init && git add -A && git commit -m "Initial commit"'))} (optional)`);
// console.log(`  ${i++}: ${bold(cyan('npm run dev -- --open'))}`);

// console.log(`\nTo close the dev server, hit ${bold(cyan('Ctrl-C'))}`);
// // console.log(`\nStuck? Visit us at ${cyan('https://svelte.dev/chat')}\n`);

console.log('');
