import Database from './database';

Database().then((database) => {
	let id = parseInt(window.location.hash.substr(1), 10);
	let tx = database.transaction(['emotesFile']);
	let request = tx.objectStore('emotesFile')
		.get(id);
	request.onsuccess = (e) => {
		let url = window.URL.createObjectURL(e.target.result);

		let img = document.createElement('img');
		img.setAttribute('src', url);
		document.body.appendChild(img);

		img.onload = () => {
			window.parent.postMessage({
				type: 'emoteSizing',
				width: img.clientWidth,
				height: img.clientHeight,
				id: id
			}, 'http://mylive.in.th');
		}
	};
});
