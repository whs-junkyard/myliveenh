import injectScript from 'core/injectscript';
import getStreamInfo from './getStreamInfo';

const JWPLAYER = 'http://ssl.p.jwpcdn.com/player/v/7.2.4/jwplayer.js';
const JWPLAYER_SRI = 'sha384-+/DsWVrOBRUMkiyZc5fN6+Ljq5GBBvo6OnXLQOzh1Qi+Z4ceOWh82XQ2AgK14Oq/';

document.documentElement.innerHTML = require('./popout.txt');

let streamPromise = getStreamInfo(window.location.hash.substr(1));

let player = document.createElement('script');
// player.integrity = JWPLAYER_SRI;
// player.crossorigin = 'anonymous';
player.setAttribute('src', JWPLAYER);
player.addEventListener('load', async function(){
	let result = await streamPromise;
	document.title = result.title;
	let script = result.script.replace(/(width|height): [0-9]+/g, '$1: "100%"')
		.replace(/sources:([\s\S]+?)logo:/, 'playlist:[{sources: $1}], logo:');
	injectScript(script);
}, false);
document.body.appendChild(player);
