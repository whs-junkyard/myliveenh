import $ from 'jquery';
import resume from 'core/stop_angular';

var tagsNode = $('<div />')
	.addClass('enh__tags')
	.text('[[room.tags.join(" ")]]');
tagsNode.insertAfter('.info');

resume();
