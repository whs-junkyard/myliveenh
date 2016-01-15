/**
 * MyLive enhancement / Chat
 * (C) 2014 whs.in.th All rights reserved
 */

(function(){

"use strict";

var kappaDB, kappaKey, settings;
var cache = [];

var replaceKappa = function(node){
	var replaceEmote = function(emote){
		var html = node.html();
		var newHTML = html.replace(
			new RegExp("(^|\\s+)"+emote+"(\\s+|$)", "g"),
			"$1<span class=\"liveenh-emote\" title=\""+emote+"\"><img src=\""+kappaDB[emote].url+"\" alt=\""+emote+"\" title=\""+emote+"\"></span>$2"
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
		kappaKey.forEach(replaceEmote);
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
	$.getJSON(chrome.extension.getURL("data/global.json")).then(function(data){
		kappaDB = data;
		kappaKey = Object.keys(kappaDB);
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
};

chrome.storage.sync.get("settings", function(data){
	settings = _.defaults(data.settings || defaultSettings, defaultSettings);
	setup();
});

})();