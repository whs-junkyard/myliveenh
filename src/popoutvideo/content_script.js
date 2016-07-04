import $ from 'jquery';
import getStreamInfo from './getStreamInfo';
import plugin from 'core/plugin';

plugin('popoutvideo', () => {
	let streamId = window.location.pathname.match(/\/([0-9]+)$/)[1];
	$('<span class="fa fa-youtube-play float" />')
		.click(async function(){
			chrome.runtime.sendMessage('fcmfpflaojbgfkbelnphnmokgiloaknp', {
				id: streamId,
				stream: await getStreamInfo(streamId),
			});
			// window.open(
			// 	`http://mylive.in.th/enh_popout/#${streamId}`,
			// 	'popoutplayer',
			// 	'width=640,height=360'
			// );
		})
		.appendTo('.subRight');
});
