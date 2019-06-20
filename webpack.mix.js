let mix = require('laravel-mix')

mix.disableNotifications()

mix.webpackConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'resources/js'),
			'@app': path.resolve(__dirname, 'resources/js/bundles/App'),
			'@site': path.resolve(__dirname, 'resources/js/bundles/Site'),
		},
	},
})

mix.react('resources/js/bundles/App.js', 'public/js/app.js').sourceMaps()

mix.react('resources/js/bundles/Site.js', 'public/js/site.js').sourceMaps()
