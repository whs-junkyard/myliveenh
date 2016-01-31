import $ from 'jquery';
import plugin from 'core/plugin';
import loginCode from './login.txt';

const ESC = 27;

plugin('login', () => {
	if($('.menu_guest').length !== 0){
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
