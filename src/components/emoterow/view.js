import React from 'react';
import style from './style.css';

export default class View extends React.Component{
	onChange = (e) => {
		this.props.onEdit(e.target.value);
	};

	render(){
		return (
			<div className="emote">
				<EmoteImage image={this.props.image} />
				<div className="action"><button className="topcoat-button" onClick={this.props.onDelete}>x</button></div>
				<div className="text" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}><input type="text" className="topcoat-text-input" value={this.props.name} onChange={this.onChange} /></div>
			</div>
		);
	}
}

class EmoteImage extends React.Component{
	state = {
		url: null
	};

	componentDidMount(){
		this.setState({url: URL.createObjectURL(this.props.image)});
	}

	componentWillReceiveProps(props){
		URL.revokeObjectURL(this.state.url);
		this.setState({url: URL.createObjectURL(props.image)});
	}

	componentWillUnmount(){
		URL.revokeObjectURL(this.state.url);
	}

	render(){
		return (
			<img src={this.state.url} />
		);
	}
}
