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

import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Card, {CardContent} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';
import FaceIcon from 'material-ui-icons/Person';
import DoneIcon from 'material-ui-icons/Done';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Babel from '../../resources/language/Babel.js';
import base from '../../resources/modules/base.js';

const styles = theme => ({
	svgIcon: {
		color: theme.palette.common.darkBlack,
	},
	paper: {
		padding: theme.spacing.unit,
	},
	paper2: {
		padding: theme.spacing.unit*3,
	},
	paper3: {
		padding: theme.spacing.unit*3,
		display:'flex',
		alignItems:"center",
		flexWrap:"wrap"
	},
	item:{
		margin:'.5em'
	},

	popover: {
		pointerEvents: 'none',
	},
	button:{
		width:'100%',
		//margin:".5em 0",
		justifyContent:theme.direction==='ltr'?'left':'right'
	},
	button2:{
		marginRight:theme.spacing.unit
	},
	top:{
		marginBottom:'1em'
	},
	bottom:{
		marginTop:'2em'
	}
});

class Transfer extends Component {
	render(){

		const {trade,classes} = this.props;
		const Graphic = base.get('active_market').graphic;
		const api = base.get('api');

		return (
			<div>
				<Paper className = {classes.paper3}>
					<div className = {classes.item} >
						<Typography component='span'><Graphic />{trade.deposit}</Typography>
						<Typography type = 'caption'>
							<Babel cat = 'forms'>Security deposit</Babel>
						</Typography>
					</div>
					{trade.type==='BuyerTrade' && <div className = {classes.item}>+</div>}
					{trade.type==='BuyerTrade' && <div className = {classes.item}>
						<Typography component = 'span'><Graphic />{trade.money.amount}</Typography>
						<Typography type = 'caption'>
							<Babel cat = 'forms'>Purchased amount</Babel>
						</Typography>
					</div>}
				</Paper>
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.post('trade/payment/movetobisq',{
								tradeId:trade.id
							}).then((data)=>{
								api.ticker();
								base.get('FullScreenDialogClose')()
							},(err)=>{
								console.error(err)
							})

						}
					}>
						{/*TODO add translations for all active_market posibilities */}
						<Babel cat = 'forms'>{'Move funds to my Bisq '+base.get('active_market').symbol+' wallet'}</Babel>
					</Button>
				</div>
			</div>
		)
	}
}
Transfer.propTypes = {
  classes: PropTypes.object.isRequired,
};
Transfer = withStyles(styles)(Transfer);

class Received extends Component {
	render(){
		const {trade,classes} = this.props;
		const api = base.get('api');
		var active = base.get('active_market').symbol;
		return (
			<div>
				<Typography gutterBottom type='title' className = {classes.top}>
					<Babel cat = 'forms'>Please check that you have received from the following account:</Babel> {trade.money.volume} {trade.money.code}
				</Typography>
				<Paper className = {classes.paper2}><AccountDetails trade = {trade} /></Paper>
				{trade.fiat && <div className = {classes.bottom}>
					<Babel cat = 'forms'>Ensure that the trading account holder\'s name matches that on your statement. If not, consider cancelling and opening a support ticket</Babel>
				</div>}
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.post('trade/payment/received',{
								tradeId:trade.id
							}).then((data)=>{
								api.ticker();
								base.get('FullScreenDialogClose')()
							},(err)=>{
								console.error(err)
							})

						}
					}>
						<Babel cat = 'forms'>I have received the funds</Babel>
					</Button>
					<Button raised onClick = {
						()=>base.get('FullScreenDialogClose')()
					}>
						<Babel cat = 'forms'>Cancel</Babel>
					</Button>
				</div>
			</div>
		)
	}
}
Received.propTypes = {
  classes: PropTypes.object.isRequired,
};
Received = withStyles(styles)(Received);

class StartPayment extends Component {

