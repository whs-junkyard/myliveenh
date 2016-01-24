/**
 * MyLive enhancement / Follow users notification
 * (C) 2016 whs.in.th All rights reserved
 */

(function(){

'use strict';

chrome.runtime.onInstalled.addListener(function(){
	chrome.alarms.get('notify', function(alarm){
		if(!alarm){
			chrome.storage.sync.get('settings', function(data){
				var settings = {};
				Object.assign(settings, defaultSettings, data.settings);
				if(settings.notifyFollow === 0){
					return;
				}
				chrome.alarms.create('notify', {
					periodInMinutes: settings.notifyFollow,
					delayInMinutes: settings.notifyFollow
				});
			});
		}
	});
});


var Notify = {};
Object.defineProperty(Notify, 'state', {
	'get': function(){
		return JSON.parse(localStorage.followNotificationState || '[]');
	},
	'set': function(val){
		localStorage.followNotificationState = JSON.stringify(val);
	}
});

function updateFollowing(){
	var body = new FormData();
	body.append('tag', 'follow');

	var request = new Request('http://mylive.in.th/api/main', {
		method: 'POST',
		body: body,
		cache: 'no-cache',
		credentials: 'include',
	});

	fetch(request)
		.then(function(res){
			console.log(res);
			return res.json();
		})
		.then(function(res){
			console.log(res);
			if(res.room){
				var currentStream = [];
				for(var i = 0; i < res.room.length; i++){
					var room = res.room[i];
					currentStream.push(room.no);
					if(Notify.state.indexOf(room.no) == -1){
						chrome.notifications.create(
							'http://mylive.in.th/streams/' + room.no,
							{
								'type': 'basic',
								'iconUrl': room.img,
								'title': room.title,
								'message': room.tags.map(function(item){
									return '#' + item;
								}).join(' '),
								'buttons': [{'title': 'Watch'}]
							},
							function(){}
						);
					}
				}
				Notify.state = currentStream
			}
		});
}
window.updateFollowing = updateFollowing;

chrome.alarms.onAlarm.addListener(function(alarm){
	if(alarm.name != 'notify'){
		return;
	}


});

chrome.notifications.onButtonClicked.addListener(function(notify){
	chrome.tabs.create({
		url: notify
	});
});

})();
