import glob from 'glob-promise';
import path from 'path';
import mergeContentScript from './merge-content-script';

let generate = async function(){
	let mainManifest = require('../package.json');
	let subpackages = await glob(path.resolve('src/*/package.json'));

	let manifest = {
		'manifest_version': 2,
		'name': 'MyLive Enhancements 2',
		'version': mainManifest.version,
		'description': mainManifest.description,
		'minimum_chrome_version': "42",
		'icons': {
			'128': 'data/icon.png',
		},
		'options_page': 'settings/index.html',
		'options_ui': {
			page: 'settings/index.html',
			open_in_tab: true,
		},
		'content_scripts': [],
		'background': {
			'scripts': ['background.js'],
			'persistent': false,
		},
		'permissions': [
			'http://mylive.in.th/*',
			'http://*.mylive.in.th/*',
			'storage',
		],
		web_accessible_resources: [],

		// firefox
		'applications': {
			'gecko': {
				id: 'myliveenh@cupco.de'
			}
		}
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
						js: ['core/stop_angular.js'],
						run_at: 'document_start',
					});

					delete item.stop_angular;
				}
				return item;
			});
			manifest.content_scripts = manifest.content_scripts.concat(contentScript);
		}
	}

	manifest.content_scripts = mergeContentScript(manifest.content_scripts);

	let dataFiles = await glob('data/*');
	manifest.web_accessible_resources = manifest.web_accessible_resources.concat(dataFiles);

	return manifest;
};

export default generate;
