import $ from 'jquery';
import resume from 'core/resume_angular';
import Settings from 'settings';

Settings.get().then(function(settings){
	if(!settings.indextags){
		resume();
		return;
	}

	$(document.body).addClass('enh__indextags');

	var tagsNode = $('<div />')
		.addClass('enh__tags')
		.text('[[room.tags.join(" ")]]');
	tagsNode.insertAfter('.info');

	resume();
});
