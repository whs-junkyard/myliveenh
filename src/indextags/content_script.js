import $ from 'jquery';
import plugin from 'core/plugin';

plugin('indextags', () => {
	$(document.body).addClass('enh__indextags');

	var tagsNode = $('<a href="/streams/[[room.no]]" class="enh__tags"><span class="label label-default" ng-repeat="tag in room.tags" ng-bind="tag"></span></a>')
	tagsNode.insertAfter('.roomtitle');
}, {
	resume_angular: true
});
