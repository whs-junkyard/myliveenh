let generate = () => {
	let pkgManifest = require('../package.json');

	let manifest = {
		'manifest_version': 2,
		'name': 'MyLive Enhancements 2',
		'version': pkgManifest.version,
		'description': pkgManifest.description,
		'icons': {
			'128': 'data/icon.png',
		},
		// 'content_scripts': [
		// 	{
		// 		'matches': ['http://mylive.in.th/', 'http://www.mylive.in.th/'],
		// 		'js': ['content_scripts/pause_angular.js'],
		// 		'run_at': 'document_start'
		// 	},
		// 	{
		// 		'matches': ['http://mylive.in.th/', 'http://www.mylive.in.th/'],
		// 		'js': ['bower_components/jquery/dist/jquery.min.js', 'content_scripts/index.js'],
		// 		'css': ['content_scripts/index.css'],
		// 		'run_at': 'document_end'
		// 	},
		// 	{
		// 		'matches': ['http://mylive.in.th/', 'http://www.mylive.in.th/'],
		// 		'js': ['content_scripts/resume_angular.js'],
		// 		'run_at': 'document_end'
		// 	}
		// ],
		'background': {
			'scripts': [
				'background.js'
			],
			'persistent': false,
		},
		'permissions': [
			'http://mylive.in.th/*',
			'http://stream.mylive.in.th/*',
			'storage',
			'alarms',
			'notifications',
		],
		'web_accessible_resources': [
			// 'settings/settings.html',
			// 'page_script/resume_angular.js'
		],
	};

	return manifest;
};

export default generate;