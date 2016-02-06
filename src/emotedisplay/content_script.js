import $ from 'jquery';
import ChatObserver from 'core/chatobserver';
import injectScript from 'core/injectscript';
import plugin from 'core/plugin';
import emoteList, {EMOTE_BASE} from 'core/emotelist';

class EmoteDisplay extends ChatObserver{
	static emotes = {};

	constructor(){
		super();
		this.loadEmotes();
	}

	async loadEmotes(){
		let emotes = await emoteList();
		for(let emote of emotes){
			EmoteDisplay.emotes[EMOTE_BASE.replace('{}', emote.d)] = emote.t;
		}
	}

	processChatNode(node){
		$('.emo', node).each(function(){
			let code = EmoteDisplay.emotes[this.getAttribute('src')];
			let wrapper = $('<div class="enh__emotedisplay" />')
				.attr('data-code', code);
			$(this).wrap(wrapper);

			$('<span />').text(code)
				.appendTo(this.parentNode);
		});
	}
}

plugin('emotedisplay', () => {
	new EmoteDisplay();
});
