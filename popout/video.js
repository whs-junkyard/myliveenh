window.showVideo = (message) => {
	window.message = message;
	let webview = document.getElementById('webview');

	let script = message.stream.script.replace(/(width|height): [0-9]+/g, '$1: "100%"')
		.replace(/sources:([\s\S]+?)logo:/, 'playlist:[{sources: $1}], hlshtml: true, primary: "html5", logo:');
	webview.addEventListener('contentload', () => {
		webview.executeScript({code: `
		let node = document.createElement('script');
		node.innerHTML = ${JSON.stringify(script)};
		(document.body || document.documentElement).appendChild(node);`});
	});
};
