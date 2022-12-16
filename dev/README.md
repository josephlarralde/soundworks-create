# `[app-name]`

## Links

- [General Documentation / Tutorials](https://soundworks.dev/)
- [API](https://soundworks.dev/api)
- [Examples](https://github.com/collective-soundworks/soundworks-examples)
- [Issue Tracker](https://github.com/collective-soundworks/soundworks/issues)
- [Working with Max/MSP](https://github.com/collective-soundworks/soundworks-max)

## Soundworks wizard

The soundworks wizard is a interactive command line tool that gives you access to a bunch of high-level functionnalities, such as:
- configure and create new clients
- installing/uninstalling plugins and related libraries
- create environment config files
- find some documentation
- etc.

```sh
npx soundworks
```

## Available npm scripts

#### `npm run dev`

Launch the application in development mode. Watch file system, transpile and bundle files on change (i.e. when a source file is saved), and restart the server when needed.

#### `npm run build`

Build the application: transpile and bundle the source code without launching the server.

#### `npm run build:prod`

Build the application for production. Same as `npm run build` but additionally creates minified files for browser clients.

#### `npm run start`

Launch the server without rebuilding the application.

#### `npm run watch:process [name]` _(node clients only)_

Launch the `[name]` client and restart when the sources are updated. Usefull when developping node clients.

## Environment variables

#### `ENV`

Define which environment config file should be used to run the application. Environment config files are located in the `/config/env` directory. 

For example, given the following config files:

```
├─ config
│  ├─ env
│  │  ├─ default.js
│  │  └─ prod.js   
```

To start the server the `/config/env/prod.js` configuration file, you should run:

```sh
ENV=prod npm run start
``` 

By default, the `/config/env/default.json` configuration file is used.

#### `PORT`

Override the port defined in the config file. 

For example, to launch the server on port `3000` whatever the port value defined in the default config file, you should run:

```sh
PORT=3000 npm run start
```

#### `EMULATE` _(node clients only)_

Run several node client instances in parallel in the same terminal window. 

For example, to launch 4 instances of the client `thing` in parallel (each client instance being run inside its own `fork`), you should run:

```sh
EMULATE=4 npm run watch:process thing
```

## Credits

[soundworks](https://soundworks.dev) is a framework developped by the ISMM team at Ircam

## License

BSD-3-Clause
