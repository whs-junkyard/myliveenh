import htmlXhr from 'core/htmlxhr';

export default async function(id){
	let html = await htmlXhr('GET', `http://mylive.in.th/streams/${id}`);

	let scriptNode = Array.from(html.documentElement.getElementsByTagName('SCRIPT')).filter((node) => {
		return !node.src &&
			node.textContent.indexOf('jwplayer') !== -1;
	})[0];
	return {
		title: html.title,
		script: scriptNode.textContent,
	};
};
