import React, { Component } from 'react';
import './Welcome.css';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	root:{
		padding:theme.spacing.unit*3
	}
})

class Welcome extends Component {

	render(){
		const {classes,babel,root} = this.props;
		return(
			<div className = {classes.root}>
				<Typography type='title' gutterBottom color='primary'>{babel('Welcome_title',{category:'content'})}</Typography>
				<Typography>{babel('Welcome_p1',{category:'content'})}{document.location.origin}</Typography>
			</div>
		)
	}
}

Welcome.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Welcome);
