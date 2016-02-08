import React from 'react';
import EmoteRow from 'components/emoterow';
import style from './style.css';

export default class View extends React.Component{
	render(){
		let emotes = this.props.emotes.map((item, id) => {
			return (
				<EmoteRow name={item.name} image={item.image} key={id} onDelete={() => {
					this.props.onDelete(id);
				}} onEdit={(name) => {
					this.props.onEdit(id, name);
				}} />
			);
		}).toJS();

		return (
			<div className="emotelist">
				{emotes}
			</div>
		);
	}
}
