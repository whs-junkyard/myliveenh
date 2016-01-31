/* globals: videojs */

import streamInfo from 'core/streaminfo';

function initPlayer(){
	return new Promise((resolve, reject) => {
		videojs(document.getElementById('video'), {
			controls: true,
			autoplay: true,
			// techOrder: ['flash'],
			flash: {
				swf: 'videojs/video-js.swf',
			},
		}, function(){
			resolve(this);
		});
	});
}

async function init(){
	let [video, stream] = await Promise.all([
		initPlayer(),
		streamInfo(window.location.hash.substr(1)),
	]);
	video.poster(stream.poster);
	video.src([
		{src: stream.rtmp, type: 'rtmp/mp4'},
		{src: stream.hls, type: 'application/x-mpegURL'}
	]);
	video.play();
}

document.addEventListener("DOMContentLoaded", init);
