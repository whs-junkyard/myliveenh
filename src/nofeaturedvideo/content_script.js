import $ from 'jquery';
import plugin from 'core/plugin';
import injectScript from 'core/injectscript';

plugin('nofeaturedvideo', () => {
	$('#recommend video').replaceWith('<a v-bind:href="\'/streams/\'+no"><img v-bind:src="img"></a>');
	injectScript(`
	(function(){
	window.showRecommend = function(){};

	let originalSetData = recom.setData;

	recom.setData = function(d){
		this.img = d.img;
		originalSetData.call(this, d);
	}

	})();
	`);
}, {
	resume_angular: true,
});
