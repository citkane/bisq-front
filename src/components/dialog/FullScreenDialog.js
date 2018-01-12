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
		this.root = this.props.root;
		this.root('FullScreenDialog',this.handleClickOpen)
		this.root('FullScreenDialogClose',this.handleClose)
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
		const {classes,babel} = this.props;
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
							<Typography type="title" color="inherit" className={classes.flex}>{babel(title,{category:'chrome'})}</Typography>

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
