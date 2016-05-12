const sortOrder = [
	'document_start',
	'document_end',
	'document_idle',
];

let getKey = (item) => {
	item.matches.sort();
	return JSON.stringify(item.matches) + sortOrder.indexOf(item.run_at).toString();
};

export default (scripts) => {
	let groups = new Set();

	// pass 1: scan for match group + run_at
	for(let item of scripts){
		groups.add(getKey(item));
	}

	// sort groups
	groups = Array.from(groups).sort();

	// pass 2: group
	let out = [];
	for(let group of groups){
		let js = new Set();
		let css = new Set();
		let specimen;

		for(let item of scripts){
			if(getKey(item) !== group){
				continue;
			}
			if(item.js){
				for(let file of item.js){
					js.add(file);
				}
			}
			if(item.css){
				for(let file of item.css){
					css.add(file);
				}
			}
			specimen = item;
		}

		let result = {
			matches: specimen.matches,
			js: Array.from(js),
			css: Array.from(css),
			run_at: specimen.run_at,
		};

		if(result.js.length === 0){
			delete result.js;
		}
		if(result.css.length === 0){
			delete result.css;
		}

		out.push(result);
	}

	return out;
};
