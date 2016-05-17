/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

import Settings from 'settings';
import Following from 'core/following';

const alarmName = 'notify';
const sound = new Audio('data/notify.ogg');
let metadata = {};

export let createAlarm = (duration) => {
	chrome.alarms.create(alarmName, {
		periodInMinutes: duration,
		delayInMinutes: duration,
	});
};

export let loadFollow = async function(){
	let following = new Following();
	let newRooms = await following.get();
	for(let room of newRooms){
		chrome.notifications.create(
			null,
			{
				'type': 'basic',
				'iconUrl': room.img,
				'title': room.title,
				'message': room.owner,
				'contextMessage': room.tags.join(', '),
				'eventTime': room.startstamp * 1000,
				isClickable: true,
			},
			(id) => {
				metadata[id] = `http://mylive.in.th/streams/${room.no}`;
			}
		);
	}

	let settings = await Settings.get();

	if(settings.notifySound && newRooms.length > 0){
		sound.play();
	}
};

window.loadFollow = loadFollow;

let setAlarm = () => {
	chrome.alarms.get(alarmName, async function(alarm){
		if(!alarm){
			let settings = await Settings.get();
			if(settings.notifyFollow === 0){
				return;
			}

			createAlarm(settings.notifyFollow);
		}
	});
};

chrome.runtime.onInstalled.addListener(setAlarm);
chrome.runtime.onStartup.addListener(setAlarm);

chrome.alarms.onAlarm.addListener((alarm) => {
	if(alarm.name !== alarmName){
		return;
	}

	loadFollow();
});

chrome.notifications.onClicked.addListener((id) => {
	if(metadata[id]){
		chrome.tabs.create({
			url: metadata[id],
		});
		chrome.notifications.clear(id);
	}
});
