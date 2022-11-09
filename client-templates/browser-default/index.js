// @todo - see if we really need these...
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import 'lit/polyfill-support.js';

import { html, render } from 'lit/html.js';
import { Client } from '@soundworks/core/client.js';
// @todo - rename to @soundworks/helpers
// import { launcher } from '@soundworks/helpers/index.js';
import launcher from '@soundworks/template-helpers/launcher.js';
import pluginPlatform from '@soundworks/plugin-platform/client.js';

// import context
import createLayout from './views/player-layout.js';
import AlphaContext from './AlphaContext.js';
import BetaContext from './BetaContext.js';
import GammaContext from './GammaContext.js';

// Grab the configuration object written by the server in the `index.html`
const config = window.soundworksConfig;
// If multiple clients are emulated you want to share the same context
const audioContext = new AudioContext();

async function bootstrap($container) {
  try {
    // API documentation: https://collective-soundworks.github.io/soundworks/
    const client = new Client(config);

    // @todo - make a test for that
    // await new Promise((resolve) => {
    //   render(html`
    //     <button
    //       @click="${e => {
    //         launcher.language = 'en';
    //         resolve();
    //       }}"
    //     >en</button>
    //     <button
    //       @click="${e => {
    //         launcher.language = 'fr';
    //         resolve();
    //       }}"
    //     >fr</button>
    //   `, $container);
    // });

    // launcher.language = 'fr';
    // Show default initialization screens. If you want to change the provided
    // initialization screens, you can import all the helpers directly in your
    // application by doing `npx soundworks --eject-helpers`. You can also
    // customise some global syles variables (bg-color, etc.) in `../app.scss`
    launcher.render(client, $container);
    // Automatically reload the client when the socket close or when the page
    // is hidden. These can be quite important in concert situation where you
    // don't want some phone getting stuck making noise without having any way
    // left to control it... Also be aware that a page in background will have
    // all its timers (setTimeout, etc.) put in very low priority, messing any
    // scheduled events.
    // reload.activate(client, { visibilityChange: true });

    // -------------------------------------------------------------------
    // register plugins
    // -------------------------------------------------------------------
    // client.pluginManager.register('platform', pluginPlatform, {
    //   features: {
    //     'webaudio': audioContext, // create audio context if no context given?
    //     // 'niap': null,
    //     // @todo - add
    //     // 'devicemotion': @ircam/devicemotion
    //     // microphone: {}, // options to be passed to getUserMedia
    //     // camera: {}, // options to be passed to getUserMedia
    //   }
    // });

    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------
    await client.init();
    // create main app layout
    const $layout = createLayout(client, $container);
    // create some contexts
    const alphaContext = new AlphaContext(client, $layout);
    const betaContext = new BetaContext(client, $layout);
    const gammaContext = new GammaContext(client, $layout);

    // start already registered contexts if any
    await client.start();

    // simple router to switch between context
    const router = await client.stateManager.attach('router');

    // some idiot state machine
    let currentContext = null;

    router.onUpdate(async updates => {
      if ('context' in updates) {
        if (currentContext) {
          await currentContext.exit();
        }

        if (updates.context === 'alpha') {
          currentContext = alphaContext;
        } else if (updates.context === 'beta') {
          currentContext = betaContext;
        } else if (updates.context === 'gamma') {
          currentContext = gammaContext;
        }

        await currentContext.enter();
      }
    }, true);

    // for (let i = 0; true; i++) {
    //   await alphaContext.enter();
    //   await new Promise(resolve => setTimeout(resolve, 5000));

    //   await alphaContext.exit();
    //   await betaContext.enter();
    //   await new Promise(resolve => setTimeout(resolve, 1000));

    //   await gammaContext.enter();
    //   await new Promise(resolve => setTimeout(resolve, 1000));

    //   await Promise.all([betaContext.exit(), gammaContext.exit()]);
    // }
  } catch(err) {
    console.error(err);
  }
}

// The launcher allows to run multiple clients at once in the same brwoser
// window by adding `?emulate=#NumberOfClient` at the end of the url
// e.g. `http://127.0.0.1:8000?emulate=10` to run 10 clients side-by-side
launcher.execute(bootstrap);
