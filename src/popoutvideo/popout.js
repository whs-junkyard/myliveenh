import injectScript from 'core/injectscript';

const JWPLAYER = 'http://ssl.p.jwpcdn.com/player/v/7.2.4/jwplayer.js';

let getStreamInfo = async function(id){
	let body = await fetch(`http://mylive.in.th/streams/${id}`, {
		credentials: 'include'
	}).then((res) => res.text());

	let html = document.implementation.createHTMLDocument();
	html.documentElement.innerHTML = body;

	let scriptNode = Array.from(html.documentElement.getElementsByTagName('SCRIPT')).filter((node) => {
		return !node.src &&
			node.textContent.indexOf('jwplayer') !== -1;
	})[0];
	return {
		title: html.title,
		script: scriptNode.textContent
	};
}

document.documentElement.innerHTML = require('./popout.txt');

let streamPromise = getStreamInfo(window.location.hash.substr(1));

let player = document.createElement('script');
player.setAttribute('src', JWPLAYER);
player.addEventListener('load', async function(){
	let result = await streamPromise;
	document.title = result.title;
	let script = result.script.replace(/(width|height): [0-9]+/g, '$1: "100%"');
	injectScript(script);
}, false);
document.body.appendChild(player);
