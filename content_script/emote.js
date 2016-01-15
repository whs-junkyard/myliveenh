/**
 * MyLive enhancement / Chat Emotes
 * (C) 2014 whs.in.th All rights reserved
 */

(function(){

"use strict";

var settings, kappaDB;

var siteEmoteMap = {
	":)": "/assets/emoji/smile.svg",
	";)": "/assets/emoji/wink.svg",
	":(": "/assets/emoji/worried.svg",
	":3": "/assets/emoji/cat_face.svg",
	":'3':": "/assets/emoji/kissing_heart.svg",
	":X:": "/assets/emoji/loudly_crying_face.svg",
	":lol:": "/assets/emoji/face_with_tear_of_joy.svg",
	":X3:": "/assets/emoji/relaxed.svg",
	":beer:": "/assets/emoji/beer_mug.svg",
	"-_-": "/assets/emoji/expressionless.svg",
	":D": "/assets/emoji/grinning.svg",
	":chick:": "/assets/emoji/chicken.svg",
	":drunk:": "/assets/emoji/drunk.svg",
	":18:": "/assets/emoji/no_one_under_eighteen_symbol.svg",
	":poop:": "/assets/emoji/poop.svg",
	":heart:": "/assets/emoji/heart.svg",
	"<3": "/assets/emoji/heart.svg",
	":pill:": "/assets/emoji/pill.svg",
};

var reverseObject = function(obj){
	var out = {};
	var keys = Object.keys(obj);
	for(var i = 0; i < keys.length; i++){
		var key = keys[i];
		out[obj[key]] = key;
	}
	return out;
};

var revSiteEmoteMap = reverseObject(siteEmoteMap);

var handleNode = function(node){
	node = $(node);

	if(settings.disableEmote){
		node.find("img").each(function(index, emote){
			var src = emote.getAttribute("src");
			var name = revSiteEmoteMap[src];
			if(name){
				$(emote).replaceWith(name);
			}
		});
	}else{
		node.find("img").each(function(index, emote){
			var src = emote.getAttribute("src");
			var name = revSiteEmoteMap[src];
			if(name){
				$(emote).wrap($("<span class=\"liveenh-emote\">").attr("title", name));
			}
		});
	}
};

var buildEmoteList = function(el){
	$("<p><strong>MyLive emotes</strong></p>").appendTo(el);
	var container = $("<div>").appendTo(el);
	var keys = Object.keys(siteEmoteMap);
	for(var i = 0; i < keys.length; i++){
		var name = keys[i];
		$("<img>").attr({
			"title": name,
			"src": siteEmoteMap[name],
			"data-code": name
		}).css("height", "32px").appendTo(container);
	}

	if(settings.twitchEmotes || settings.nicoEmotes){
		$("<p><strong>Twitch emotes</strong> (only MyLive Enhancements user will see)</p>").appendTo(el);
		container = $("<div>").appendTo(el);
		keys = Object.keys(kappaDB);
		for(var i = 0; i < keys.length; i++){
			var name = keys[i];
			var data = kappaDB[name];
			$("<img>").attr({
				"title": name + " - " + data.description,
				"src": data.url,
				"data-code": name
			}).appendTo(container);
		}
	}else{
		$("<p>Enable Twitch emotes in settings to unlock more emotes</p>").appendTo(el);
	}
};

var createEmotePicker = function(){
	var emotePicker = $("<div id=\"emotePicker\">")
		.hide()
		.appendTo("#chat_body1");
	buildEmoteList(emotePicker);

	var inputBox = $("#chatInput");

	emotePicker.on("click", "img[data-code]", function(e){
		var code = e.target.getAttribute("data-code");
		inputBox.caret(" " + code + " ");
	});

	$("<a href=\"#\" title=\"Emote picker\"><img style=\"height: 18px;\" src=\"/assets/emoji/smile.svg\"></a>")
		.click(function(){
			emotePicker.toggle(500);
			return false;
		})
		.insertAfter("#favlink");
};

var setup = function(){
	$.getJSON(chrome.extension.getURL("data/global.json")).then(function(data){
		kappaDB = data;

		$("#chatlogging").bind("DOMNodeInserted", function(ev){
			handleNode(ev.target);
		}).find("li").each(function(){
			handleNode(this);
		});

		createEmotePicker();
	});
};

chrome.storage.sync.get("settings", function(data){
	settings = _.defaults(data.settings || defaultSettings, defaultSettings);
	setup();
});

})();