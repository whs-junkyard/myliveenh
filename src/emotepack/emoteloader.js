import JSZip from 'jszip';
import Database from './database';

const MANIFEST = 'set.json';

export default class EmoteLoader{
	constructor(file){
		this.file = file;
	}

	load(){
		return new Promise((resolve, reject) => {
			this.reader = new FileReader();
			this.reader.onload = (e) => {
				try{
					resolve(this.loadFromZip(e.target.result));
				}catch(err){
					reject(err);
				}
			};
			this.reader.readAsArrayBuffer(this.file);
		});
	}

	loadFromZip(blob){
		this.zip = new JSZip(blob);
		this.zip = this.findZipRoot();
		this.loadManifest();
		return this.copyFiles();
	}

	findZipRoot(){
		let fileList = this.zip.file(/^[^\/]+$/);
		if(fileList.length > 0){
			return this.zip;
		}

		let rootFolders = this.zip.folder(/[^\/]+\/$/);
		if(rootFolders.length === 0){
			throw new Error('zip has no object');
		}else if(rootFolders.length > 1){
			throw new Error('zip has multiple root object');
		}

		console.log('Found zip root at', rootFolders[0].name);

		return this.zip.folder(rootFolders[0].name);
	}

	loadManifest(){
		let file = this.zip.file(MANIFEST);
		if(!file){
			throw new Error('manifest file not found!');
		}
		this.manifest = JSON.parse(file.asText());
		if(!this.manifest.name){
			throw new Error('set name not defined');
		}
	}

	async copyFiles(){
		let database = await Database();
		let tx = database.transaction(['emotes', 'emotesFile'], 'readwrite')

		let emotePromise = [];
		for(let emote in this.manifest.emotes){
			let fileName = this.manifest.emotes[emote];
			let file = this.zip.file(fileName);
			if(!file){
				console.warn('cannot find emote file ', fileName);
				delete this.manifest.emotes[emote];
				continue;
			}

			let blob = new Blob([file.asArrayBuffer()]);
			let _emote = emote;
			emotePromise.push(new Promise((resolve, reject) => {
				let request = tx.objectStore('emotesFile').add(blob);
				request.onsuccess = (e) => {
					// save the id
					this.manifest.emotes[_emote] = e.target.result;
					resolve(e.target.result);
				};
				request.onerror = reject;
			}));
		}

		await Promise.all(emotePromise);

		await new Promise((resolve, reject) => {
			let request = tx.objectStore('emotes').add(this.manifest);
			request.onsuccess = resolve;
			request.onerror = reject;
		});
		console.log('Loaded emotes', this.manifest);
	}
}

self.onmessage = function (msg){
	new EmoteLoader(msg.data).load().then(() => {
		postMessage(null);
	}, (e) => {
		console.error(e);
		if(e instanceof Error){
			postMessage(e.toString());
		}else{
			postMessage('Cannot load file. Is the same pack already installed?');
		}
	});
}
