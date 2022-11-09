import 'source-map-support/register.js';

import { Server } from '@soundworks/core/server.js';
import pluginPlatform from '@soundworks/plugin-platform/server.js';
// use `ENV=myconfigfile npm run dev` to run with a specific env config file
import config from '../utils/load-config.js';

console.log(`
--------------------------------------------------------
- launching "${config.app.name}" in "${process.env.ENV || 'default'}" environment
- [pid: ${process.pid}]
--------------------------------------------------------
`);

// API documentation: https://collective-soundworks.github.io/soundworks/
const server = new Server(config);
// configure server for usage within soundworks template
server.setDefaultTemplateConfig();

// -------------------------------------------------------------------
// register plugins
// -------------------------------------------------------------------
// server.pluginManager.register('platform', pluginPlatform);

// -------------------------------------------------------------------
// register schemas
// -------------------------------------------------------------------
// server.stateManager.registerSchema('router', schema);

await server.init();
await server.start();

process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});
