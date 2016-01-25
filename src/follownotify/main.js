/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

export default class FollowNotify{
	static endpoint = 'http://mylive.in.th/api/main';

	get knownRoom(){
		return JSON.parse(localStorage.followNotificationState || '[]');
	}

	set knownRoom(val){
		localStorage.followNotificationState = JSON.stringify(val);
	}

	async update(){
		let list = await this.getLiveList();
		let roomIds = [];
		let knownRoom = this.knownRoom;
		let newRooms = [];

		for(let room of list){
			roomIds.push(room.no);

			if(this.knownRoom.indexOf(room.no) === -1){
				newRooms.push(room);
			}
		}

		this.knownRoom = roomIds;
		return newRooms;
	}

	getLiveList(){
		return fetch(this.buildRequest())
			.then((res) => res.json())
			.then((res) => res.room);
	}

	buildRequest(){
		let header = new Headers();
		header.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

		return new Request(FollowNotify.endpoint, {
			method: 'POST',
			headers: header,
			body: 'tag=follow',
			cache: 'no-cache',
			credentials: 'include',
		});
	}
}