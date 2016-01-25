/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

import Settings from 'settings';
import Following from 'core/following';

const alarmName = 'notify';
const sound = new Audio('data/notify.ogg');

export let createAlarm = (duration) => {
	chrome.alarms.create(alarmName, {
		periodInMinutes: duration,
		delayInMinutes: duration
	});
};

export let loadFollow = async function(){
	let following = new Following();
	let newRooms = await following.get();
	for(let room of newRooms){
		chrome.notifications.create(
			`http://mylive.in.th/streams/${room.no}`,
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

	let settings = await Settings.get();

	if(settings.notifySound && newRooms.length > 0){
		sound.play();
	}
};

window.loadFollow = loadFollow;

chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.get(alarmName, async function(alarm){
		if(!alarm){
			let settings = await Settings.get();
			if(settings.notifyFollow === 0){
				return;
			}

			createAlarm(settings.notifyFollow);
		}
	});
});

chrome.alarms.onAlarm.addListener((alarm) => {
	if(alarm.name != 'notify'){
		return;
	}

	loadFollow();
});

chrome.notifications.onButtonClicked.addListener((notify) => {
	chrome.tabs.create({
		url: notify
	});
});

