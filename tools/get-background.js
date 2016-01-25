import glob from 'glob-promise';
import path from 'path';

let generate = async function(){
	let subpackages = await glob(path.resolve('src/*/package.json'));
	let background = [];

	for(let manifestPath of subpackages){
		let subpackage = require(manifestPath);
		let srcRoot = path.relative(path.join(__dirname, '..'), path.dirname(manifestPath));

		if(subpackage.background){
			background = background.concat(
				subpackage.background.map(item => {
					return path.join(srcRoot, item);
				})
			);
		}
	}

	return background;
};

export default generate;