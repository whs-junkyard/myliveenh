/**
 * MyLive enhancement / Follow users notification
 * (C) 2014 whs.in.th All rights reserved
 */

(function(){

"use strict";

chrome.runtime.onInstalled.addListener(function(){
	chrome.alarms.get("notify", function(alarm){
		if(!alarm){
			chrome.storage.sync.get("settings", function(data){
				var settings = _.defaults(data.settings || defaultSettings, defaultSettings);
				if(settings.notifyFollow === 0){
					return;
				}
				chrome.alarms.create("notify", {
					periodInMinutes: settings.notifyFollow,
					delayInMinutes: settings.notifyFollow
				});
			});
		}
	});
});

var Notify = {};
Object.defineProperty(Notify, "state", {
	"get": function(){
		return JSON.parse(localStorage.followNotificationState || "[]");
	},
	"set": function(val){
		localStorage.followNotificationState = JSON.stringify(val);
	}
});

var sound = new Audio("data/notify.ogg");

var extractStreamInfo = function(index, node){
	node = $(node);
	return {
		"title": node.find(".livetitle").attr("data-original-title"),
		"link": "http://mylive.in.th" + node.find(".livetitle a").attr("href"),
		"user": node.find(".livedesc:eq(0) a").text(),
		"item": node.find(".livedesc:eq(1)").attr("data-original-title"),
		"thumbnail": node.find(".previewpic").attr("src")
	};
};

var parseBody = function(data){
	chrome.storage.sync.get("settings", function(storage){
		var settings = _.defaults(storage.settings || defaultSettings, defaultSettings);

		var body = $($.parseHTML(data));
		var following = body.find("#following2");
		if(following.length === 0){
			return;
		}

		var pluckKey = settings.notifyByUser ? "user" : "link";
		var streams = following.find(".livethumbnail");
		streams = streams.map(extractStreamInfo);
		var links = _.pluck(streams, pluckKey);

		var state = Notify.state;
		streams = streams.filter(function(index, item){
			return state.indexOf(item[pluckKey]) == -1;
		});

		for(var i = 0; i < streams.length; i++){
			var item = streams[i];
			chrome.notifications.create(item.link, {
				"type": "basic",
				"iconUrl": item.thumbnail,
				"title": item.title,
				"message": item.user + " is now living " + item.item,
				"buttons": [{"title": "Watch"}]
			}, function(){});
		}

		if(settings.notifySound && streams.length > 0){
			sound.play();
		}

		Notify.state = links;
	});
};

var refresh = function(){
	$.get("http://mylive.in.th", function(data){
		parseBody(data);
	});
};

window.refresh = refresh;

chrome.alarms.onAlarm.addListener(function(alarm){
	if(alarm.name != "notify"){
		return;
	}
	
	refresh();
});

chrome.notifications.onButtonClicked.addListener(function(notify){
	chrome.tabs.create({
		url: notify
	});
});

})();