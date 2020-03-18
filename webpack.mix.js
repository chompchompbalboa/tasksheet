let mix = require('laravel-mix')

mix.disableNotifications()

mix.options({
	hmrOptions: {
		host: 'tasksheet.dev',
		port: '8080'
	}
})

mix.webpackConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'resources/js'),
			'@desktop': path.resolve(__dirname, 'resources/js/bundles/Desktop'),
			'@mobile': path.resolve(__dirname, 'resources/js/bundles/Mobile'),
      // Uncomment to enable React profiling in production build: 'react-dom$': 'react-dom/profiling',
      // Uncomment to enable React profiling in production build: 'scheduler/tracing': 'scheduler/tracing-profiling',
		},
	},
})

mix.ts('resources/js/bundles/App.tsx', 'public/js/app.js').sourceMaps()