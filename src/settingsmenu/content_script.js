import $ from 'jquery';
import plugin from 'core/plugin';

plugin('settingsmenu', () => {
	let target = $('.boxsetup .block');

	$('<div class="head">MyLive Enhancements</div>')
		.appendTo(target);

	$('<div class="line"><a href="https://myliveenh.cupco.de" target="_blank" class="btn btn-link btn-sm"><span class="fa fa-globe" /> Homepage</a></div>')
		.appendTo(target);

	$('<div class="line"><a target="_blank" class="btn btn-link btn-sm"><span class="fa fa-gears" /> ตั้งค่า</a></div>')
		.appendTo(target)
		.find('a')
			.attr('href', chrome.runtime.getURL(chrome.runtime.getManifest().options_page));

	$('<div class="line"><a href="http://portfolio.whs.in.th/donate-th" target="_blank" class="btn btn-link btn-sm"><span class="fa fa-money" /> Donate</a></div>')
		.appendTo(target);
}, {
	resume_angular: true,
	always_load: true
});
