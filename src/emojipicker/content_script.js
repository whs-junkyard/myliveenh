import $ from 'jquery';
import plugin from 'core/plugin';

const CATEGORY_ICON = {
	'symbols': '✈️',
	'people': '😃',
	'nature': '🐻',
	'food': '🍔',
	'activity': '⚽',
	'travel': '✈️',
	'objects': '💡',
	'flags': '🎌',
};

plugin('emojipicker', () => {
	$('[ng-click="toggleicon()"]')
		.find('i')
			.replaceWith('😃');
	let root = $('.showicon').html(require('./emoji.txt'));

	let emoji = require('./emoji.json');
	let paneID = 1;
	for(let category in emoji){
		$('<li><a href="#" ng-click="pane=0" /></li>')
			.find('a')
				.attr('ng-click', `pane=${paneID}`)
				.attr('title', category)
				.text(CATEGORY_ICON[category] || category)
				.addClass(CATEGORY_ICON[category] ? 'enh__emoji' : null)
				.end()
			.appendTo(root.find('.enh__tab'));

		let pane = $('<ul class="enh__tab_pane enh__emotelist" />')
			.attr('ng-show', `pane==${paneID}`)
			.appendTo(root);

		for(let item of emoji[category]){
			$('<li><a href="#" class="enh__emoji"></a></li>')
				.find('a')
					.attr('ng-click', `emoji(${JSON.stringify(item.code)})`)
					.attr('title', item.name)
					.text(item.code)
					.end()
				.appendTo(pane);
		}

		paneID++;
	}
}, {
	resume_angular: true,
});
