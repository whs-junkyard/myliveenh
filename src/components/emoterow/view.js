import React from 'react';
import style from './style.css';

export default class View extends React.Component{
	onChange = (e) => {
		this.props.onEdit(e.target.value);
	};

	shouldComponentUpdate(nextProps, nextState){
		return nextProps.item !== this.props.item;
	}

	render(){
		return (
			<div className="emote">
				<EmoteImage image={this.props.item.image} />
				<div className="action"><button className="topcoat-button" onClick={this.props.onDelete}>x</button></div>
				<div className="text" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}><input type="text" className="topcoat-text-input" value={this.props.item.name} onChange={this.onChange} /></div>
			</div>
		);
	}
}

class EmoteImage extends React.Component{
	state = {
		url: null
	};

	shouldComponentUpdate(nextProps, nextState){
		return nextProps.image !== this.props.image || nextState.url !== this.state.url;
	}

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
