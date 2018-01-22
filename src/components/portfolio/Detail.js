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
import Bitcoin from '../../resources/icons/Bitcoin.js';

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

		const {trade,babel,classes,root} = this.props;
		const api = root('api');
		return (
			<div>
				<Paper className = {classes.paper3}>
					<div className = {classes.item} >
						<Typography component='span'><Bitcoin />{trade.deposit[trade.type[0]]}</Typography>
						<Typography type = 'caption'>{babel('Security deposit',{category:'forms'})}</Typography>
					</div>
					{trade.type[0]==='buying' && <div className = {classes.item}>+</div>}
					{trade.type[0]==='buying' && <div className = {classes.item}>
						<Typography component = 'span'><Bitcoin />{trade.amount}</Typography>
						<Typography type = 'caption'>{babel('Purchased amount',{category:'forms'})}</Typography>
					</div>}
				</Paper>
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.get('move_funds_to_bisq_wallet',{
								trade_id:trade.id
							}).then((data)=>{
								api.ticker();
								root('FullScreenDialogClose')()
							})

						}
					}>{babel('Move funds to my Bisq BTC wallet',{category:'forms'})}</Button>
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

		const {trade,babel,classes,root} = this.props;
		const api = root('api');
		return (
			<div>
				<Typography gutterBottom type='title' className = {classes.top}>{babel('Please check that you have received from the following account:',{category:'forms'})} ({trade.volume} {trade.base==='BTC'?trade.counter:trade.base} | {trade.method})</Typography>
				<Paper className = {classes.paper2}><AccountDetails trade = {trade} babel = {babel} /></Paper>
				{trade.base==='BTC' && <div className = {classes.bottom}>{babel('Ensure that the trading account holder\'s name matches that on your statement. If not, consider cancelling and opening a support ticket',{category:'forms'})}</div>}
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.get('payment_received',{
								trade_id:trade.id
							}).then((data)=>{
								api.ticker();
								root('FullScreenDialogClose')()
							})

						}
					}>{babel('I have received the funds',{category:'forms'})}</Button>
					<Button raised onClick = {
						()=>root('FullScreenDialogClose')()
					}>{babel('Cancel',{category:'forms'})}</Button>
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

		const {trade,babel,classes,root} = this.props;
		const api = root('api');
		return (
			<div>
				<Typography gutterBottom type='title' className = {classes.top}>{babel('Please deposit to the following account:',{category:'forms'})} ({trade.volume} {trade.base==='BTC'?trade.counter:trade.base} | {trade.method})</Typography>
				<Paper className = {classes.paper2}><AccountDetails trade = {trade} babel = {babel} /></Paper>
					{trade.base==='BTC' && <div className = {classes.bottom}>{babel('Please ensure that your account name is exactly as entered on BISQ otherwise your trading partner may open a dispute',{category:'forms'})}</div>}
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.get('payment_started',{
								trade_id:trade.id
							}).then((data)=>{
								api.ticker();
								root('FullScreenDialogClose')()
							})

						}
					}>{babel('I have completed the deposit',{category:'forms'})}</Button>
					<Button raised onClick = {
						()=>root('FullScreenDialogClose')()
					}>{babel('Cancel',{category:'forms'})}</Button>
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
				<Typography type = 'body2' component = "span">{trade.method}</Typography>
				{Object.keys(trade.account).filter((key)=>{
					return typeof(trade.account[key]) === 'string'
				}).map((key,i)=>{
					return (
						<span className = 'cardrow' key = {i}>
							<Typography index={i} color='primary' component = "span">{key}:</Typography>
							<Typography index={i} component = "span">{trade.account[key]}</Typography>
						</span>
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
		const {classes,trade,root,babel} = this.props;
		const {anchorEl} = this.state;
		const open = !!anchorEl;
		const label = trade.type[0]==='buying'?babel("Seller account details",{category:'forms'}):babel("Buyer account details",{category:'forms'});
		//console.log(trade)
		return(
			<div>
				<Chip
					avatar = {<Avatar onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose} ><FaceIcon className={classes.svgIcon} /></Avatar>}
					label={label}
					onClick={()=>root('AlertDialog')(false,{title:label,description:<AccountDetails trade = {trade} babel = {babel}/>})}
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
					<Typography>{trade.peer.hostName+':'+trade.peer.port}</Typography>
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
		const {trades,babel,root,classes} = this.props;
		return(
			<div>
				<Grid container spacing={16}>
					{trades.map((t,i) => {

						if(!t.fiat){
							/* Invert the market representation for consistent human language representation */
							Object.keys(t.invert).forEach((key)=>{
								t[key] = t.invert[key];
							})
						}

						return (
							<Grid item lg={3} md = {6} sm = {6} xs = {12} key = {i} className = 'card'>
								<Card>
									<CardContent>
										<div className = 'cardrow'>
											<Typography type='title'>{babel(t.type[0],{category:'cards',type:'text'})}</Typography>
											<Typography component = 'span' type='body2'>&nbsp;&nbsp;<Bitcoin />{t.amount}</Typography>
										</div>

										<Divider light />
										<Typography type = 'caption'>{babel(t.type[1],{category:'cards',type:'text'})}</Typography>
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>{babel('For',{category:'cards'})}:</Typography>
											<Typography component = 'span' type='body2'>{t.volume} {t.counter}</Typography>
										</div>
										<Divider inset light />
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>{babel('At',{category:'cards'})}:</Typography>
											<Typography component = 'span' type='caption' >{t.price} {t.counter} / {t.base}</Typography>
										</div>
										<Divider inset light />
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>{babel('Time ago',{category:'cards'})}:</Typography>
											<Typography component = 'span' type='caption'>{t.ago}</Typography>
										</div>


										<Divider light />
										<div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage===0} disabled = {t.stage!==0} dense color='primary' onClick = {
												()=>root('AlertDialog')(false,{title:babel('Wait for blockchain confirmation',{category:'cards'}),description:
													babel('Please wait until deposits have reached at least one blockchain confirmation.',{category:'cards'})
												})
											}>
												{babel('Wait for blockchain confirmation',{category:'cards'})}&nbsp;&nbsp;{t.stage!==0 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>
										{t.type[0] ==='selling' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=1} disabled = {t.stage!==1} dense color='primary' onClick = {
												()=>root('AlertDialog')(false,{title:babel('Wait until payment has started',{category:'cards'}),description:
													babel('Please wait until your trading partner has indicated that they have started the payment into your wallet or account.',{category:'cards'})
												})
											}>
												{babel('Wait until payment has started',{category:'cards'})}&nbsp;&nbsp;{t.stage > 1 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}
										{t.type[0] ==='buying' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=1} disabled = {t.stage!==1} dense color='accent' onClick = {
												()=>root('FullScreenDialog')('Start payment',<StartPayment trade = {t} babel = {babel} root = {root}/>)
											}>
												{babel('Start payment',{category:'chrome'})}&nbsp;&nbsp;{t.stage > 1 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}

										{t.type[0] ==='selling' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=2} disabled = {t.stage!==2} dense color='accent' onClick = {
												()=>root('FullScreenDialog')('Confirm payment recieved',<Received trade = {t} babel = {babel} root = {root}/>)
											}>
												{babel('Confirm payment recieved',{category:'chrome'})}&nbsp;&nbsp;{t.stage > 2 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}
										{t.type[0] ==='buying' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=2} disabled = {t.stage!==2} dense color='primary' onClick = {
												()=>root('AlertDialog')(false,{title:babel('Wait until payment arrived',{category:'cards'}),description:
													babel('Please wait until your trading partner has indicated that your payment has arrived into their wallet or account.',{category:'cards'})
												})
											}>
												{babel('Wait until payment arrived',{category:'cards'})}&nbsp;&nbsp;{t.stage > 2 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}

										<div className = 'cardrow button'>
											<Button className={classes.button} raised disabled = {t.stage!==3} dense color = 'accent' onClick = {
												()=>root('FullScreenDialog')('Move Funds',<Transfer trade = {t} babel = {babel} root = {root}/>)
											}>
												{babel('Move Funds',{category:'chrome'})}
											</Button>
										</div>
										<div className = 'cardrow bottom'>
											<Account trade = {t} babel = {babel} root = {root}/>
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
