import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';
// import pluginPlatform from '@soundworks/plugin-platform/client.js';

import { loadConfig } from '../../utils/load-config.js';

import createLayout from './views/layout.js';
import LogA from '../contexts/LogA.js';

// Load configuration from config files
const config = loadConfig(import.meta.url);

// If multiple clients are emulated you want to share the same context
// const audioContext = new AudioContext();

async function bootstrap() {
  try {
    // API documentation: https://collective-soundworks.github.io/soundworks/
    const client = new Client(config);

    // -------------------------------------------------------------------
    // register plugins
    // -------------------------------------------------------------------
    // client.pluginManager.register('platform', pluginPlatform, { audioContext });

    // @todo - review
    // Show default initialization screens. If you want to change the provided
    // initialization screens, you can import all the helpers directly in your
    // application by doing `npx soundworks --eject-helpers`. You can also
    // customise some global syles variables (bg-color, etc.) in `../app.scss`
    //
    // Automatically reload the client when the socket close or when the page
    // is hidden. These can be quite important in concert situation where you
    // don't want some phone getting stuck making noise without having any way
    // left to control it... Also be aware that a page in background will have
    // all its timers (setTimeout, etc.) put in very low priority, messing any
    // scheduled events.
    launcher.register(client);

    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------
    await client.start();
    // create main app layout
    const $layout = createLayout(client);
    $layout.addComponent(`${client.type} (id: ${client.id}) successfully started`);

    $layout.addComponent({
      render() {
        return { id: client.id, rand: Math.random() };
      }
    });

    // setInterval(() => $layout.requestUpdate(), 1000);

    // setTimeout(() => {
    //   Promise.reject('rejected promise');
    // }, 2000);
  } catch(err) {
    console.error(err);
  }
}

// The launcher allows to run multiple clients at once in the same node process
// by defining the `EMULATE` env process variable
// e.g. `EMULATE=10 npm run watch-process thing` to run 10 clients side-by-side
launcher.execute(bootstrap, {
  numClients: process.env.EMULATE ? parseInt(process.env.EMULATE) : 1,
  moduleURL: import.meta.url,
});
