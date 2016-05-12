import database from './database';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(!request.emotepack){
		return;
	}

	switch(request.emotepack){
		case 'getPacks':
			database().then((database) => {
				let tx = database.transaction(['emotes']);

				let rq = tx.objectStore('emotes').getAll();
				rq.onsuccess = (e) => {
					sendResponse(e.target.result);
				};
			});
			return true;
		case 'getEmote':
			database().then((database) => {
				let tx = database.transaction(['emotesFile']);

				let rq = tx.objectStore('emotesFile').get(request.id);
				rq.onsuccess = (e) => {
					let reader = new FileReader();
					reader.onload = (e) => {
						sendResponse(e.target.result);
					};
					reader.readAsDataURL(e.target.result);
				};
			});
			return true;
		default:
			console.error('Unknown background page request for emotepack');
	}
});
