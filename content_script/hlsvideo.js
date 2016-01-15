/**
 * MyLive enhancement / HLS Video
 * (C) 2014 whs.in.th All rights reserved
 */

// This code is unused as
// 1. I can't make jwplayer run jwLoad currectly
//    maybe I need to use jwplayer.js
// 2. HLS stream offer similar quality to rtmp
//    so no point in offering option

var currentVideomode = "hq";
var playerUrl;

var _setPlayerUrl = function(url){
	setTimeout(function(){
		var player = $("#playerbox object").get(0);
		player.jwInstreamDestroy();
		console.log(url, "setplayerurl");
		player.jwLoad([{
			"file": url
		}]);
		player.jwPlay();
	}, 1);
};

var getLqUrl = function(){
	if(!playerUrl){
		return;
	}
	var streamName = playerUrl.match(/flv:([^?]+)/)[1];
	return "http://stream.mylive.in.th/hls/" + streamName + ".m3u8";
};

var setVideoMode = function(mode){
	if(!playerUrl){
		var playlist = $("#playerbox object").get(0).jwGetPlaylist();
		playerUrl = playlist[0].file
	}
	currentVideomode = mode;
	if(mode == "hq"){
		_setPlayerUrl(playerUrl);
	}else if(mode == "lq"){
		console.log(getLqUrl());
		_setPlayerUrl(getLqUrl());
	}
}

var toggleVideoMode = function(){
	if(!playerUrl){
		var player = $("#playerbox object").get(0);
		if(typeof player.jwGetPlaylist != "function"){
			return false;
		}
		var playlist = player.jwGetPlaylist();
		playerUrl = playlist[0].file
	}
	if(currentVideomode == "hq"){
		setVideoMode("lq");
	}else{
		setVideoMode("hq");
	}
};

// put this in createVideoOption
$("<button class=\"btn btn-sm btn-default\">RTMP</button>").click(function(){
	toggleVideoMode();
	this.textContent = currentVideomode == "hq" ? "RTMP" : "HLS";
}).appendTo(menu);