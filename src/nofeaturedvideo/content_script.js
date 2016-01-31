import $ from 'jquery';
import streamInfo from 'core/streaminfo';
import plugin from 'core/plugin';

let getFeaturedUser = () => {
	return $.trim($('.recommend .margin-top-10 div:last').text());
};

let getThumbnailUrl = () => {
	let user = $('.recommend .avatar').attr('src').match(/\/([^_\/]+?)_[A-Za-z0-9]+\.jpg$/)[1];
	console.log($('.recommend .avatar').attr('src'));
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
