import React from 'react';

export default class View extends React.Component{
	render(){
		return (
			<div>
				<h1>Emote pack maker</h1>
				<div id="donate">
					<a className="topcoat-button--large" 	href="http://portfolio.whs.in.th/donate" target="_blank">Donate</a>
					<a className="topcoat-button--large" 	href="https://github.com/whs/myliveenh/tree/emotemaker" target="_blank">GitHub</a>
				</div>
			</div>
		);
	}
}
