import $ from 'jquery';
import ChatObserver from 'core/chatobserver';
import injectScript from 'core/injectscript';

class EmoteDisplay extends ChatObserver{
	static emotes = {};

	constructor(){
		super();
		this.stealEmote();
	}

	stealEmote(){
		injectScript(`
window.postMessage({
	type: 'EMOTE_STEALER',
	text: JSON.stringify(emolist)
}, '*');
		`);
		window.addEventListener('message', this.onMessage.bind(this), false);
	}

	onMessage(event){
		if(event.source != window){
			return;
		}

		if(event.data.type && (event.data.type == 'EMOTE_STEALER')){
			let emotes = JSON.parse(event.data.text);
			for(let emote of emotes){
				EmoteDisplay.emotes[`http://s.mylive.in.th/asset/emo/${emote.d}.png`] = emote.t;
			}
		}
	}

	processChatNode(node){
		$('.emo', node).each(function(){
			let wrapper = $('<span class="enh__emotedisplay" />')
				.attr('data-code', EmoteDisplay.emotes[this.getAttribute('src')]);
			$(this).wrap(wrapper);
		});
	}
}

export default new EmoteDisplay();
