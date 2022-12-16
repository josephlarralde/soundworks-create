import '@soundworks/helpers/polyfills.js';
import { Server } from '@soundworks/core/server.js';
// use `ENV=myconfigfile npm run dev` to run the server with a specific env config file
// you can also override the port defined in the config file by doing `PORT=8001 npm run dev`
import { loadConfig } from '../utils/load-config.js';

// - General documentation: https://soundworks.dev/
// - API documentation: https://soundworks.dev/api
// - Issue Tracker: https://github.com/collective-soundworks/soundworks/issues

const config = loadConfig(import.meta.url);

console.log(`
--------------------------------------------------------
- launching "${config.app.name}" in "${process.env.ENV || 'default'}" environment
- [pid: ${process.pid}]
--------------------------------------------------------
`);


// -------------------------------------------------------------------
// Create the soundworks server and configure for usage within default
// soundworks application file layout
// -------------------------------------------------------------------
const server = new Server(config);
server.setDefaultTemplateConfig();

// -------------------------------------------------------------------
// Register plugins
// -------------------------------------------------------------------
// server.pluginManager.register('platform', pluginPlatform);

// -------------------------------------------------------------------
// Register schemas
// -------------------------------------------------------------------
// server.stateManager.registerSchema('my-schema', definition);

// -------------------------------------------------------------------
// Launch application (init plugins, http server, etc.)
// -------------------------------------------------------------------
await server.start();

// do your own stuff!

// catch uncaught promise rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});
