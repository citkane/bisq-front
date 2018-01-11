import React, { Component } from 'react';
import {ListItemText} from 'material-ui/List';


class Babel extends Component {
	render(){
		var string = this.props.string;
		var jsx;
		switch(this.props.type) {
			case 'span':
				this.props.aria?jsx = <span aria-label = {string}>{string}</span>:jsx = <span>{string}</span>
			break;
			case 'ListItemText':
				this.props.aria?jsx = <ListItemText aria-label = {string} primary={string} />:jsx = <ListItemText primary={string} />
			break;
			case 'text':
				jsx = {string}
			break;
			default:
			this.props.aria?jsx = <span aria-label = {string}>{string}</span>:jsx = <span>{string}</span>
		}
		return jsx;
	}
}
export default Babel;
