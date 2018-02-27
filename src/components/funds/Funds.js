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
import './Funds.css';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import base from '../../resources/modules/base.js';

const styles = theme => ({
	main:{
		padding:theme.spacing.unit*3
	},
	paper:{
		padding:theme.spacing.unit,
		marginBottom:theme.spacing.unit
	},
	amount:{
		display:'flex',
		alignItems:'center'
	},
	link:{
		textDecoration:'none',
		color:theme.palette.text.primary,
	}
});
class Funds extends Component {

	render(){
		const {data,classes} = this.props;
		var wallet = data.wallet_transactions_list;

		const tools = base.get('tools');
		wallet = wallet.sort((a,b)=>{
			if(a.date > b.date)return -1;
			if(a.date < b.date)return 1;
			return 0;
		})
		const Graphic = base.get('active_market').graphic;
		return(
			<div className = {classes.main}>
				{wallet.map((trans,i)=>{
					return <Paper key = {i} className = {classes.paper}>
                        <Typography>{new Date(trans.date*1).toString()}</Typography>
                        <Typography>
							<span>{trans.direction} </span>
                            <a className = {classes.link} href={'https://live.blockcypher.com/btc-testnet/tx/'+trans.address} target='_blank'>{trans.address}</a>
                        </Typography>
                        <Typography>{trans.details}</Typography>
                        <Typography>Amount: {trans.amount}</Typography>
                        <Typography>Confirmations: {trans.confirmations}</Typography>
                        <Typography>Id: {trans.id}</Typography>
					</Paper>
				})}
			</div>
		)
	}
}
Funds.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Funds);
