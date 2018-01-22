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
import './Welcome.css';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	root:{
		padding:theme.spacing.unit*3
	},
	paper:{
		marginTop:theme.spacing.unit*3,
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
				<Paper className = {classes.paper}>
					<Typography type = 'body2'>{babel('This is a regtest demonstration with trading partners:',{category:'content'})}</Typography>
					{root('peers').map((peer,i)=>{
						return(
							<div key = {i}>
								<Typography><a href = {'http://localhost:'+peer.port} target = '_blank'>{peer.name}</a></Typography>
							</div>
						)
					})}
				</Paper>
			</div>
		)
	}
}

Welcome.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Welcome);
