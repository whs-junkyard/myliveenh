import $ from 'jquery';
import resume from 'core/resume_angular';
import plugin from 'core/plugin';

plugin('delayedban', () => {
	$(document.body).addClass('enh__delayedban');
});
