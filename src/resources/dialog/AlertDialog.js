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

import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Babel from '../language/Babel.js';

const styles  = theme => ({
	root:{
		direction:theme.direction,
	}
})

class AlertDialog extends React.Component {
	constructor(props){
		super(props);
		this.root = this.props.root;
		this.root('AlertDialog',this.handleClickOpen);
	}
	state = {
		open: false,
	};
	handleClickOpen = (action,data) => {
		this.setState({
			open:true,
			title:data.title,
			description:data.description,
			yes:data.yes,
			no:data.no,
			action:action
		});
	};
	handleClose = (action) => {
		if(action) action();
		this.setState({
			open:false,
			title:"",
			action:null,
			description:"",
			yes:"",
			no:""
		});
	};
	render() {
		const {classes} = this.props;
		const {action,title,description,yes,no} = this.state;
		var No = no?no:<Babel cat = 'chrome'>close</Babel>;
		return (
		<div>
			<Dialog
				open={this.state.open}
				onClose={()=>this.handleClose(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className = {classes.root}
			>
				<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">{description}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={()=>this.handleClose(false)} color="accent" raised>{No}</Button>
					{yes && <Button onClick={()=>this.handleClose(action)} color="primary" autoFocus>{yes}</Button>}
				</DialogActions>
			</Dialog>
			</div>
		);
	}
}

AlertDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlertDialog);
