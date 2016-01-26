/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

const loader = require.context('./', true, /package\.json$/);

class Settings{
	_settings = {};
	_isReady = false;
	_pendingPromises = [];

	constructor(){
		this.loadModuleDefault();

		chrome.storage.sync.get('settings', (data) => {
			if(data.settings){
				Object.assign(this._settings, JSON.parse(data.settings));
			}
			this._ready();
		});
	}

	loadModuleDefault(){
		for(let module of loader.keys()){
			let metadata = loader(module);

			if(!metadata.no_disable){
				this._settings[metadata.name] = metadata.default_enabled || false;
			}

			if(metadata.settings){
				for(let key of Object.keys(metadata.settings)){
					let value = metadata.settings[key];
					this._settings[key] = value.default;
				}
			}
		}
	}

	_ready(){
		this._isReady = true;
		this._pendingPromises.forEach((resolve) => {
			resolve(this._settings);
		});
		this._pendingPromises = [];
	}

	get(){
		if(this._isReady){
			return Promise.resolve(this.settings);
		}

		return new Promise((resolve, reject) => {
			this._pendingPromises.push(resolve);
		});
	}

	set(settings){
		this._settings = settings;
		return new Promise((resolve, reject) => {
			chrome.storage.sync.set({
				settings: JSON.stringify(this._settings)
			}, () => {
				if(chrome.runtime.lastError){
					return reject(chrome.runtime.lastError);
				}
				resolve();
			});
		});
	}

	get settings(){
		if(!this._isReady){
			console.error('Settings accessed before loading finished');
		}
		return this._settings;
	}

	set settings(val){
		this.set(val);
	}
}

export default new Settings();
