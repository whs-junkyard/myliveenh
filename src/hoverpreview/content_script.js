import $ from 'jquery';
import streamUrl from 'core/streamurl';
import injectScript from 'core/injectscript';

let DELAY = 1000;
let ID = 0;

$('#mainpagebody')
	.on('mouseenter', '.thumb', function(){
		let item = $(this);
		let node = this;
		let streamId = item.find('.roomtitle a').attr('href').match(/([0-9]+)$/)[0];

		clearTimeout(this.__enh_hoverpreview_timer);
		this.__enh_hoverpreview_timer = setTimeout(async function(){
			let coverImage = item.find('.cover img');
			let width = coverImage.width(), height = coverImage.height();
			coverImage.hide();

			let url = await streamUrl(streamId);

			let id = `enh__hoverpreview_${ID++}`;
			node.__enh_hoverpreview_id = id;
			node.__enh_hoverpreview_target = $('<div />')
				.attr('id', id)
				.appendTo(item.find('.cover'));

			let settings = {
					file: url,
					image: coverImage.attr('src'),
			        width: width,
					height: height,
			        autostart: true,
					controls: false,
			        rtmp: {
			            bufferlength: 2
			        }
			};

			injectScript(`(function(){
	var playerInstance = jwplayer(${JSON.stringify(id)});
	playerInstance.setup(${JSON.stringify(settings)});
})();`);
		}, DELAY);
	})
	.on('mouseleave', '.thumb', function(){
		let item = $(this);
		clearTimeout(this.__enh_hoverpreview_timer);
		item.find('.cover img').show();

		if(this.__enh_hoverpreview_id){
			injectScript(`
jwplayer(${JSON.stringify(this.__enh_hoverpreview_id)}).remove();
document.getElementById(${JSON.stringify(this.__enh_hoverpreview_id)}).remove();
`);
			delete this.__enh_hoverpreview_id;
		}
	});
