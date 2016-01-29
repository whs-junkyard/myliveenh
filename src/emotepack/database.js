export default () => {
	return new Promise((resolve, reject) => {
		let db = indexedDB.open('emotes', 1);
		db.onupgradeneeded = (e) => {
			let db = e.target.result;
			db.createObjectStore('emotes', {keyPath: 'name'});
			db.createObjectStore('emotesFile', {
				autoIncrement: true
			});
		};
		db.onsuccess = (e) => {
			resolve(db.result);
		};
		db.onerror = (e) => {
			reject(e);
		};
	});
};
