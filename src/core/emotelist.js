import injectScript from 'core/injectscript';

export let EMOTE_BASE = `http://s.mylive.in.th/asset/emo/{}.png`;

export default () => {
	if(window.__enh_emotelist_promise){
		return window.__enh_emotelist_promise;
	}

	return window.__enh_emotelist_promise = new Promise((resolve, reject) => {
		injectScript(`
window.postMessage({
	type: 'EMOTE_STEALER',
	text: JSON.stringify(emolist)
}, '*');
		`);

		let event = (e) => {
			if(e.source != window){
				return;
			}

			if(e.data.type && e.data.type == 'EMOTE_STEALER'){
				resolve(JSON.parse(e.data.text));
				window.removeEventListener('message', event, false);
			}
		};
		window.addEventListener('message', event, false);
	});
};
