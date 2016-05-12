import $ from 'jquery';
import plugin from 'core/plugin';

let getThumbnailUrl = () => {
	let user = $('.recommend .avatar').attr('src').match(/\/([^_\/]+?)_[A-Za-z0-9]+\.jpg$/)[1];
	return `http://stream.mylive.in.th/thumbnail/${user}.png`;
};

let getStreamUrl = () => {
	return $('.recommend .margin-top-10 a').attr('href');
};

let generateVideoView = () => {
	let fakeVideoView = $('<a class="body" id="enh__fakevideoview" />');
	fakeVideoView.attr('href', getStreamUrl());

	let fakeVideoViewImg = $('<img />');
	fakeVideoViewImg.attr('src', getThumbnailUrl());
	fakeVideoView.append(fakeVideoViewImg);

	return fakeVideoView;
};

plugin('nofeaturedvideo', () => {
	$('#videoview').replaceWith(generateVideoView());
});
