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
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Babel from '../../resources/language/Babel.js';

const styles = theme => ({
	paper:{
		padding:theme.spacing.unit*3
	},
	row:{
		padding:theme.spacing.unit+'px 0',
		display:'flex',
		alignItems:'center',
		justifyContent:'space-between'
	},
	inline:{
		display:'inline'
	}
});

class OfferBook extends Component {
	constructor(props) {
		super(props);
		this.root = this.props.root;
		this.pair = this.root('pair_market');
		this.state = {};
	}

	getOffers = ()=>{
		this.pair = this.props.root('pair_market');
		const api = this.props.root('api');
		api.market('offers',{market:this.pair}).then((data)=>{
			this.setState({
				offers:data[Object.keys(data)[0]]
			})
		})
	}
	componentDidMount(){
		this.getOffers();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.pair!==this.props.root('pair_market')) this.getOffers();
	}
	render(){
		const {classes,root} = this.props;
		const {offers} = this.state;
		if(!offers) return null;
		//console.log(root('pair_market'))
		//const offers = this.state.offers[root('pair_market')];

		return(
			<Grid container>
				<Grid item sm={12} md ={6}>
					<Paper className = {classes.paper}>
						<Typography type='title' gutterBottom>
							<Babel cat = 'cards'>Offers to buy</Babel>
						</Typography>
						{offers.buys.map((offer,i)=>{
							return (
								<div key = {i}>
									<Divider light />
									<div className={classes.row}>
										<div>
											<Typography className={classes.inline} type = 'body2' component='span'>{offer.price*1} </Typography>
											{root('secondary_market')} / {root('primary_market')}
										</div>
										<Typography type = 'caption'>({offer.amount*1===offer.min_amount*1?offer.amount*1:offer.min_amount*1+' - '+offer.amount*1} {root('primary_market')})</Typography>
									</div>
								</div>
							)
						})}
					</Paper>
				</Grid>
				<Grid item sm={12} md ={6}>
					<Paper className = {classes.paper}>
						<Typography type='title' gutterBottom>
							<Babel cat = 'cards'>Offers to sell</Babel>
						</Typography>
						{offers.sells.map((offer,i)=>{
							return (
								<div key = {i}>
									<Divider light />
									<div className={classes.row}>
										<div>
											<Typography className={classes.inline} type = 'body2' component='span'>{offer.price*1} </Typography>
											{root('secondary_market')} / {root('primary_market')}
										</div>
										<Typography type = 'caption'>({offer.amount*1===offer.min_amount*1?offer.amount*1:offer.min_amount*1+' - '+offer.amount*1} {root('primary_market')})</Typography>
									</div>
								</div>
							)
						})}
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

OfferBook.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferBook);
