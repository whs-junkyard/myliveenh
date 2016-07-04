import injectScript from 'core/injectscript';
import htmlXhr from 'core/htmlxhr';

const JWPLAYER = 'http://ssl.p.jwpcdn.com/player/v/7.2.4/jwplayer.js';
const JWPLAYER_SRI = 'sha384-+/DsWVrOBRUMkiyZc5fN6+Ljq5GBBvo6OnXLQOzh1Qi+Z4ceOWh82XQ2AgK14Oq/';

let getStreamInfo = async function(id){
	let html = await htmlXhr('GET', `http://mylive.in.th/streams/${id}`);

	let scriptNode = Array.from(html.documentElement.getElementsByTagName('SCRIPT')).filter((node) => {
		return !node.src &&
			node.textContent.indexOf('jwplayer') !== -1;
	})[0];
	return {
		title: html.title,
		script: scriptNode.textContent,
	};
};

document.documentElement.innerHTML = require('./popout.txt');

let streamPromise = getStreamInfo(window.location.hash.substr(1));

let player = document.createElement('script');
// player.integrity = JWPLAYER_SRI;
// player.crossorigin = 'anonymous';
player.setAttribute('src', JWPLAYER);
player.addEventListener('load', async function(){
	let result = await streamPromise;
	document.title = result.title;
	let script = result.script.replace(/(width|height): [0-9]+/g, '$1: "100%"');
	injectScript(script);
}, false);
document.body.appendChild(player);
