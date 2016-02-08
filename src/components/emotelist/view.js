import React from 'react';
import EmoteRow from 'components/emoterow';
import style from './style.css';

export default class View extends React.Component{
	render(){
		let emotes = Array.from(this.props.emotes.entries()).map((item) => {
			return (
				<EmoteRow name={item[0]} image={item[1]} key={item[0]} onDelete={() => {
					this.props.onDelete(item[0]);
				}} />
			);
		});

		return (
			<div className="emotelist">
				{emotes}
			</div>
		);
	}
}
