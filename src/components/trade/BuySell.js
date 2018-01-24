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
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';
import FaceIcon from 'material-ui-icons/Person';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Forms from './Forms.js';
import Create from './Create.js';
import Babel from '../../resources/language/Babel.js';
import money from '../../resources/modules/markets.js';
const M = money.currencies;


const styles = theme => ({
	svgIcon: {
		color: theme.palette.common.darkBlack,
	},
	paper: {
		padding: theme.spacing.unit,
	},
	popover: {
		pointerEvents: 'none',
	},
});

class Action extends Component {
	constructor(props){
		super(props);
		this.state = {
			anchorEl: null,
		}
	}
	handlePopoverOpen = event => {
		this.setState({anchorEl:event.target});
	};
	handlePopoverClose = () => {
		this.setState({anchorEl:null});
	};
	reject = (id) =>{
		var api = this.props.root('api')
		api.delete('offer_cancel',{
			offer_id:id
		}).then(function(data){
			api.ticker();
		})
	}
	render(){
		const {anchorEl} = this.state;
		const {classes,offer,data,root} = this.props;
		const open = !!anchorEl;
		const title = offer.direction === 'BUY'?
			<Babel cat = 'chrome'>Sell BTC</Babel>:
			<Babel cat = 'chrome'>Buy BTC</Babel>
		const owner = offer.owner;

		return(
			<CardActions disableActionSpacing className = 'action'>
				{!owner &&(
					<div>
						<Chip
							avatar = {<Avatar onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose} ><FaceIcon className={classes.svgIcon} /></Avatar>}
							label={title}
							onClick={()=>root('FullScreenDialog')(title,<Forms root = {root} data = {data} offer = {offer} type = {offer.direction} />)}
						/>
						<Popover
							className={classes.popover}
							classes={{
								paper: classes.paper,
							}}
							open={open}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							onClose={this.handlePopoverClose}
						>
							<Typography>{offer.offerer}</Typography>
						</Popover>
					</div>
				)}
				{owner && <Button raised color="accent" className={classes.button} onClick = {
					()=>root('AlertDialog')(()=>this.reject(offer.offer_id),
					{
						title:<Babel cat = 'dialog'>cancel_title</Babel>,
						description:<Babel cat = 'dialog'>cancel_description</Babel>,
						yes:<Babel cat = 'chrome'>yes</Babel>,
						no:<Babel cat = 'chrome'>no</Babel>
					})}
				>
					<Babel cat = 'cards'>Cancel Offer</Babel>
				</Button>}
			</CardActions>
		)
	}
}
Action.propTypes = {
  classes: PropTypes.object.isRequired,
};
Action = withStyles(styles)(Action);

class BuySell extends Component {

	constructor(props) {
		super(props);
		this.state = {
			trades:this.getList(this.props.data.offer_list),
		}
	}
	getList = (offer_list) =>{

		var data = offer_list.filter((trade)=>{
			var owner = trade.offerer.split(':')[1]*1===(process.env.SERVER_PORT*1+1);
			if(this.props.dir==='OWN'){
				return owner;
			}else if(this.props.root('showown')){
				return trade.direction === this.props.dir;
			}else{
				return trade.direction === this.props.dir && !owner
			}
		}).map((trade)=>{
			var owner = trade.offerer.split(':')[1]*1===(process.env.SERVER_PORT*1+1);
			trade.owner = owner;
			return trade;
		});
		data.sort(function(a,b){
			if (a.other_amount < b.other_amount) return -1;
			if (a.other_amount > b.other_amount) return 1;
			return 0;
		})
		if(this.props.dir === 'BUY') data.reverse();
		return data;
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			trades:this.getList(nextProps.data.offer_list),
		})
	}

	render(){
		const {trades} = this.state;
		const {data,root,dir} = this.props;
		if(!trades.length) return (
			<div>
				<Create root = {root} data ={data} dir = {dir}/>
				{dir!=='OWN' && <Typography type = 'title'>
					<Babel cat = 'help'>{'There are no offers to '+(dir==='SELL'?'buy':'sell')}</Babel>
				</Typography>}
				{dir==='OWN' && <Typography type = 'title'>
					<Babel cat = 'help'>You have no open offers</Babel>
				</Typography>}
			</div>
		)
		return(
			<div>
				<Create root = {root} data ={data} dir = {dir}/>
				<Grid container spacing={16}>{trades.map(t => {
					t.currency = M[t.other_currency];
					t.fiat = t.currency.type === 'fiat';
					const symbol = t.currency.symbol;
					const amount = t.other_amount
					var title;
					if(dir === 'OWN'||t.owner){
						title = <Babel cat = 'cards'>{'You want to '+t.direction.toLowerCase()}</Babel>;
					}else{
						title = <Babel cat = 'cards'>{t.direction==='BUY'?'sell':'buy'}</Babel>;
					}
					return (
						<Grid item lg={3} md = {6} sm = {6} xs = {12} key = {t.offer_id} className = 'card'>
							<Card>
								<CardContent>
									<div className = 'cardrow'>
										<Typography type='title'>{title}</Typography>
									</div>
									<Divider light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>
											<Babel cat = 'cards'>You have no open offers</Babel>:
										</Typography>
										<Typography component = 'span'>{t.other_currency}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography color = 'primary'>
											<Babel cat = 'cards'>price</Babel> / 1 BTC:
										</Typography>
										{t.price_detail.use_market_price && (
											<span>
												<Typography>({t.price_detail.market_price_margin}%) </Typography>
												<div className = 'spacer'></div>
												<Typography type="body2" > {M[t.other_currency].round(amount)}</Typography>
											</span>
										)}
										{!t.price_detail.use_market_price && <Typography type="body2" > {M[t.other_currency].round(amount)}</Typography>}
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>BTC: {t.min_btc_amount!==t.btc_amount && "(min|max)"}</Typography>
										<Typography component = 'span'>{t.min_btc_amount!==t.btc_amount && t.min_btc_amount+' | '}{t.btc_amount}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>{t.other_currency} <Babel cat = 'cards'>cost</Babel>: {t.min_btc_amount!==t.btc_amount && "(min|max)"} </Typography>
										<Typography component = 'span'>
											{t.min_btc_amount!==t.btc_amount && (M[t.other_currency].round(amount*t.min_btc_amount)+' | ')}
											{M[t.other_currency].round(amount*t.btc_amount)}
										</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>
											<Babel cat = 'cards'>payment method</Babel>:
										</Typography>
										<Typography component = 'span'>???</Typography>
									</div>
									<Divider inset light />
									<Action root = {root} offer = {t} data = {data}/>
								</CardContent>
							</Card>
						</Grid>
						);
					})}
				</Grid>
			</div>
		)
	}
}
BuySell.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BuySell);
