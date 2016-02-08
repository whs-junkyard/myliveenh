import React from 'react';
import style from './style.css';

export default class View extends React.Component{
	onChange = (e) => {
		this.props.onChange(e.target.value);
	};

	render(){
		return (
			<form className="addemote">
				<div className="input">
					<div className="label">Set name</div>
					<input type="text" className="topcoat-text-input" value={this.props.name} onChange={this.onChange} required={true} />
				</div>
			</form>
		);
	}
}
