/**
 * MyLive enhancement / Chat
 * (C) 2014 whs.in.th All rights reserved
 */

(function(){

"use strict";

var kappaEmotes = {}, settings, kappaBase = "//static-cdn.jtvnw.net/emoticons/v1/{image_id}/1.0";
var cache = [];

var replaceKappa = function(node){
	var replaceEmote = function(emote){
		var html = node.html();
		var url = kappaBase.replace(/\{image_id\}/g, kappaEmotes[emote].image_id);
		var newHTML = html.replace(
			new RegExp("(^|\\s+)"+emote+"(\\s+|$)", "g"),
			"$1<span class=\"liveenh-emote\" title=\""+emote+"\"><img src=\"" + url + "\" alt=\""+emote+"\" title=\""+emote+"\"></span>$2"
		);
		if(newHTML != html){
			node.html(newHTML);
			replaceEmote(emote);
		}
	};
	var origHtml = $.trim(node.html()).replace(/^: /, "");
	if(cache[0] == origHtml){
		var txt = cache[1];
		// disabled, assuming nicochat will get appended last
		if(node.html().match(/^\s*: /)){
			txt = " : " + txt;
		}
		node.html(txt);
	}else{
		Object.keys(kappaEmotes).forEach(replaceEmote);
		cache = [origHtml, node.html().replace(/^\s*:\s*/, "")];
	}
	return node;
};

var handleNicoChat = function(node){
	node = $(node);
	if(!node.is("span.nico")){
		return;
	}
	var origNodeWidth = node.width();
	node = replaceKappa(node);
	node.css("width", origNodeWidth);
};

var handleNode = function(node){
	node = $(node);
	if(!node.is("li")){
		return;
	}
	var textNode = node.find("p").contents().filter(function() {
		return this.nodeType == 3;
	}).last();
	var newNode = $("<span>")
		.html(textNode.text());
	newNode = replaceKappa(newNode);
	textNode.replaceWith(newNode);
};

var setup = function(){
	$.getJSON("http://twitchemotes.com/api_cache/v2/global.json").then(function(data){
		Object.assign(kappaEmotes, data.emotes);
		if(settings.twitchEmotes){
			$("#chatlogging").bind("DOMNodeInserted", function(ev){
				handleNode(ev.target);
			}).find("li").each(function(){
				handleNode(this);
			});
		}
		if(settings.nicoEmotes){
			$("#nicochat").bind("DOMNodeInserted", function(ev){
				handleNicoChat(ev.target);
			}).find(".nico").each(function(){
				handleNicoChat(this);
			});
		}
	});
	if(settings.twitchSubEmotes){
		$.getJSON("http://twitchemotes.com/api_cache/v2/subscriber.json").then(function(data){
			Object.keys(data.channels).forEach(function(channel){
				var detail = data.channels[channel];
				detail.emotes.forEach(function(item){
					kappaEmotes[item.code] = {"image_id": item.image_id};
				})
			});
		});
	}
};

chrome.storage.sync.get("settings", function(data){
	settings = _.defaults(data.settings || defaultSettings, defaultSettings);
	setup();
});

})();