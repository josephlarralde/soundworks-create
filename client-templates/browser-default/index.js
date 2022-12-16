import '@soundworks/helpers/polyfills.js';

import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';
// import pluginPlatform from '@soundworks/plugin-platform/client.js';
import { html } from 'lit/html.js';

import createLayout from './views/layout.js';
import LogA from '../contexts/LogA.js';


// Grab the configuration object written by the server in the `index.html`
const config = window.soundworksConfig;

// If multiple clients are emulated you might to want to share the same context
// const audioContext = new AudioContext();

async function bootstrap($container) {
  try {
    // API documentation: https://soundworks.dev/soundworks/
    const client = new Client(config);

    // -------------------------------------------------------------------
    // register plugins
    // -------------------------------------------------------------------
    // client.pluginManager.register('platform', pluginPlatform, { audioContext });

    // The launcher will do a bunch of stuff for you:
    //
    // Display default initialization screens. If you want to change the provided
    // initialization screens, you can import all the helpers directly in your
    // application by doing `npx soundworks --eject-helpers`. You can also
    // customise some global syles variables (bg-color, etc.) in `../app.scss`.
    // You can also change the default language of the intialization screen by
    // setting, the `launcher.language` property, e.g.:
    // `launcher.language = 'fr'`
    //
    // By default the launcher automatically reloads the client when the socket
    // close or when the page is hidden. Such behavior can be quite important in
    // performance situation where you don't want some phone getting stuck making
    // noise without having any way left to stop it... Also be aware that a page
    // in a background tab will have all its timers (setTimeout, etc.) put in very
    // low priority, messing any scheduled events.
    launcher.register(client, { initScreensContainer: $container });

    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------
    await client.start();

    // create main app layout
    const $layout = createLayout(client, $container);
    $layout.addComponent(html`
      <h1 style="margin: 20px 0">${client.type} [id: ${client.id}]</h1>
      <h2>client successfully started...</h2>
    `);

  } catch(err) {
    console.error(err);
  }
}

// The launcher enables instanciation of multiple clients in the same page to
// facilitate development and testing.
// e.g. `http://127.0.0.1:8000?emulate=10` to run 10 clients side-by-side
launcher.execute(bootstrap, {
  numClients: parseInt(new URLSearchParams(window.location.search).get('emulate')) || 1,
});
