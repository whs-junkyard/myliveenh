import React from 'react';
import JSZip from 'jszip';
import style from './style.css';

export default class View extends React.Component{
	state = {
		state: null
	};

	readFile(blob){
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = function(e){
				resolve(e.target.result);
			};
			reader.onerror = function(e){
				reject(e);
			};
			reader.readAsArrayBuffer(blob);
		});
	}

	getNumberedFile(){
		let index = 0;
		return this.props.emotes.map(() => {
			return `${index++}.img`;
		});
	}

	getMetadata(files){
		return {
			'name': this.props.name,
			'emotes': files.toJS(),
		};
	}

	async export(){
		this.setState({state: 'Reading files..'});
		let zip = new JSZip();
		let dir = zip.folder('set');
		let files = this.getNumberedFile();
		dir.file('set.json', JSON.stringify(this.getMetadata(files)));

		let promises = [];

		for(let [key, value] of files.entries()){
			let promise = this.readFile(this.props.emotes.get(key)).then((function(filename, ab){
				dir.file(filename, ab);
			}).bind(this, value));
			promises.push(promise);
		}

		await Promise.all(promises);

		let content = zip.generate({
			type: 'base64'
		});
		window.location.href = 'data:application/zip;base64,' + content;
		this.setState({state: null});
	}

	render(){
		return (
			<button className="topcoat-button--cta export" disabled={this.state.state !== null} onClick={() => {
				this.export();
			}}>{this.state.state || 'Export'}</button>
		);
	}
}
