let mix = require('laravel-mix')

mix.disableNotifications()

mix.webpackConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'resources/js'),
			'@app': path.resolve(__dirname, 'resources/js/bundles/App'),
			'@site': path.resolve(__dirname, 'resources/js/bundles/Site'),
      // Uncomment to enable React profiling in production build: 'react-dom$': 'react-dom/profiling',
      // Uncomment to enable React profiling in production build: 'scheduler/tracing': 'scheduler/tracing-profiling',
		},
	},
})

mix.ts('resources/js/bundles/App.tsx', 'public/js/app.js').sourceMaps()
mix.ts('resources/js/bundles/Site.tsx', 'public/js/site.js').sourceMaps()