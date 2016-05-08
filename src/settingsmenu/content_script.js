import $ from 'jquery';
import plugin from 'core/plugin';

plugin('settingsmenu', () => {
	let target = $('.boxsetup .block');

	$('<div class="head">MyLive Enhancements</div>')
		.appendTo(target);

	$('<div class="line"><a href="https://myliveenh.cupco.de" target="_blank" class="btn btn-link btn-sm"><span class="fa fa-globe" /> Homepage</a></div>')
		.appendTo(target);

	$('<div class="line"><button id="enh__settingsbtn" class="btn btn-link btn-sm"><span class="fa fa-gears" /> ตั้งค่า</button></div>')
		.appendTo(target);
	$(document).on('click', '#enh__settingsbtn', () => {
		chrome.runtime.sendMessage({settingsmenu: 'settings'});
	});

	$('<div class="line"><a href="http://portfolio.whs.in.th/donate-th" target="_blank" class="btn btn-link btn-sm"><span class="fa fa-money" /> Donate</a></div>')
		.appendTo(target);
}, {
	resume_angular: true,
	always_load: true
});
