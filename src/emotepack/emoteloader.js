import JSZip from 'jszip';
import database from './database';

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

	async loadFromZip(blob){
		this.zip = await JSZip.loadAsync(blob);
		this.zip = this.findZipRoot();
		await this.loadManifest();
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

	async loadManifest(){
		let file = this.zip.file(MANIFEST);
		if(!file){
			throw new Error('manifest file not found!');
		}
		this.manifest = JSON.parse(await file.async('string'));
		if(!this.manifest.name){
			throw new Error('set name not defined');
		}
	}

	async copyFiles(){
		let db = await database();

		let emotePromise = [];
		for(let emote in this.manifest.emotes){
			let fileName = this.manifest.emotes[emote];
			let file = this.zip.file(fileName);
			if(!file){
				console.warn('cannot find emote file ', fileName);
				delete this.manifest.emotes[emote];
				continue;
			}

			let promise = file.async('arraybuffer').then(((emote, buffer) => {
				let blob = new Blob([buffer]);

				return new Promise((resolve, reject) => {
					let tx = db.transaction(['emotesFile'], 'readwrite');
					let request = tx.objectStore('emotesFile').add(blob);
					request.onsuccess = (e) => {
						// save the id
						this.manifest.emotes[emote] = e.target.result;
						resolve(e.target.result);
					};
					request.onerror = reject;
				});
			}).bind(this, emote));

			emotePromise.push(promise);
		}

		await Promise.all(emotePromise);

		await new Promise((resolve, reject) => {
			let tx = db.transaction(['emotes'], 'readwrite');
			let request = tx.objectStore('emotes').add(this.manifest);
			request.onsuccess = resolve;
			request.onerror = reject;
		});
		console.log('Loaded emotes', this.manifest);
	}
}

self.onmessage = function(msg){
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
};
