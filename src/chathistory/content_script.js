import $ from 'jquery';
import plugin from 'core/plugin';
import injectScript from 'core/injectscript';

plugin('chathistory', () => {
	let history = [];
	let historyPtr = 0;
	let key = 'enh_chat_history_' + Math.random().toString();

	injectScript(`
window.addEventListener('message', (e) => {
	if(e.origin != window.location.origin){
		return;
	}
	if(e.data[${JSON.stringify(key)}]){
		$('#mlcmt').trigger('change');
	}
}, false);
	`);

	let updateInput = () => {
		let raw = element.val(history[historyPtr]).get(0);
		let end = raw.value.length;
		raw.setSelectionRange(end, end);

		let data = {};
		data[key] = true;

		window.postMessage(data, window.location.origin);
	};

	// keyup would be too late
	let element = $('#mlcmt').on('keydown', (e) => {
		if(e.which === 13){ // enter
			history.push(element.val());
			historyPtr = history.length;
		}
	}).on('keyup', (e) => {
		switch(e.which){
		case 13: // enter
			break;
		case 38: // up
			historyPtr--;

			if(historyPtr < 0){
				historyPtr = 0;
			}

			updateInput();
			break;
		case 40: // down
			historyPtr++;
			let max = history.length - 1;

			if(historyPtr > max){
				historyPtr = max;
			}

			updateInput();
			break;
		default:
			historyPtr = history.length;
			break;
		}
	});
});
