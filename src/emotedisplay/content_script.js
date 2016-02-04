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
			let wrapper = $('<span class="enh__emotedisplay" />')
				.attr('data-code', EmoteDisplay.emotes[this.getAttribute('src')]);
			$(this).wrap(wrapper);
		});
	}
}

plugin('emotedisplay', () => {
	new EmoteDisplay();
});
