import fs from 'node:fs';
import path from 'node:path';

import JSON5 from 'json5';

const ENV = process.env.ENV || 'default';

let env = null;
let app = null;

// parse env config
const envConfigFilename = path.join('config', 'env', `${ENV}.json`);

try {
  env = JSON5.parse(fs.readFileSync(envConfigFilename, 'utf-8'));

  if (process.env.PORT) {
    env.port = process.env.PORT;
  }
} catch(err) {
  console.log(`Invalid "${ENV}" env config file: ${envConfigFilename}`);
  process.exit(1);
}

// parse app config
const appConfigFilename = path.join('config', 'application.json');

try {
  app = JSON5.parse(fs.readFileSync(appConfigFilename, 'utf-8'));
} catch(err) {
  console.log(`Invalid app config file: ${appConfigFilename}`);
  process.exit(1);
}

// if callerUrl is given, retrieve the `client.type` from caller directory name
export function loadConfig(callerUrl = null) {
  if (callerUrl !== null) {
    // we can grab the clientType from the caller url dirname
    const dirname = path.dirname(callerUrl);
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
