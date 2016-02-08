import React from 'react';
import Immutable from 'immutable';
import JSZip from 'jszip';
import {Emote} from 'model';
import reader from 'reader';
import style from './style.css';

export default class View extends React.Component{
	state = {
		state: null
	};

	constructor(){
		super();
		this.import = this.import.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState){
		return nextState.state !== this.state.state;
	}

	import = async function(e){
		if(e.target.files.length === 0){
			return;
		}
		if(!confirm('โหลดทับข้อมูลที่ทำงานอยู่?')){
			return;
		}

		this.setState({state: 'Loading...'});
		let target = e.target;

		let ab = await reader(target.files[0]);
		target.value = null;
		try{
			this.zip = JSZip(ab);
			this.zip = this.findZipRoot();
			this.loadManifest();
		}catch(e){
			alert('Error while loading: '+e.toString());
			console.error(e);
			this.setState({state: null});
			return;
		}

		let data = this.loadData();

		this.props.onImport(this.manifest.name, data);

		this.setState({state: null});
	};

	findZipRoot(){
		let fileList = this.zip.file(/^[^\/]+$/);
		if(fileList.length > 0){
			return this.zip;
		}

		let rootFolders = this.zip.folder(/[^\/]+\/$/);
		if(rootFolders.length === 0){
			throw new Error('zip has no object');
		}else if(rootFolders.length > 1){
			throw new Error('zip has multiple root object');
		}

		return this.zip.folder(rootFolders[0].name);
	}

	loadManifest(){
		let file = this.zip.file('set.json');
		if(!file){
			throw new Error('manifest file not found!');
		}
		this.manifest = JSON.parse(file.asText());
		if(!this.manifest.name){
			throw new Error('set name not defined');
		}
	}

	loadData(){
		let data = [];

		for(let emote in this.manifest.emotes){
			let file = this.zip.file(this.manifest.emotes[emote]);
			if(!file){
				continue;
			}
			file = new Blob([file.asArrayBuffer()]);

			data.push(new Emote({
				name: emote,
				image: file,
			}));
		}

		return Immutable.List(data);
	}

	render(){
		return (
			<div className="import">
				<input type="file" accept="application/zip" onChange={this.import} />
				<button className="topcoat-button" disabled={this.state.state !== null}>{this.state.state || 'Import'}</button>
			</div>
		);
	}
}