	render(){
		const api = base.get('api');
		const {classes,trade} = this.props;

		return (
			<div>
				<Typography gutterBottom type='title' className = {classes.top}>
					<Babel cat = 'forms'>Please deposit to the following account:</Babel> {trade.money.volume} {trade.money.code}
				</Typography>
				<Paper className = {classes.paper2}><AccountDetails trade = {trade} /></Paper>
					{trade.fiat && <div className = {classes.bottom}>
						<Babel cat = 'forms'>Please ensure that your account name is exactly as entered on BISQ otherwise your trading partner may open a dispute</Babel>
					</div>}
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{

							api.post('trade/payment/started',{
								tradeId:trade.id
							}).then((data)=>{
								api.ticker();
								base.get('FullScreenDialogClose')()
							},(err)=>{
								console.error(err)
							})

						}
					}>
						<Babel cat = 'forms'>I have completed the deposit</Babel>
					</Button>
					<Button raised onClick = {
						()=>base.get('FullScreenDialogClose')()
					}>
						<Babel cat = 'forms'>Cancel</Babel>
					</Button>
				</div>
			</div>
		)
	}
}
StartPayment.propTypes = {
  classes: PropTypes.object.isRequired,
};
StartPayment = withStyles(styles)(StartPayment);

class AccountDetails extends Component {
	render(){
		const {trade} = this.props;
		return (
			<span>
				<Typography type = 'body2' component = "span">{trade.paymentMethod}</Typography>
                {trade.peer.account.paymentDetailsForTradePopup.split("\n").map((l,i)=>{
                    return (
                        <div key = {i}>{l}</div>
                    )
                })}
			</span>
		)
	}
}


class Account extends Component{
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
	render(){
		const {classes,trade} = this.props;
		const {anchorEl} = this.state;
		const open = !!anchorEl;
		const label = trade.type === 'BuyerTrade'?
			<Babel cat = 'forms'>Seller account details</Babel>:
			<Babel cat = 'forms'>Buyer account details</Babel>
        const address = trade.peer.nodeAddress.fullAddress;
		return(
			<div>
				<Chip
					avatar = {<Avatar onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose} ><FaceIcon className={classes.svgIcon} /></Avatar>}
					label={label}
					onClick={()=>base.get('AlertDialog')(false,{title:label,description:<AccountDetails trade = {trade}/>})}
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
					<Typography>{address}</Typography>
				</Popover>
			</div>
		)
	}
}
Account.propTypes = {
  classes: PropTypes.object.isRequired,
};
Account = withStyles(styles)(Account);

