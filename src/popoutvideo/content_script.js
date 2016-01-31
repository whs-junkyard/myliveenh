import $ from 'jquery';
import plugin from 'core/plugin';

plugin('popoutvideo', () => {
	let streamId = window.location.pathname.match(/\/([0-9]+)$/)[1];
	$('<span class="fa fa-youtube-play float" />')
		.click(() => {
			window.open(
				chrome.runtime.getURL('data/player.html') + `#${streamId}`,
				'popoutplayer',
				'width=640,height=360'
			);
		})
		.appendTo('.subRight');
});
