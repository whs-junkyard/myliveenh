/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

class Settings{
	static defaults = {
	    notifyFollow: 5,
	    notifySound: false,
	};

	_settings = {};
	_isReady = false;
	_pendingPromises = [];

	constructor(){
		Object.assign(this._settings, Settings.defaults);
		// todo: backend-independent
		chrome.storage.sync.get('settings', (data) => {
			Object.assign(this._settings, data.settings);
			this._ready();
		});
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

	get settings(){
		if(!this._isReady){
			console.error('Settings accessed before loading finished');
		}
		return this._settings;
	}

	set settings(val){
		this._settings = val;
		chrome.storage.sync.set('settings', JSON.stringify(val));
	}
}

export default new Settings();
