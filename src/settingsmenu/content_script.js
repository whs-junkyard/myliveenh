import $ from 'jquery';
import plugin from 'core/plugin';

plugin('settingsmenu', () => {
	let target = $('.boxsetup .block');

	$('<div class="head">MyLive Enhancements</div>')
		.appendTo(target);

	$('<div class="line"><a target="_blank"><i class="fa fa-gears" /> ตั้งค่า</a></div>')
		.appendTo(target)
		.find('a')
			.attr('href', chrome.runtime.getURL(chrome.runtime.getManifest().options_page));

	$('<div class="line"><a href="http://portfolio.whs.in.th/donate" target="_blank"><i class="fa fa-money" /> Donate</a></div>')
		.appendTo(target);
}, {
	resume_angular: true,
	always_load: true
});
