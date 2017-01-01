import injectScript from 'core/injectscript';

export let EMOTE_BASE = 'http://s.mylive.in.th/asset/emo/{}.png';

export default () => {
	if(window.__enh_emotelist_promise){
		return window.__enh_emotelist_promise;
	}

	return window.__enh_emotelist_promise = new Promise((resolve, reject) => {
		let key = 'enh_core_emotelist_' + Math.random().toString();
		injectScript(`
(function(){
	let annotated = (type) => {
		return (item) => {
			item.type = type;
			return item;
		};
	};
	window.postMessage({
		${JSON.stringify(key)}: icons.map(annotated('emo'))
			.concat(emotes.map(annotated('emote')))
	}, '*');
})();
		`);

		let event = (e) => {
			if(e.source !== window){
				return;
			}

			if(e.data[key]){
				console.log(e.data[key]);
				resolve(e.data[key]);
				window.removeEventListener('message', event, false);
			}
		};
		window.addEventListener('message', event, false);
	});
};
