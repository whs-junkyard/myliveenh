import $ from 'jquery';
import Settings from 'settings';
import loginCode from './login.txt';

const ESC = 27;

Settings.get().then(function(settings){
	if(settings.login && typeof window.__loginModified === 'undefined' && $('.menu_guest').length !== 0){
		window.__loginModified = true;
		let loginWnd = $(loginCode).appendTo('body');

		loginWnd.click((e) => {
			if(e.target.id == 'enh__login_outer'){
				loginWnd.hide();
			}
		});

		$(window).on('keydown', (e) => {
			if(e.which === ESC){
				loginWnd.hide();
			}
		});

		$('.menu_guest a[href="/login"]').click(() => {
			loginWnd.show();
			return false;
		});
	}
});
