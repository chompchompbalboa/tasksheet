let mix = require('laravel-mix')

mix.disableNotifications()

mix.webpackConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
      '@app': path.resolve(__dirname, 'resources/js/bundles/app'),
      '@site': path.resolve(__dirname, 'resources/js/bundles/site'),
    }
  }
})

mix.react('resources/js/bundles/app.js', 'public/js').sourceMaps()

mix.react('resources/js/bundles/site.js', 'public/js').sourceMaps()