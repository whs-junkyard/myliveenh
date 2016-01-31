import $ from 'jquery';
import resume from 'core/resume_angular';
import plugin from 'core/plugin';

plugin('indextags', () => {
	$(document.body).addClass('enh__indextags');

	var tagsNode = $('<div class="enh__tags"><span class="label label-default" ng-repeat="tag in room.tags" ng-bind="tag"></span></div>');
	tagsNode.insertAfter('.roomtitle');

	resume();
}, true);
