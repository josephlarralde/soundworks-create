import fs from 'node:fs';
import path from 'node:path';

import JSON5 from 'json5';

/**
 * Load JS config object from json5 config files located in `/config`.
 *
 * @param {String} [ENV='default'] - name of the environment. Should correspond
 *  to a file located in the `/config/env/` directory
 * @param {String} [callerURL=null] - for node clients, if `callerURL` is given,
 *  retrieves the `clientType` from caller directory name.
 *
 * @returns {Object} config
 * @returns {Object} config.app - JS object of the informations contained in
 *  `/config/application.json`.
 * @returns {Object} config.env - JS object of the informations contained in
 *  `/config/env/${ENV}.json` with ENV being the first argument.
 * @returns {Object} config.clientType - node client only: type/role of the client
 *  as defined when the client has been created (see `/config/application.json`
 *  and directory name).
 */
export function loadConfig(ENV = 'default', callerURL = null) {
  let env = null;
  let app = null;

  // parse env config
  const envConfigFilepath = path.join('config', 'env', `${ENV}.json`);

  try {
    env = JSON5.parse(fs.readFileSync(envConfigFilepath, 'utf-8'));

    if (process.env.PORT) {
      env.port = process.env.PORT;
    }
  } catch(err) {
    console.log(`Invalid "${ENV}" env config file: ${envConfigFilepath}`);
    process.exit(1);
  }

  // parse app config
  const appConfigFilepath = path.join('config', 'application.json');

  try {
    app = JSON5.parse(fs.readFileSync(appConfigFilepath, 'utf-8'));
  } catch(err) {
    console.log(`Invalid app config file: ${appConfigFilepath}`);
    process.exit(1);
  }

  if (callerURL !== null) {
    // we can grab the clientType from the caller url dirname
    const dirname = path.dirname(callerURL);
    const parent = path.resolve(dirname, '..');
    const clientType = path.relative(parent, dirname);

    if (clientType !== 'server') {
      return { clientType, env, app };
    } else {
      return { env, app };
    }
  } else {
    return { env, app };
  }
}
