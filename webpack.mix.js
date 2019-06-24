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

mix.ts('resources/js/bundles/App.tsx', 'public/js/app.js').sourceMaps()
mix.ts('resources/js/bundles/Site.tsx', 'public/js/site.js').sourceMaps()
