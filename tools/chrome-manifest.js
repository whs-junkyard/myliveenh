import glob from 'glob-promise';
import path from 'path';

let generate = async function(){
	let mainManifest = require('../package.json');
	let subpackages = await glob(path.resolve('src/*/package.json'));

	let manifest = {
		'manifest_version': 2,
		'name': 'MyLive Enhancements 2',
		'version': mainManifest.version,
		'description': mainManifest.description,
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
			'scripts': ['background.js'],
			'persistent': false,
		},
		'permissions': [
			'http://mylive.in.th/*',
			'http://stream.mylive.in.th/*',
			'storage',
		],
		'web_accessible_resources': [
			// 'settings/settings.html',
			// 'page_script/resume_angular.js'
		],
	};

	for(let manifestPath of subpackages){
		let subpackage = require(manifestPath);
		let srcRoot = path.relative(path.join(__dirname, '..'), path.dirname(manifestPath));
		
		if(subpackage.permissions){
			manifest.permissions = manifest.permissions.concat(subpackage.permissions);
		}
	}

	return manifest;
};

export default generate;