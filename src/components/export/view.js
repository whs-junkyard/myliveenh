import React from 'react';
import JSZip from 'jszip';
import reader from 'reader';
import style from './style.css';

export default class View extends React.Component{
	state = {
		state: null
	};

	shouldComponentUpdate(nextProps, nextState){
		return nextState.state !== this.state.state;
	}

	getMetadata(){
		let emotes = {};

		let i = 0;
		for(let emote of this.props.emotes){
			emotes[emote.name] = `${i++}.img`;
		}

		return {
			'name': this.props.name || 'Untitled',
			'emotes': emotes,
		};
	}

	async export(){
		this.setState({state: 'Reading files..'});
		let zip = new JSZip();
		let dir = zip.folder('set');
		dir.file('set.json', JSON.stringify(this.getMetadata()));

		await Promise.all(this.props.emotes.map((node, index) => {
			return reader(node.image).then((ab) => {
				dir.file(`${index}.img`, ab);
			});
		}).toJS());

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
