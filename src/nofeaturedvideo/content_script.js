import $ from 'jquery';
import Settings from 'settings';

let getFeaturedUser = () => {
	return $.trim($('.recommend .margin-top-10 div:last').text());
};

let getStreamUrl = () => {
	return $('.recommend .margin-top-10 a').attr('href');
};

let getFeaturedStreamImage = () => {
	let cacheBust = new Date().getTime();
	let user = getFeaturedUser();

	return `http://stream.mylive.in.th/thumbnail/${user}.png?_=${cacheBust}`;
}

let generateVideoView = () => {
	let fakeVideoView = $('<a class="body" id="enh__fakevideoview" />');
	fakeVideoView.attr('href', getStreamUrl());

	let fakeVideoViewImg = $('<img />');
	fakeVideoViewImg.attr('src', getFeaturedStreamImage());
	fakeVideoView.append(fakeVideoViewImg);

	return fakeVideoView;
};

Settings.get().then(function(settings){
	if(settings.nofeaturedvideo){
		$('#videoview').replaceWith(generateVideoView());
	}
});
