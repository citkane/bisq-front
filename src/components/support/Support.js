import React, { Component } from 'react';
import './Support.css';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	root:{
		padding:theme.spacing.unit*3
	}
})

class Support extends Component {

	render(){
		const {classes,babel,root} = this.props;
		return(
			<div className = {classes.root}>
				To Do
			</div>
		)
	}
}

Support.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Support);
