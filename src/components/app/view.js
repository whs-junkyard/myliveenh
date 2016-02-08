import React from 'react';
import Immutable from 'immutable';
import AddEmote from 'components/addemote';
import SetName from 'components/setname';
import EmoteList from 'components/emotelist';
import Export from 'components/export';
import flexboxgrid from 'flexboxgrid';
import style from './style.css';

export default class View extends React.Component{
	state = {
		emotes: Immutable.Map(),
		name: 'Untitled',
	};

	onNameChange = (name) => {
		this.setState({name: name});
	};

	addEmote = (name, data) => {
		this.setState({emotes: this.state.emotes.set(name, data)});
	};

	onDelete = (name) => {
		this.setState({emotes: this.state.emotes.delete(name)});
	};

	render(){
		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-6">
						<h1>Emote pack maker</h1>
						<div id="donate">
							<a className="topcoat-button--large" href="http://portfolio.whs.in.th/donate" target="_blank">Donate</a>
							<a className="topcoat-button--large" href="https://github.com/whs/myliveenh/tree/emotemaker" target="_blank">GitHub</a>
						</div>
						<SetName name={this.state.name} onChange={this.onNameChange} />
						<AddEmote onAddEmote={this.addEmote} />
						<Export name={this.state.name} emotes={this.state.emotes} />
					</div>
					<div className="col-xs-12 col-md-6">
						<EmoteList emotes={this.state.emotes} onDelete={this.onDelete} />
					</div>
				</div>
			</div>
		);
	}
}
