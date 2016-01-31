import $ from 'jquery';
import resume from 'core/resume_angular';
import plugin from 'core/plugin';

plugin('indextags', () => {
	$(document.body).addClass('enh__indextags');

	var tagsNode = $('<div />')
		.addClass('enh__tags')
		.text('[[room.tags.join(" ")]]');
	tagsNode.insertAfter('.info');

	resume();
}, true);
