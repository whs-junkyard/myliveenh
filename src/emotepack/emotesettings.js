import $ from 'jquery';
import database from './database';
import EmoteLoader from 'worker!./emoteloader';

export default class EmoteSettings{
	constructor(target){
		this.target = $(target);
		this.renderEmotes();
	}

	renderEmotes(){
		let self = this;
		let emote = $(`
<div class="emotepick">
	<button class="topcoat-button--large">Load emotes pack</button>
	<input type="file" accept="application/zip" />
</div>
`)
			.on('change', (e) => {
				if(e.target.files.length === 0){
					return;
				}

				emote.find('button').prop('disabled', true);

				let file = e.target.files[0];
				if(!this.emoteWorker){
					this.emoteWorker = new EmoteLoader();
					this.emoteWorker.onmessage = async function(msg){
						if(msg.data){
							alert(msg.data);
						}
						await self.refreshEmote();
						emote.find('button').prop('disabled', false);
					};
				}
				this.emoteWorker.postMessage(file);
			})
			.appendTo(this.target);

		this.emoteList = $('<div id="emotelist" />')
			.appendTo(this.target);
		this.refreshEmote();
	}

	async refreshEmote(){
		this.emoteList.empty();
		let loading = $('<div class="loading">Loading emotes...</div>')
			.appendTo(this.emoteList);

		let self = this;
		let db = await database();
		let tx = db.transaction(['emotes', 'emotesFile']);

		let request = tx.objectStore('emotes').getAll();
		request.onsuccess = (e) => {
			let list = e.target.result;
			for(let item of list){
				let head = $('<div class="list-head" />')
					.text(item.name)
					.appendTo(this.emoteList);

				let status = $('<span class="list-status">-</span>')
					.prependTo(head);

				$('<button class="topcoat-button">Remove</button>')
					.click(async function(e){
						e.stopPropagation();
						if(!confirm(`Delete ${item.name}?`)){
							return false;
						}
						await self.removeEmotePack(item.name);
						self.refreshEmote();
					})
					.appendTo(head);

				let body = $('<div class="list-body" />');
				head.click((e) => {
					body.toggle();
					if(body.is(':visible')){
						status.text('-');
					}else{
						status.text('+');
					}
				});

				for(let emote in item.emotes){
					let row = $('<div class="emote" />')
						.appendTo(body);

					$('<div class="text" />')
						.text(emote)
						.appendTo(row);

					let request = tx.objectStore('emotesFile')
						.get(item.emotes[emote]);
					request.onsuccess = (e) => {
						let url = window.URL.createObjectURL(e.target.result);
						$('<img />').attr('src', url).prependTo(row);
					};
				}

				body.appendTo(this.emoteList);
			}

			loading.remove();
		};
	}

	async removeEmotePack(name){
		let db = await database();
		return new Promise((resolve, reject) => {
			let tx = db.transaction(['emotes', 'emotesFile'], 'readwrite');
			let store = tx.objectStore('emotes');

			let request = store.get(name);
			request.onsuccess = (e) => {
				let item = e.target.result;
				for(let emote in item.emotes){
					tx.objectStore('emotesFile').delete(item.emotes[emote]);
				}

				let request = store.delete(name);
				request.onsuccess = resolve;
			};
		});
	}
}
