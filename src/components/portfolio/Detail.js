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
		justifyContent:'left'
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
						<Typography type = 'caption'>Security deposit</Typography>
					</div>
					{trade.type[0]==='buying' && <div className = {classes.item}>+</div>}
					{trade.type[0]==='buying' && <div className = {classes.item}>
						<Typography component = 'span'><Bitcoin />{trade.amount}</Typography>
						<Typography type = 'caption'>Purchased amount</Typography>
					</div>}
				</Paper>
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.get('move_funds_to_bisq_wallet',{
								trade_id:trade.id
							}).then((data)=>{
								console.error(data);
								api.ticker();
								root('FullScreenDialogClose')()
							})

						}
					}>Move funds to my Bisq BTC wallet</Button>
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
				<Typography gutterBottom type='title' className = {classes.top}>Please check that you have received {trade.volume} {trade.base==='BTC'?trade.counter:trade.base} from the following {trade.method} account:</Typography>
				<Paper className = {classes.paper2}><AccountDetails trade = {trade} babel = {babel} /></Paper>
				{trade.base==='BTC' && <div className = {classes.bottom}>Ensure that the trading account holder's name matches that on your statement. If not, consider cancelling and opening a support ticket</div>}
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.get('payment_received',{
								trade_id:trade.id
							}).then((data)=>{
								console.error(data);
								api.ticker();
								root('FullScreenDialogClose')()
							})

						}
					}>I have received the funds</Button>
					<Button raised onClick = {
						()=>root('FullScreenDialogClose')()
					}>Cancel</Button>
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
				<Typography gutterBottom type='title' className = {classes.top}>Please deposit {trade.volume} {trade.base==='BTC'?trade.counter:trade.base} to the following {trade.method} account:</Typography>
				<Paper className = {classes.paper2}><AccountDetails trade = {trade} babel = {babel} /></Paper>
					{trade.base==='BTC' && <div className = {classes.bottom}>Please ensure that your account name is exactly as entered on BISQ otherwise your trading partner may open a dispute</div>}
				<div className = {classes.bottom} >
					<Button raised className = {classes.button2} color = 'accent' onClick = {
						()=>{
							api.get('payment_started',{
								trade_id:trade.id
							}).then((data)=>{
								console.error(data);
								api.ticker();
								root('FullScreenDialogClose')()
							})

						}
					}>I have completed the deposit</Button>
					<Button raised onClick = {
						()=>root('FullScreenDialogClose')()
					}>Cancel</Button>
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
		const {trade,babel} = this.props;
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
		const label = trade.type[0]==='buying'?"Seller account details":"Buyer account details";
		console.log(trade)
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
											<Typography component = 'span' color = 'primary'>For:</Typography>
											<Typography component = 'span' type='body2'>{t.volume} {t.base==='BTC'?t.counter:t.base}</Typography>
										</div>
										<Divider inset light />
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>At:</Typography>
											<Typography component = 'span' type='caption' >{t.price} {t.base==='BTC'?t.counter:t.base} / BTC</Typography>
										</div>
										<Divider inset light />
										<div className = 'cardrow'>
											<Typography component = 'span' color = 'primary'>Time ago:</Typography>
											<Typography component = 'span' type='caption'>{t.ago}</Typography>
										</div>


										<Divider light />
										<div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage===0} disabled = {t.stage!==0} dense color='primary' onClick = {
												()=>root('AlertDialog')(false,{title:'Wait for blockchain confirmation',description:`
													Please wait until deposits have reached at least one blockchain confirmation.
												`})
											}>
												Wait for blockchain confirmation&nbsp;&nbsp;{t.stage!==0 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>
										{t.type[0] ==='selling' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=1} disabled = {t.stage!==1} dense color='primary' onClick = {
												()=>root('AlertDialog')(false,{title:'Wait until payment has started',description:`
													Please wait until your trading partner has indicated that they have started the payment into your wallet or account.
												`})
											}>
												Wait until payment has started&nbsp;&nbsp;{t.stage > 1 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}
										{t.type[0] ==='buying' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=1} disabled = {t.stage!==1} dense color='accent' onClick = {
												()=>root('FullScreenDialog')('Start payment',<StartPayment trade = {t} babel = {babel} root = {root}/>)
											}>
												Start payment&nbsp;&nbsp;{t.stage > 1 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}

										{t.type[0] ==='selling' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=2} disabled = {t.stage!==2} dense color='accent' onClick = {
												()=>root('FullScreenDialog')('Confirm payment recieved',<Received trade = {t} babel = {babel} root = {root}/>)
											}>
												Confirm payment recieved&nbsp;&nbsp;{t.stage > 2 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}
										{t.type[0] ==='buying' && <div className = 'cardrow button'>
											<Button className={classes.button} raised = {t.stage <=2} disabled = {t.stage!==2} dense color='primary' onClick = {
												()=>root('AlertDialog')(false,{title:'Wait until payment arrived',description:`
													Please wait until your trading partner has indicated that your payment has arrived into their wallet or account.
											`	})
											}>
												Wait until payment arrived&nbsp;&nbsp;{t.stage > 2 && <DoneIcon color = 'primary'/>}
											</Button>
										</div>}

										<div className = 'cardrow button'>
											<Button className={classes.button} raised disabled = {t.stage!==3} dense color = 'accent' onClick = {
												()=>root('FullScreenDialog')('Move Funds',<Transfer trade = {t} babel = {babel} root = {root}/>)
											}>
												Move Funds
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
