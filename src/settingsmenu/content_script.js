import $ from 'jquery';
import resume from 'core/resume_angular';

if(typeof window.__enh_settingsmenu === 'undefined'){
	window.__enh_settingsmenu = true;

	let target = $('.boxsetup .block');

	$('<div class="head">MyLive Enhancements</div>')
		.appendTo(target);

	$('<div class="line"><a target="_blank">ตั้งค่า</a></div>')
		.appendTo(target)
		.find('a')
			.attr('href', chrome.runtime.getURL(chrome.runtime.getManifest().options_page));

	$('<div class="line"><a href="http://portfolio.whs.in.th/donate" target="_blank">Donate</a></div>')
		.appendTo(target);

	resume();
}
