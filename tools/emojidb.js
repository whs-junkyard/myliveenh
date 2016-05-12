import database from 'emojione/emoji.json';

export default () => {
	let out = {};

	for(let key in database){
		let item = database[key];
		if(!item.category || item.category === 'modifier'){
			continue;
		}
		if(!out[item.category]){
			out[item.category] = [];
		}

		let code = item.unicode.split('-')
			.map((item) => String.fromCodePoint(parseInt(item, 16)))
			.join('');

		out[item.category].push({
			name: item.shortname,
			code: code,
		});
	}

	return out;
};
