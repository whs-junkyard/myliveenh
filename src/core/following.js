/**
 * MyLive enhancement
 * (C) 2016 whs.in.th All rights reserved
 */

export default class Following{
	static endpoint = 'http://mylive.in.th/api/main';

	get knownRoom(){
		return JSON.parse(localStorage.followNotificationState || '[]');
	}

	set knownRoom(val){
		localStorage.followNotificationState = JSON.stringify(val);
	}

	async get(){
		let list = await this._fetchRooms();
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

	_fetchRooms(){
		return fetch(this._buildRequest())
			.then((res) => res.json())
			.then((res) => res.room);
	}

	_buildRequest(){
		let header = new Headers();
		header.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

		return new Request(Following.endpoint, {
			method: 'POST',
			headers: header,
			body: 'tag=follow',
			cache: 'no-cache',
			credentials: 'include',
		});
	}
}