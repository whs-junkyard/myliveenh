import glob from 'glob-promise';
import path from 'path';

let generate = async function(){
	let subpackages = await glob(path.resolve('src/*/package.json'));
	let scripts = new Set();

	for(let manifestPath of subpackages){
		let subpackage = require(manifestPath);
		let srcRoot = path.relative(path.join(__dirname, '..'), path.dirname(manifestPath));

		if(subpackage.content_scripts){
			for(let item of subpackage.content_scripts){
				if(item.js){
					let js = item.js.map((js) => {
						return path.join(srcRoot, js);
					});
					for(let file of js){
						scripts.add(file);
					}
				}
				if(item.stop_angular){
					scripts.add('src/core/stop_angular.js');
				}
			}
		}
	}

	return scripts;
};

export default generate;