import Database from './database';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(!request.emotepack){
		return;
	}

	switch(request.emotepack){
	case 'getPacks':
		Database().then((database) => {
			let tx = database.transaction(['emotes']);

			let request = tx.objectStore('emotes').getAll();
			request.onsuccess = (e) => {
				sendResponse(e.target.result);
			};
		});
		return true;
	default:
		console.error('Unknown background page request for emotepack');
	}
});
