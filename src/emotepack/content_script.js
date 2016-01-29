import $ from 'jquery';
import Settings from 'settings';
import ChatObserver from 'core/chatobserver';
import Database from './database';

class EmotePackReplacer extends ChatObserver{
	pendingSizing = {};

	constructor(emotes){
		super();
		this.emotes = emotes;
		window.addEventListener('message', this.onMessage.bind(this), false)
	}
	processChatNode(node){
		let message = $(node).find('span[ng-bind-html^="log.d"]');
		let messageNode = message.get(0);
		for(let i = 0; i < messageNode.childNodes.length; i++){
			let child = messageNode.childNodes[i];
			if(!(child instanceof Text)){
				continue;
			}
			let emote = this.findFirstEmote(child.data);
			if(!emote){
				continue;
			}

			this.replaceEmote(messageNode, child, emote);
		}
	}

	findFirstEmote(str){
		let keys = Object.keys(this.emotes);
		let firstEmote = keys.map((key) => {
			let index = str.indexOf(` ${key} `);

			if(index === -1 && str.endsWith(` ${key}`)){
				index = str.length - key.length - 1;
			}

			return [key, index];
		})
			.filter(x => x[1] != -1)
			.reduce((a, b) => {
				return a[1] < b[1] ? a : b;
			}, [null, Number.MAX_VALUE]);

		if(firstEmote[0] === null){
			return null;
		}

		// omit the beginning space
		firstEmote[1] += 1;

		return firstEmote;
	}

	replaceEmote(parent, node, emote){
		let emoteNode = node.splitText(emote[1]);
		try{
			emoteNode.splitText(emote[0].length); // after emote
		}catch(e){} // if emote is last of the line the split will fail

		let emoteId = this.emotes[emote[0]];

		let replacement = $('<div class="enh__emotedisplay"><iframe class="enh__emoteiframe" seamless /></div>')
			.attr('data-code', emote[0])
			.find('iframe')
				.attr('src', chrome.runtime.getURL('data/emote.html') + '#' + emoteId)
				.end();

		if(!this.pendingSizing[emoteId]){
			this.pendingSizing[emoteId] = [];
		}
		this.pendingSizing[emoteId].push(replacement.find('iframe'));

		parent.replaceChild(replacement.get(0), emoteNode);
	}

	onMessage(e){
		if(e.origin != `chrome-extension://${chrome.runtime.id}` || e.data.type != 'emoteSizing'){
			return;
		}
		let pending = this.pendingSizing[e.data.id];
		if(!pending || pending.length === 0){
			return;
		}

		for(let node of pending){
			node.css({
				width: e.data.width,
				height: e.data.height,
			});
		}

		delete this.pendingSizing[e.data.id];
	}
}

let loadEmotePack = function(){
	chrome.runtime.sendMessage({emotepack: 'getPacks'}, (list) => {
		for(let item of list){
			new EmotePackReplacer(item.emotes);
		}
	});
}

Settings.get().then(function(settings){
	if(settings.emotepack){
		loadEmotePack();
	}
});
