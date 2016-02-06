import $ from 'jquery';
import plugin from 'core/plugin';
import ChatObserver from 'core/chatobserver';
import NicoObserver from 'core/nicoobserver';
import Database from './database';
import Settings from 'settings';

class Replacer{
	constructor(emotes){
		this.emotes = emotes;
	}

	processChatNode(node){
		for(let i = 0; i < node.childNodes.length; i++){
			let child = node.childNodes[i];
			if(!(child instanceof Text)){
				continue;
			}
			let emote = this.findFirstEmote(child.data);
			if(!emote){
				continue;
			}

			this.replaceEmote(node, child, emote);
		}
	}

	findFirstEmote(str){
		const BEGINNING = -2;

		let keys = Object.keys(this.emotes);
		let firstEmote = keys.map((key) => {
			let index;
			if(str.startsWith(`${key} `) || str === key){
				// only happen in nicochat
				index = BEGINNING;
			}else{
				index = str.indexOf(` ${key} `);
			}

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
		if(firstEmote[1] == BEGINNING){
			firstEmote[1] = 0;
		}else{
			firstEmote[1] += 1;
		}

		return firstEmote;
	}

	replaceEmote(parent, node, emote){
		let emoteNode = node.splitText(emote[1]);
		try{
			emoteNode.splitText(emote[0].length); // after emote
		}catch(e){} // if emote is last of the line the split will fail

		let emoteData = this.emotes[emote[0]];

		let replacement = $('<div class="enh__emotedisplay"><img /><span></span></div>')
			.attr('data-code', emote[0]);

		replacement.find('span').text(emote[0]);

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

class EmotePackReplacer extends ChatObserver{
	constructor(replacer){
		super();
		this.replacer = replacer;
	}
	processChatNode(node){
		let message = $(node).find('span[ng-bind-html^="log.d"]');
		let messageNode = message.get(0);
		this.replacer.processChatNode(messageNode);
	}
}

class EmotePackNicoReplacer extends NicoObserver{
	constructor(replacer){
		super();
		this.replacer = replacer;
	}
	processChatNode(node){
		this.replacer.processChatNode(node);
	}
}

let getEmoteUrl = (id) => {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({emotepack: 'getEmote', id: id}, (data) => {
			resolve(data);
		});
	});
};

let getPacks = () => {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({emotepack: 'getPacks'}, (list) => {
			resolve(list);
		});
	});
};

let loadEmotePack = async function(){
	let list = await getPacks();
	let settings = await Settings.get();

	for(let item of list){
		let replacer = new Replacer(item.emotes);
		new EmotePackReplacer(replacer);
		if(settings.emotepackNico){
			new EmotePackNicoReplacer(replacer);
		}
	}
};

plugin('emotepack', loadEmotePack);
