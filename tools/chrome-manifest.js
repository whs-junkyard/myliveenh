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
		'content_scripts': [],
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
		let srcRoot = path.relative(path.join(__dirname, '..', 'src'), path.dirname(manifestPath));

		if(subpackage.permissions){
			manifest.permissions = manifest.permissions.concat(subpackage.permissions);
		}
		if(subpackage.content_scripts){
			let contentScript = subpackage.content_scripts.map((item) => {
				item = Object.assign({}, item); // copy

				if(item.js){
					item.js = item.js.map((js) => {
						return path.join(srcRoot, js);
					});
					item.js.unshift('commons.js');
				}
				if(item.css){
					item.css = item.css.map((css) => {
						return path.join(srcRoot, css);
					});
				}
				if(item.stop_angular){
					manifest.content_scripts = manifest.content_scripts.concat({
						matches: item.matches,
						js: ['stop_angular.js'],
						run_at: 'document_start',
					});

					delete item.stop_angular;
				}
				return item;
			});
			manifest.content_scripts = manifest.content_scripts.concat(contentScript);
		}
	}

	return manifest;
};

export default generate;
