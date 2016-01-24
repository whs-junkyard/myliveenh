var tagsNode = $('<div />').addClass('enh-tags').text('[[room.tags.join(" ")]]');
tagsNode.insertAfter('.info');

var user = $.trim($('.recommend .margin-top-10 div:last').text());
var fakeVideoView = $('<a class="body" id="enh-fakevideoview" />');
fakeVideoView.attr('href', $('.recommend .margin-top-10 a').attr('href'));
var fakeVideoViewImg = $('<img />');
fakeVideoViewImg.attr('src', 'http://stream.mylive.in.th/thumbnail/' + user + '.png?_=' + new Date().getTime());
fakeVideoView.append(fakeVideoViewImg);
$('#videoview').replaceWith(fakeVideoView);