class Detail extends Component {
	render(){
		const {trades,classes} = this.props;
		if(!trades.length) return(
			<Typography type = 'title'>
				<Babel cat = 'help'>You have no active trades.</Babel>
			</Typography>
		)
		const Graphic = base.get('active_market').graphic;
        const marketcoin = base.get("active_market");
        const tools = base.get("tools");
		return(
			<div>
				<Grid container spacing={16}>
					{trades.map((t,i) => {

                        const types = {
                            'sellerAsTakerTrade':['selling','taker'],
                            'buyerAsTakerTrade':['buying','taker'],
                            'sellerAsMakerTrade':['selling','maker'],
                            'buyerAsMakerTrade':['buying','maker']
                        };
                        let type;
                        if(t.type === "BuyerTrade"){
                            type = t.isMyOffer?"buyerAsMakerTrade":"buyerAsTakerTrade";
                        }else{
                            type = t.isMyOffer?"sellerAsMakerTrade":"sellerAsTakerTrade";
                        }
                        let stage = 0;
                        if (t.phase === 'DEPOSIT_CONFIRMED') stage = 1;
                        if (t.phase === 'FIAT_SENT') stage = 2;
                        if (t.phase === 'PAYOUT_PUBLISHED') stage = 3;

						return (
							<Grid item lg={3} md = {6} sm = {6} xs = {12} key = {i} className = 'card'>
								<Card>
									<CardContent>
										<div className = 'cardrow'>
											<Typography type='title'>
												<Babel cat = 'cards'>{types[type][0]}</Babel>
											</Typography>
											<Typography component = 'span' type='body2'>&nbsp;&nbsp;<Graphic />{t.money.amount}</Typography>
										</div>

										<Divider light />
										<Typography type = 'caption'>
											<Babel cat = 'cards'>{types[type][1]}</Babel>
										</Typography>
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>
												<Babel cat = 'cards'>For</Babel>
											</Typography>
											<Typography component = 'span' type='body2'>{t.money.volume} {t.money.code}</Typography>
										</div>
										<Divider inset light />
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>
												<Babel cat = 'cards'>Rate</Babel>
											</Typography>
											<Typography component = 'span' type='caption' >{t.money.price} {t.money.code} / {base.get("active_market").symbol}</Typography>
										</div>
										<Divider inset light />
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>
												<Babel cat = 'cards'>Time ago</Babel>
											</Typography>
											<Typography component = 'span' type='caption'>{tools.dateAgo(t.date)}</Typography>
										</div>


										<Divider light />
										<div className = 'cardrow button'>
											<Button className={classes.button} raised = {stage===0} disabled = {stage!== 0} dense color='primary' onClick = {
												()=>base.get('AlertDialog')(false,{
													title:<Babel cat = 'cards'>Wait for blockchain confirmation</Babel>,
													description:<Babel cat = 'cards'>Please wait until deposits have reached at least one blockchain confirmation.</Babel>
												})
											}>
												<Babel cat = 'cards'>Wait for blockchain confirmation</Babel>&nbsp;&nbsp;{stage!==0 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>
										{types[type][0] ==='selling' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {stage <=1} disabled = {stage!==1} dense color='primary' onClick = {
												()=>base.get('AlertDialog')(false,{
													title:<Babel cat = 'cards'>Wait until payment has started</Babel>,
													description:<Babel cat = 'cards'>Please wait until your trading partner has indicated that they have started the payment into your wallet or account.</Babel>
												})
											}>
												<Babel cat = 'cards'>Wait until payment has started</Babel>&nbsp;&nbsp;{stage > 1 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}
										{types[type][0] ==='buying' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {stage <=1} disabled = {stage!==1} dense color='accent' onClick = {
												()=>base.get('FullScreenDialog')(<Babel cat='chrome'>Start payment</Babel>,<StartPayment trade = {t} />)
											}>
												<Babel cat = 'chrome'>Start payment</Babel>&nbsp;&nbsp;{stage > 1 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}

										{types[type][0] ==='selling' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {stage <=2} disabled = {stage!==2} dense color='accent' onClick = {
												()=>base.get('FullScreenDialog')(<Babel cat='chrome'>Confirm payment recieved</Babel>,<Received trade = {t} />)
											}>
												<Babel cat = 'chrome'>Confirm payment recieved</Babel>&nbsp;&nbsp;{stage > 2 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}
										{types[type][0] ==='buying' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {stage <=2} disabled = {stage!==2} dense color='primary' onClick = {
												()=>base.get('AlertDialog')(false,{
													title:<Babel cat = 'cards'>Wait until payment arrived</Babel>,
													description:<Babel cat = 'cards'>Please wait until your trading partner has indicated that your payment has arrived into their wallet or account.</Babel>
												})
											}>
												<Babel cat = 'cards'>Wait until payment arrived</Babel>&nbsp;&nbsp;{stage > 2 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}

										<div className = 'cardrow button'>
											<Button className={classes.button} raised disabled = {stage!==3} dense color = 'accent' onClick = {
												()=>base.get('FullScreenDialog')(<Babel cat='chrome'>Move Funds</Babel>,<Transfer trade = {t} />)
											}>
												<Babel cat = 'chrome'>Move Funds</Babel>
											</Button>
										</div>
										<div className = 'cardrow bottom'>
											<Account trade = {t}/>
										</div>
									</CardContent>
								</Card>

							</Grid>
						)
					})}
				</Grid>
			</div>
		)
	}
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Detail);
