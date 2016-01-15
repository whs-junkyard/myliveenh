/**
 * MyLive enhancement / Chat Emotes
 * (C) 2014 whs.in.th All rights reserved
 */

(function(){

"use strict";

var settings;

var setup = function(){
	$(document.body).addClass("chat-theme-" + settings.chatBg);
};

chrome.storage.sync.get("settings", function(data){
	settings = _.defaults(data.settings || defaultSettings, defaultSettings);
	setup();
});

})();