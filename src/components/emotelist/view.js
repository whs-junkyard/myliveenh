import React from 'react';
import EmoteRow from 'components/emoterow';
import style from './style.css';

export default class View extends React.Component{
	shouldComponentUpdate(nextProps, nextState){
		return nextProps.emotes !== this.props.emotes;
	}

	render(){
		let emotes = this.props.emotes.map((item, id) => {
			return (
				<EmoteRow item={item} key={id} onDelete={() => {
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
