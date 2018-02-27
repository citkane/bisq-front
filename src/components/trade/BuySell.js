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
import base from '../../resources/modules/base.js';


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
		var api = base.get('api')
		api.delete('offers/offerCancel',{
            offerId:id
		}).then(function(data){
			api.ticker();
		})
	}
	render(){
		const {anchorEl} = this.state;
		const {classes,offer,data} = this.props;
		const open = !!anchorEl;
		var active = base.get('active_market').symbol;

		/*TODO add translations for all active_market posibilities */
		const title = offer.direction === 'BUY'?
			<Babel cat = 'chrome'>{"Sell "+active}</Babel>:
			<Babel cat = 'chrome'>{"Buy "+active}</Babel>
		const owner = offer.isMyOffer;

		return(
			<CardActions disableActionSpacing className = 'action'>
				{!owner &&(
					<div>
						<Chip
							avatar = {<Avatar onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose} ><FaceIcon className={classes.svgIcon} /></Avatar>}
							label={title}
							onClick={()=>base.get('FullScreenDialog')(title,<Forms data = {data} offer = {offer} type = {offer.direction} />)}
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
							<Typography>{offer.makerNodeAddress}</Typography>
						</Popover>
					</div>
				)}
				{owner && <Button raised color="accent" className={classes.button} onClick = {
					()=>base.get('AlertDialog')(()=>this.reject(offer.id),
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
			offers:this.getList(this.props.data.offers_list),
		}
	}
	getList = (offers_list) =>{

		let data = offers_list.filter((offer)=>{
			if(this.props.dir==='OWN'){
				return offer.isMyOffer;
			}else if(!base.get('showown') && offer.isMyOffer){
                return false;
			}else{
				return offer.direction === this.props.dir;
			}
		});
		data.sort(function(a,b){
			if (a.money.price*1 < b.money.price*1) return -1;
			if (a.money.price*1 > b.money.price*1) return 1;
			return 0;
		})
		if(this.props.dir === 'BUY') data.reverse();
		return data;
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			offers:this.getList(nextProps.data.offers_list),
		})
	}

	render(){
		const {offers} = this.state;
		const {data,dir} = this.props;
		var active = base.get('active_market').symbol;

		if(!offers.length) return (
			<div>
				<Create data ={data} dir = {dir}/>
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
				<Create data ={data} dir = {dir}/>
				<Grid container spacing={16}>{offers.map(t => {
					const coin = base.get('coin')[t.currencies.currency];
					t.coin = coin;
					t.fiat = t.coin.type === 'fiat';
					const amount = t.money.price;
					var title;
					if(t.isMyOffer){
						title = <Babel cat = 'cards'>{'You want to '+t.direction.toLowerCase()}</Babel>;
					}else{
						title = <Babel cat = 'cards'>{t.direction==='BUY'?'sell':'buy'}</Babel>;
					}
					return (
						<Grid item lg={3} md = {6} sm = {6} xs = {12} key = {t.id} className = 'card'>
							<Card>
								<CardContent>
									<div className = 'cardrow'>
										<Typography type='title'>{title}</Typography>
									</div>
									<Divider light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>
											<Babel cat = 'cards'>market</Babel>:
										</Typography>
										<Typography component = 'span'>{t.currencies.currency}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography color = 'primary'>
											<Babel cat = 'cards'>price</Babel> / 1 {t.fiat?t.currencies.baseCurrency:t.currencies.counterCurrency}:
										</Typography>
										{t.money.useMarketPrice && (
											<span>
												<Typography>({t.money.marketPriceMargin}%) </Typography>
												<div className = 'spacer'></div>
												<Typography type="body2" > {coin.round(amount)}</Typography>
											</span>
										)}
										{!t.money.useMarketPrice && <Typography type="body2" > {coin.round(amount)}</Typography>}
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>{active}: {t.money.amount!==t.money.minAmount && "(min|max)"}</Typography>
										<Typography component = 'span'>{t.money.minAmount!==t.money.amount && t.money.minAmount+' | '}{t.money.amount}</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>{t.currencies.currency} <Babel cat = 'cards'>cost</Babel>: {t.money.amount!==t.money.minAmount && "(min|max)"} </Typography>
										<Typography component = 'span'>
											{t.money.minAmount!==t.money.amount && (coin.round(amount*t.money.minAmount)+' | ')}
											{coin.round(amount*t.money.amount)}
										</Typography>
									</div>
									<Divider inset light />
									<div className = 'cardrow'>
										<Typography component = 'span' color = 'primary'>
											<Babel cat = 'cards'>payment method</Babel>:
										</Typography>
										<Typography component = 'span'>{t.fiat?t.paymentMethod:t.currencies.baseCurrency}</Typography>
									</div>
									<Divider inset light />
									<Action offer = {t} data = {data}/>
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
