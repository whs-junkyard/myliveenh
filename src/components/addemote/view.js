import React from 'react';
import style from './style.css';

export default class View extends React.Component{
	state = {
		file: null,
		code: '',
		error: null,
	};

	onSubmit = (e) => {
		e.preventDefault();
		if(!this.state.file || !this.state.code){
			this.setState({error: 'File and code must be filled'});
			return;
		}

		this.props.onAddEmote(this.state.code, this.state.file);
		this.setState({file: null, code: ''});
	};

	onFileChange = (e) => {
		if(e.target.files.length === 0){
			return;
		}

		let file = e.target.files[0];
		this.setState({file: file, error: ''});
	};

	onCodeChange = (e) => {
		this.setState({code: e.target.value, error: ''});
	};

	render(){
		let error = null;

		if(this.state.error){
			error = (
				<div className="alert">{this.state.error}</div>
			);
		}

		return (
			<form className="addemote" onSubmit={this.onSubmit}>
				{error}
				<div className="input">
					<div className="label">File</div>
					<input type="file" accept="image/*" required={true} onChange={this.onFileChange} ref={(node) => {
							if(node && this.state.file === null){
								node.value = null;
							}
						}} />
				</div>
				<div className="input">
					<div className="label">Emote code</div>
					<input type="text" className="topcoat-text-input" value={this.state.code} onChange={this.onCodeChange} required={true} />
				</div>
				<input type="submit" className="topcoat-button" value="Add" />
			</form>
		);
	}
}
