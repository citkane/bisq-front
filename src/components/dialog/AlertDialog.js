import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';

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
		const {babel} = this.props;
		const {action,title,description,yes,no} = this.state;
		var No = no?no:babel('close',{category:'chrome',type:'text'});
		return (
		<div>
			<Dialog
				open={this.state.open}
				onClose={()=>this.handleClose(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
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

export default AlertDialog;
