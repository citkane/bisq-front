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
		const {classes,offer,babel,data,root} = this.props;
		const open = !!anchorEl;
		const title = offer.direction === 'BUY'?babel('sell',{category:'cards'})+' BTC':babel('buy',{category:'cards'})+' BTC';
		const owner = offer.owner;

		return(
			<CardActions disableActionSpacing className = 'action'>
				{!owner &&(
					<div>
						<Chip
							avatar = {<Avatar onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose} ><FaceIcon className={classes.svgIcon} /></Avatar>}
							label={title}
							onClick={()=>root('FullScreenDialog')(title,<Forms babel = {babel} root = {root} data = {data} offer = {offer} type = {offer.direction} />)}
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
						title:babel('cancel_title',{category:'dialog',type:'text'}),
						description:babel('cancel_description',{category:'dialog',type:'text'}),
						yes:babel('yes',{category:'chrome',type:'text'}),
						no:babel('no',{category:'chrome',type:'text'})
					})}
				>
					{babel('Cancel Offer',{category:'cards'})}
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
		const {babel,data,root,dir} = this.props;
		return(
			<div>
				{dir!=='OWN' && <Create root = {root} babel = {babel} data ={data}/>}
				<Grid container spacing={16}>{trades.map(t => {

					data.currency_list.some((currency)=>{
						var curr = t.other_currency;
						if(curr === 'EUR') curr = '€';
						if(curr === 'GBP') curr = '£';
						console.log(curr,currency.symbol.trim())
						if(curr === currency.symbol.trim()){
							t.currency = currency;
							return true;
						}
						return false;
					})

					const fiat = t.currency.type === 'fiat';
					t.other_amount = fiat?t.other_amount:Math.round((1/t.other_amount)*1000000000000)/1000000000000;
					var title;
					if(dir === 'OWN'||t.owner){
						title = babel('You want to '+t.direction.toLowerCase(),{category:'cards'});
					}else{
						title = babel(t.direction==='BUY'?'sell':'buy',{category:'cards'});
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
										<Typography component = 'span' color = 'primary'>{babel('market',{category:'cards'})+': '}</Typography>
										<Typography component = 'span'>{t.other_currency}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography color = 'primary'>{babel('price',{category:'cards'})+' / 1 BTC: '}</Typography>
										{t.price_detail.use_market_price && (
											<span>
												<Typography>({fiat?t.price_detail.market_price_margin*100:t.price_detail.market_price_margin*-100}%) </Typography>
												<div className = 'spacer'></div>
												<Typography type="body2" > {t.other_amount}</Typography>
											</span>
										)}
										{!t.price_detail.use_market_price && <Typography type="body2" > {t.other_amount}</Typography>}
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>BTC: {t.min_btc_amount!==t.btc_amount && "(min|max)"}</Typography>
										<Typography component = 'span'>{t.min_btc_amount!==t.btc_amount && t.min_btc_amount+' | '}{t.btc_amount}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>{t.other_currency} {babel('cost',{category:'cards'})}: {t.min_btc_amount!==t.btc_amount && "(min|max)"} </Typography>
										<Typography component = 'span'>{t.min_btc_amount!==t.btc_amount && (Math.round(t.other_amount*t.min_btc_amount*100))/100 +' | '} {(Math.round(t.other_amount*t.btc_amount*100))/100}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>{babel('payment method',{category:'cards'})+': '}</Typography>
										<Typography component = 'span'>???</Typography>
									</div>
									<Divider inset light />
									<Action babel = {babel} root = {root} offer = {t} data = {data}/>
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
