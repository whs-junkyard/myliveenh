/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

import Settings from 'settings';

const alarmName = 'inbox';
const sound = new Audio('data/inbox.ogg');
let metadata = {};

export let createAlarm = (duration) => {
	chrome.alarms.create(alarmName, {
		periodInMinutes: duration,
		delayInMinutes: duration,
	});
};

export let loadInbox = async function(){
	let inbox = await (fetch('http://mylive.in.th/api/inbox', {
		method: 'POST',
		body: 'mode=unseen',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		credentials: 'include',
	}).then((data) => data.json()));

	if(!inbox.data){
		return;
	}

	// {"ok":1,"cnt":1,"data":[{"no":"146272542588400","star":0,"name":"awkwin","avatar":"default.png","sender":"awkwin","title":"zxcv","attach":0,"date":1462725425}]}

	let knownMessages = JSON.parse(localStorage.inboxNotificationState || '[]');
	let shouldNotify = inbox.data.filter((item) => !knownMessages.includes(item.no)).length > 0;

	if(shouldNotify){
		chrome.notifications.create(
			null,
			{
				'type': 'list',
				'title': 'ข้อความใหม่',
				'message': '',
				'iconUrl': 'data/icon.png',
				'eventTime': Math.max.apply(null,
					inbox.data.map((item) => item.date * 1000)
				),
				items: inbox.data.map(item => {
					return {
						title: item.title,
						message: item.name,
					};
				}),
				requireInteraction: true,
			},
			(id) => {
				metadata[id] = true;
			}
		);

		let settings = await Settings.get();

		if(settings.notifyInboxSound){
			sound.play();
		}
	}

	localStorage.inboxNotificationState = JSON.stringify(
		inbox.data.map((item) => item.no)
	);
};

window.loadInbox = loadInbox;

let setAlarm = () => {
	chrome.alarms.get(alarmName, async function(alarm){
		if(!alarm){
			let settings = await Settings.get();
			if(settings.notifyInbox === 0){
				return;
			}

			createAlarm(settings.notifyInbox);
		}
	});
};

chrome.runtime.onInstalled.addListener(setAlarm);
chrome.runtime.onStartup.addListener(setAlarm);

chrome.alarms.onAlarm.addListener((alarm) => {
	if(alarm.name !== alarmName){
		return;
	}

	loadInbox();
});

chrome.notifications.onClicked.addListener((id) => {
	if(metadata[id]){
		chrome.tabs.create({
			url: 'http://mylive.in.th/inbox',
		});
		chrome.notifications.clear(id);
	}
});
