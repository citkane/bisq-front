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
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import base from '../modules/base.js';

const styles  = theme => ({
	appBar: {
		position: 'relative',
	},
	flex: {
		flex: 1,
	},
	content:{
		backgroundColor: theme.palette.background.default,
		flexGrow:1,
		padding:theme.spacing.unit * 3,
	},
	container:{
		display:'flex',
		flexDirection:'column',
		minHeight:"100%",
		direction:theme.direction
	}
});

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
	constructor(props) {
		super(props);
		base.set('FullScreenDialog',this.handleClickOpen)
		base.set('FullScreenDialogClose',this.handleClose)
	}
	state = {
		open: false,
		form:null,
		data:null,
	};

	handleClickOpen = (title,form) => {
		this.setState({
			open:true,
			form:form,
			title:title
		});
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const {classes} = this.props;
		const {form,title} = this.state;
		if(!title) return null;
		return (
			<Dialog
				fullScreen
				open={this.state.open}
				onClose={this.handleClose}
				transition={Transition}

			>
				<div className = {classes.container}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton color="contrast" onClick={this.handleClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography type="title" color="inherit" className={classes.flex}>
								{title}
							</Typography>

						</Toolbar>
					</AppBar>
					<div className = {classes.content}>{form}</div>
				</div>
			</Dialog>
		);
	}
}

FullScreenDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullScreenDialog);
