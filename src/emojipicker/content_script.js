import $ from 'jquery';
import plugin from 'core/plugin';

plugin('emojipicker', () => {
	$('[ng-click="toggleicon()"]')
		.find('i')
			.replaceWith('😃');
	$('[ng-click="toggleemote()"]').remove();
	let root = $('.showicon').html(require('./emoji.txt'));

	let emoji = require('./emoji.json');
	let paneID = 2;
	for(let category in emoji){
		$('<li><a href="#" /></li>')
			.find('a')
				.attr('ng-click', `pane=${paneID}`)
				.attr('title', category)
				.text(emoji[category][0].code)
				.addClass('enh__emoji')
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
