#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import chalk from 'chalk';
import { program } from 'commander';
import prompts from 'prompts';

import { createClient } from './lib/create-client.js';
import { ejectLauncher } from './lib/eject-launcher.js';

const tasks = {
  createClient,
  ejectLauncher,
};

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const appInfos = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.soundworksrc')));

const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
console.log(chalk.gray(`[@soundworks/wizard#v${version}]`));
console.log('');

// allow to trigger specific taks from command line
program
  .option('-c, --create-client', 'create a new soundworks client')
  .option('-c, --eject-launcher', 'eject the launcher and default views from `@soundworks/helpers`')
  .option('-i, --init', 'launched automatically by @soundworks/create, please do not launch manually')
;

program.parse(process.argv);
const options = program.opts();

if (options.init) {
  console.log('');
  console.log(chalk.yellow(`> soundworks init wizard`));
  console.log('');

  // installPlugins();
  // installRelatedLibraries();
  await tasks.createClient(appInfos);

  console.log(`\
${chalk.yellow(`> soundworks init wizard done`)}
  `);

  process.exit(0);

// options from command line
} else if (Object.keys(options).length > 0) {
  delete options.init; // this is not a task
  // execute all tasks one by one
  for (let task in options) {
    await tasks[task](appInfos);
  }

  process.exit(0);

// no options given
} else {

  console.log(`\
${chalk.yellow(`> welcome to the soundworks wizard`)}

- documentation: ${chalk.cyan('https://soundworks.dev')}
- issues: ${chalk.cyan('https://github.com/collective-soundworks/soundworks/issues')}
  `);

  const onCancel = () => process.exit();

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    const { task } = await prompts([
      {
        type: 'select',
        name: 'task',
        message: 'What do you want to do?',
        choices: [
          { title: 'Create a new soundworks client', value: 'createClient' },
          { title: 'Install some soundworks plugins', value: 'installPlugins' },
          { title: 'Install some related libs', value: 'installLibs' },
          { title: 'Create a new env file', value: 'createEnv' },
          { title: 'Find some documentation', value: 'findDoc' },
          // show existing clients, command to launch them, etc.
          { title: 'Get informations on you app', value: 'getInfos' },
          { title: 'Eject the launcher and default init views', value: 'ejectLauncher' },
          { title: 'Exit', value: 'exit' },
        ],
      },
    ], { onCancel });

    if (task === 'exit') {
      process.exit(0);
    }

    await tasks[task](appInfos);
  }
}



// function getDeps() {
//   const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.soundworksrc')));
// }

// function installPlugins() {
//   find already installed plugins
//   const plugins = [
//     '@soundworks/plugin-platform',
//     '@soundworks/plugin-sync',
//     '@soundworks/plugin-position',
//   ];

//   const plugins = await prompt({
//     type: 'multiselect',
//     name: 'color',
//     message: 'Pick colors',
//     choices: [
//       { title: 'Red', value: '#ff0000' },
//       { title: 'Green', value: '#00ff00', disabled: true },
//       { title: 'Blue', value: '#0000ff', selected: true }
//     ],
//   });
// }
