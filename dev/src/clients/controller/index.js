import '@soundworks/helpers/polyfills.js';

import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import createLayout from './views/layout.js';

const config = window.soundworksConfig;

async function main($container, index) {
  try {
    const client = new Client(config);

    // -------------------------------------------------------------------
    // register plugins
    // -------------------------------------------------------------------
    // client.pluginManager.register(pluginName, pluginFactory, {options}, [dependencies])

    launcher.register(client, {
      initScreensContainer: $container,
      reloadOnVisibilityChange: false,
    });

    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------
    await client.start();

    // create main app layout
    const $layout = createLayout(client, $container);


  } catch(err) {
    console.error(err);
  }
}

launcher.execute(main);
