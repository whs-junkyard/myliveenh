import $ from 'jquery';
import plugin from 'core/plugin';
import ChatObserver from 'core/chatobserver';
import Settings from 'settings';

class ChatSoundObserver extends ChatObserver{
	constructor(volume = 0.25){
		super();
		this.audio = new Audio(chrome.extension.getURL('data/chat.ogg'));
		this.audio.volume = volume;
		this.lastSound = 0;
	}

	processChatNode(node){
		if(this.lastSound !== 0 && new Date().getTime() - this.lastSound < 500){
			return;
		}

		this.lastSound = new Date().getTime();

		this.audio.play();
	}
}

plugin('chatsound', async function(){
	let settings = await Settings.get();
	console.log(settings);
	new ChatSoundObserver(settings.chatSoundVolume);
});
