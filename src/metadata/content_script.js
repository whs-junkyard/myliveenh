import $ from 'jquery';
import plugin from 'core/plugin';
import injectScript from 'core/injectscript';

plugin('metadata', () => {
	let target = $('#bodydesc .media').closest('.row').find('.col-sm-4');
	$('<div class="enh__streammeta" id="enh__streammeta"></div>').appendTo(target);
	injectScript(require('./metadata.txt'));
});
