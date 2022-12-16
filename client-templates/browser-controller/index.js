import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import createLayout from './views/layout.js';

// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

const config = window.soundworksConfig;

async function main($container) {
  try {
    const client = new Client(config);

    // client.pluginManager.register(pluginName, pluginFactory, {options}, [dependencies])

    launcher.register(client, {
      initScreensContainer: $container,
      reloadOnVisibilityChange: false,
    });

    await client.start();

    /* eslint-disable-next-line no-unused-vars */
    const $layout = createLayout(client, $container);

  } catch(err) {
    console.error(err);
  }
}

launcher.execute(main);
