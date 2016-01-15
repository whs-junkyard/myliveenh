/**
 * MyLive enhancement / Stream
 * (C) 2014 whs.in.th All rights reserved
 */

(function(){

"use strict";

var settings;

var disableNico = function(){
	window.location = "javascript:textSwitch();";
};

var autoMax = function(){
	// delay this to prevent conflict with disableNico
	setTimeout(function(){
		window.location = "javascript:changelayout();";
	}, 100);
};

var unfixtop = function(){
	$(document.body).addClass("liveenh-unfixtop");
	$(".navbar-fixed-top").removeClass("navbar-fixed-top");
};

var hideTimer = function(){
	$(document.body).addClass("liveenh-hidetimer");
};

var hideTimerBroadcaster = function(){
	$(document.body).addClass("liveenh-hidetimer-broadcaster");
};

var edgeless = function(){
	var style = $("<style>").appendTo("body");
	var adjustPlayerSize = function(){
		var scrollbar = getScrollBarWidth();
		// 30 from mylive's hardcoded, 15 from bootstrapcontainer
		var margin = (window.innerWidth - $("#wrap > .container").width() + 30 + 15) / 2;
		style.text("#col-xs-12{width: "+(window.innerWidth - scrollbar)+"px;margin-left:-"+margin+"px;}");
	};
	$(window).bind("resize", adjustPlayerSize);
	adjustPlayerSize();
};

var checkOptions = function(){
	if(settings.disableNico){
		disableNico();
	}
	if(settings.autoMax){
		autoMax();
	}
	if(settings.unfixtop){
		unfixtop();
	}
	if(settings.hideTimer){
		hideTimer();
	}
	if(settings.hideTimerBroadcaster){
		hideTimerBroadcaster();
	}
	if(settings.edgeless){
		edgeless();
	}
	if(settings.nicoGuest){
		injectPageScript("nico_guest.js");
	}
};

// https://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
var getScrollBarWidth = function() {
	var inner = document.createElement("p");
	inner.style.width = "100%";
	inner.style.height = "200px";

	var outer = document.createElement("div");
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
 	outer.style.overflow = "hidden";
	outer.appendChild(inner);

	document.body.appendChild(outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = "scroll";
	var w2 = inner.offsetWidth;
	if(w1 == w2){
		w2 = outer.clientWidth;
	}

	document.body.removeChild(outer);
	
	var out = (w1 - w2);
	if(out == 0){
		out = 14;
	}
	return out;
};

var parseBotChat = function(node){
	// XXX: Maybe we just inject a JavaScript file that hook directly to addnotice?
	var text = node.text().replace(/^Mylive Bot/, "");
	if(settings.autoFollow && text.indexOf("Recreate room") != -1){
		var roomId = text.match(/\/streams\/([0-9]+)$/);
		if(roomId[0]){
			window.location = window.location.protocol + "//" + window.location.hostname + roomId[0];
		}
	}
};

var handleChatNode = function(node){
	node = $(node);
	if(!node.is("li")){
		return;
	}
	if(node.find("strong.text-danger").length == 1){
		node.addClass("chat-bot");
		parseBotChat(node);
	}else if(node.find("strong.text-primary").length == 1){
		node.addClass("chat-owner");
	}else if(node.find("strong.text-muted").length == 1){
		node.addClass("chat-guest");
	}else{
		node.addClass("chat-user");
	}
};
var handleNicoChat = function(node){
	node = $(node);
	if(!node.is("span.nico")){
		return;
	}
	var color = node.css("color");
	if(color == "rgb(126, 250, 255)"){
		node.addClass("chat-bot");
	}else{
		node.addClass("chat-nico-user");
	}
};



var setupChat = function(){
	$("#chatlogging").bind("DOMNodeInserted", function(ev){
		handleChatNode(ev.target);
	}).find("li").each(function(){
		handleChatNode(this);
	});
	$("#nicochat").bind("DOMNodeInserted", function(ev){
		handleNicoChat(ev.target);
	}).find(".nico").each(function(){
		handleNicoChat(this);
	});
};

var createMenu = function(){
	var menu = $("<div id=\"liveenh-menu\">").hide();
	$("<a id=\"liveenh-btn\" class=\"btn btn-sm btn-warning\" title=\"MyLive Enhancement menu\">L+</a>")
		.click(function(){
			menu.toggle(500);
		})
		.insertAfter("#favlink");

	$("<a target=\"_blank\">Settings</a>").attr("href", chrome.extension.getURL("settings/settings.html")).appendTo(menu);

	var hideBot = $("<a href=\"#\">Hide bot</a>").click(function(){
		$(document.body).toggleClass("hidebot");
		$(this).toggleClass("active");
		return false;
	}).appendTo(menu);

	if(settings.hideBot){
		hideBot.click();
	}

	menu.appendTo($("#favlink").closest(".panel-title"));
};

var injectPageScript = function(fn){
	$("<script>").attr("src", chrome.extension.getURL("page_script/" + fn)).appendTo("body");
};

var createVideoOption = function(){
	if(!settings.enableMenu){
		return;
	}

	var menu = $("<div id=\"liveenh-playermenu\">");
	if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled){
		var fullScreen = function(selector){
			return function(){
				var elem = $(selector).get(0);
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				}else if(elem.msRequestFullscreen){
					elem.msRequestFullscreen();
				}else if(elem.mozRequestFullScreen){
					elem.mozRequestFullScreen();
				}else if(elem.webkitRequestFullscreen){
					elem.webkitRequestFullscreen();
				}
			};
		};
		$("<button class=\"btn btn-sm btn-default\"><i class=\"glyphicon glyphicon-fullscreen\"></i> + Nico</button>").click(fullScreen("#playerbox")).appendTo(menu);
		$("<button class=\"btn btn-sm btn-default full-chat\"><i class=\"glyphicon glyphicon-fullscreen\"></i> + Chat</button>").click(fullScreen("#liveenh-video-chat")).appendTo(menu);
	}
	$("#playerbox").append(menu);
};

var setup = function(){
	if($("#inputStreamKey").length == 1){
		$(document.body).addClass("liveenh-role-streamer");
	}else{
		$(document.body).addClass("liveenh-role-viewer");
	}

	$("#col-xs-9,#chat_1").wrapAll("<div id=\"liveenh-video-chat\">");

	checkOptions();
	createMenu();
	createVideoOption();
	setupChat();
};

chrome.storage.sync.get("settings", function(data){
	settings = _.defaults(data.settings || defaultSettings, defaultSettings);
	setup();
});

})();