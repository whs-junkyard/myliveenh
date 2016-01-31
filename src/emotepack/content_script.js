import $ from 'jquery';
import plugin from 'core/plugin';
import ChatObserver from 'core/chatobserver';
import Database from './database';

class EmotePackReplacer extends ChatObserver{
	constructor(emotes){
		super();
		this.emotes = emotes;
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

		let emoteData = this.emotes[emote[0]];

		let replacement = $('<div class="enh__emotedisplay"><img /></div>')
			.attr('data-code', emote[0]);

		if(typeof emoteData == 'number'){
			getEmoteUrl(emoteData).then((url) => {
				this.emotes[emote[0]] = url;
				replacement.find('img')
					.attr('src', url);
			});
		}else{
			replacement.find('img')
				.attr('src', emoteData);
		}

		parent.replaceChild(replacement.get(0), emoteNode);
	}
}

let getEmoteUrl = (id) => {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({emotepack: 'getEmote', id: id}, (data) => {
			resolve(data);
		});
	});
};

let loadEmotePack = () => {
	chrome.runtime.sendMessage({emotepack: 'getPacks'}, (list) => {
		for(let item of list){
			new EmotePackReplacer(item.emotes);
		}
	});
};

plugin('emotepack', loadEmotePack);
