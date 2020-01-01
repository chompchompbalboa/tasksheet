let mix = require('laravel-mix')

mix.disableNotifications()

mix.webpackConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'resources/js'),
			'@desktop': path.resolve(__dirname, 'resources/js/bundles/Desktop'),
      // Uncomment to enable React profiling in production build: 'react-dom$': 'react-dom/profiling',
      // Uncomment to enable React profiling in production build: 'scheduler/tracing': 'scheduler/tracing-profiling',
		},
	},
})

mix.ts('resources/js/bundles/App.tsx', 'public/js/app.js').sourceMaps()