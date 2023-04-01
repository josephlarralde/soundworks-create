import { VueLoaderPlugin } from 'vue-loader';

// You can extend / override the default webpack config provided by @soundworks/build
// to match you own needs using this function.
// Be aware that the changes made here will only apply to client-side browsers bundles,
// not on server-side or node clients files which are only processed through babel.
// If you want to extends the babel configuration for these files, see babel.config.js

export default (config) => {
  // Vue-specific additions ////////////////////////////////////////////////////

  config.module.rules.push({
    test: /\.vue$/,
    use: 'vue-loader',
  });

  // this will apply to both plain `.css` files
  // AND `<style>` blocks in `.vue` files
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'vue-style-loader',
      'css-loader',
    ]
  });

  if (!Array.isArray(config.plugins)) {
    config.plugins = [ new VueLoaderPlugin() ];
  } else {
    config.plugins.push(new VueLoaderPlugin());
  }

  return config;
};
