import React from 'react';
import Immutable from 'immutable';
import {Emote} from 'model';
import AddEmote from 'components/addemote';
import SetName from 'components/setname';
import EmoteList from 'components/emotelist';
import Export from 'components/export';
import Import from 'components/import';
import flexboxgrid from 'flexboxgrid';
import style from './style.css';

export default class View extends React.Component{
	state = {
		emotes: Immutable.List(),
		name: 'Untitled',
	};

	onNameChange = (name) => {
		this.setState({name: name});
	};

	addEmote = (name, data) => {
		this.setState({emotes: this.state.emotes.push(new Emote({
			name: name,
			image: data,
		}))});
	};

	onDelete = (index) => {
		this.setState({emotes: this.state.emotes.delete(index)});
	};

	onEdit = (index, name) => {
		let emotes = this.state.emotes.update(index, (node) => {
			return node.set('name', name);
		});
		this.setState({emotes: emotes});
	};

	onImport = (name, data) => {
		this.setState({name: name, emotes: data});
	};

	render(){
		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-4">
						<h1>Emote pack maker</h1>
						<div id="donate">
							<a className="topcoat-button--large" href="http://portfolio.whs.in.th/donate" target="_blank">Donate</a>
							<a className="topcoat-button--large" href="https://github.com/whs/myliveenh/tree/emotemaker" target="_blank">GitHub</a>
						</div>
						<SetName name={this.state.name} onChange={this.onNameChange} />
						<AddEmote onAddEmote={this.addEmote} />
						<div className="tool">
							<Import onImport={this.onImport} />
							<Export name={this.state.name} emotes={this.state.emotes} />
						</div>
					</div>
					<div className="col-xs-12 col-md-8">
						<EmoteList emotes={this.state.emotes} onDelete={this.onDelete} onEdit={this.onEdit} />
					</div>
				</div>
			</div>
		);
	}
}
