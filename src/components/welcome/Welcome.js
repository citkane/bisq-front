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
				<Typography gutterBottom>{babel('Welcome_p1',{category:'content'})}{document.location.origin}</Typography>
				<Typography type = 'body2'>This is a regtest demonstration with trading partners:</Typography>
				{root('peers').map((peer,i)=>{
					return(
						<div index = {i}>
							<Typography><a href = {'http://localhost:'+peer.port} target = '_blank'>{peer.name}</a></Typography>
						</div>
					)
				})}
			</div>
		)
	}
}

Welcome.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Welcome);
