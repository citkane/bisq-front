/*
 * Copyright 2018 Michael Jonker (http://openpoint.ie)
 *
 * This file is part of bisq-front.
 *
 * bisq-front is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * bisq-front is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with bisq-front. If not, see <http://www.gnu.org/licenses/>.
 */

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
