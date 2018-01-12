import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import ExpansionPanel, {ExpansionPanelDetails,ExpansionPanelSummary} from 'material-ui/ExpansionPanel';
import {FormControlLabel,FormGroup,FormControl} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

const styles = theme => ({
	wrapper:{
		display:'flex',
		alignItems:'center',
		marginBottom:theme.spacing.unit*3
	},
	button:{
		marginRight:theme.spacing.unit
	},
	stepper:{
		backgroundColor:theme.palette.background.default,
	},
	paper:{
		padding:theme.spacing.unit * 2,
		paddingBottom:theme.spacing.unit * 3,
		margin:theme.spacing.unit,
		marginBottom:theme.spacing.unit * 3,
		display:"flex",
		alignItems:"center",
		flexWrap:"wrap"
	},
	paper2:{
		padding:theme.spacing.unit*2,
		paddingBottom:theme.spacing.unit*3,
		margin:theme.spacing.unit,
		marginBottom:theme.spacing.unit*3,
	},
	row:{
		display:"flex",
		alignItems:"center",
		flexWrap:"wrap",
		marginBottom:theme.spacing.unit*3,
	},
	formControl:{
		minWidth:'150px',
		marginRight:theme.spacing.unit
	},
	formControl2:{
		minWidth:'300px',
		marginRight:theme.spacing.unit
	},
	actionsContainer: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit,
	},
	spacer:{
		marginBottom: theme.spacing.unit*3,
	},
	label:{
		whiteSpace:'nowrap',
	},
	panels:{
		margin:theme.spacing.unit,
		marginBottom:theme.spacing.unit * 3
	}
})
class Form extends Component {
	constructor(props){
		super(props);
		this.currency = [];
		this.accounts = this.props.data.account_list.map((ac)=>{
			var type = ac.payment_method_details.contractData.paymentMethodId;
			var fiat = type==='BLOCK_CHAINS'?false:true;
			var currency = ac.trade_currencies[0];
			if(this.currency.indexOf(currency) === -1) this.currency.push(currency)
			type = fiat?type:currency;
			return {
				id:ac.payment_account_id,
				name:ac.account_name,
				type:type,
				pair:fiat?'BTC_'+currency:currency+'_BTC',
				currency:currency,
				fiat:fiat
			}
		});

		this.state = {
			activeStep:0,
			accountId:this.accounts[0].id,
			account:this.accounts[0],
			currency:this.currency[0],
			priceType:'PERCENTAGE',
			min_amount:"",
			amount:"",
			fixed:"",
			percent:""
		}
	}

	handleAccount = name => event => {
		var account;
		if(name === 'currency'){
			this.accounts.some((ac)=>{
				if(event.target.value === ac.currency){
					account = ac;
					return true;
				}
				return false;
			})
			this.setState({
				[name]:event.target.value,
				account:account,
				accountId:account.id
			});
		}else if(name === 'accountId'){
			this.accounts.some((ac)=>{
				if(event.target.value === ac.id){
					account = ac;
					return true;
				}
				return false;
			})
			this.setState({
				[name]:event.target.value,
				account:account,
			});
		}else{
			this.setState({
				[name]:event.target.value,
			});
		}
	};
	handleNext = () => {
		this.setState({
			activeStep: this.state.activeStep + 1,
		});
	};

	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		});
	};
	setVol = (event,min) => {
		var val;
		if(event.target.value === '0.'||event.target.value === '.'){
			val = '0.'
		}else{
			val = event.target.value.length?event.target.value:""
		}
		if(val*1 && val*1 > this.limit.max) val = this.limit.max.toString()
		if(val*1 && val*1 < this.limit.min) val = this.limit.min.toString()

		if(!min) this.setState({
			amount:val
		})
		if(min) this.setState({
			min_amount:val
		})
	};
	setPrice = (event,percent) => {

		if(!percent) this.setState({
			fixed:event.target.value
		})
		if(percent){
			this.setState({
				percent:event.target.value,
			})
		}
	};
	valid = () =>{
		if(!this.state.amount.length && !this.state.min_amount.length) return false;
		if((this.state.amount.length && this.state.min_amount.length) && this.state.amount*1 < this.state.min_amount*1) return false;
		if(this.state.priceType === 'PERCENTAGE'){
			if(!this.state.percent.length || this.state.percent*1 > 10 || this.state.percent*1 < -10) return false;
		}else{
			if(!this.state.fixed.length) return false;
		}
		return true;
	}
	submit = () =>{
		var tools = this.props.root('tools');
		var fixed = 0;
		if(this.state.priceType === 'FIXED') fixed = this.state.account.fiat?this.state.fixed*10000:Math.floor(100000000/this.state.fixed)
		var percent = (this.state.percent*1)/100;
		if(!this.state.account.fiat) percent = percent*-1
		var data = {
			payment_account_id:this.state.account.id,
			direction:this.props.dir,
			price_type:this.state.priceType,
			market_pair:this.state.account.pair,
			percentage_from_market_price:percent,
			fixed_price:fixed,
			amount:tools.toSatoshi(this.state.amount*1||this.state.min_amount*1),
			min_amount:tools.toSatoshi(this.state.min_amount*1||this.state.amount*1)
		}

		var api = this.props.root('api');
		api.get('offer_make',data).then((data)=>{

			if(data === true){
				api.ticker();
				this.props.root('FullScreenDialogClose')();
			}else{
				console.log(data)
			}
		})
	}
	handlePanel = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false,
		});
	};
	consent = () =>{
		this.setState({
			accepted:this.state.accepted?false:true
		})
	}
	render(){
		const {dir,classes,babel} = this.props;
		function getSteps() {
			return [
				babel('Select your trade account',{category:'forms'}),babel('Set your trade amount and price',{category:'forms'}),babel('Confirm and publish',{category:'forms'})
			];
		}
		const steps = getSteps();
		const {activeStep,expanded} = this.state;
		const fiat = this.state.account.fiat
		this.limit = {
			min:0.001,
			max:fiat?0.1875:1
		}
		const getStepContent = (step) => {
			switch (step) {
				case 0:
					return(
						<Paper className = {classes.paper}>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="currency" shrink>{babel('Select currency',{category:'forms'})}</InputLabel>
								<Select

									native
									value={this.state.currency}
									onChange={this.handleAccount('currency')}
									input={<Input id="currency" />}
								>
									{this.currency.map((c,i)=>{
										return <option value={c} key = {i}>{c}</option>
									})}
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="account_list" shrink>{babel('Select account',{category:'forms'})}</InputLabel>
								<Select
									native
									value={this.state.accountId}
									onChange={this.handleAccount('accountId')}
									input={<Input id="account_list" />}
								>
									{this.accounts.filter((ac)=>{
										return this.state.currency === ac.currency;
									}).map((ac,i)=>{
										return <option value={ac.id} key = {i}>{ac.type}: {ac.name.replace(ac.type+':','').replace(ac.type,'').trim()}</option>
									})}
								</Select>
							</FormControl>
						</Paper>
					)
				case 1:
					var proceed = this.state.amount*1||this.state.min_amount*1;
					if(this.state.min_amount.length && isNaN(this.state.min_amount*1)) proceed = 0;
					if(this.state.amount.length && isNaN(this.state.amount*1)) proceed = 0;

					return(
						<Paper className = {classes.paper2}>
							<div className = {classes.row}>
								<form noValidate autoComplete="off" className={classes.formControl2}>
									<TextField
										id="min_amount"
										label = {dir==='SELL'?babel('Min BTC to sell',{category:'forms'}):babel('Min BTC to buy',{category:'forms'})}
										InputLabelProps = {{className:classes.formControl2}}
										value={this.state.min_amount}
										onChange={(e)=>this.setVol(e,true)}
										className={classes.item}
										helperText={'min: '+this.limit.min+' BTC'}
										margin="normal"
									/>
								</form>
								<form noValidate autoComplete="off" className={classes.formControl2}>
									<TextField
										id="amount"
										label = {dir==='SELL'?babel('BTC to sell',{category:'forms',type:'text'}):babel('BTC to buy',{category:'forms',type:'text'})}
										value={this.state.amount}
										onChange={(e)=>this.setVol(e)}
										className={classes.item}
										helperText={'max: '+this.limit.max+' BTC'}
										margin="normal"
										classes={{input:classes.formControl2}}
									/>
								</form>
							</div>
							{proceed > 0 && <Divider light className={classes.spacer}/>}
							{proceed > 0 && (
								<div>
									<div className = {classes.row}>

										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="priceType">{babel('Price type',{category:'forms'})}</InputLabel>
											<Select
												native
												defaultValue = {this.state.priceType}
												onChange={this.handleAccount('priceType')}
												input={<Input id="priceType" />}
											>
												<option value='PERCENTAGE' key = '2'>{babel('Percentage from market average',{category:'forms'})}</option>
												<option value='FIXED' key = '1'>{babel('Fixed price',{category:'forms'})}</option>
											</Select>

										</FormControl>
									</div>
									<Divider light className={classes.spacer}/>
									<div className = {classes.row}>
										{this.state.priceType==='PERCENTAGE' && <form noValidate autoComplete="off" className={classes.formControl}>
											<TextField
												id="percent"
												required
												label = {babel("Percentage variation",{category:'forms'})}
												defaultValue={this.state.percent}
												onChange={(e)=>this.setPrice(e,true)}
												labelClassName={classes.label}
												helperText='min -10 max 10 (%)'
											/>
										</form>}
										{this.state.priceType==='FIXED' && <form noValidate autoComplete="off" className={classes.formControl}>
											<TextField
												id="fixed"
												required
												label = {babel('Price in',{category:'forms'})+' '+this.state.currency}
												defaultValue={this.state.fixed}
												onChange={(e)=>this.setPrice(e)}
												className={classes.item}
												helperText={babel('Fixed price for one BTC',{category:'forms'})+' ('+this.state.currency+')'}
											/>
										</form>}
									</div>
								</div>
							)}
						</Paper>
					)
				case 2:
					var min = this.state.min_amount||this.state.amount;
					var max = this.state.amount||this.state.min_amount;
					return (
						<div>
							<Paper className = {classes.paper2}>
								<Typography type = 'title'>
									{babel('Offer to '+dir,{category:'forms'})} {min!==max && min+' - '} {max} BTC @ {this.state.priceType === 'PERCENTAGE' && this.state.percent+'% '+this.state.currency+' market.'} {this.state.priceType === 'FIXED' && this.state.fixed+' '+this.state.currency+' / BTC'}

								</Typography>
							</Paper>
							<div className={classes.panels}>
								<ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handlePanel('panel1')}>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography type = 'body2' color = 'primary'>{babel('terms_title1',{category:'help',type:'text'})}</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>{babel('terms_text1',{category:'help',type:'text'})}</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handlePanel('panel2')}>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography type = 'body2' color = 'primary'>{babel('terms_title2',{category:'help',type:'text'})}</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>{babel('terms_text2',{category:'help',type:'text'})}</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handlePanel('panel3')}>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography type = 'body2' color = 'primary'>{babel('terms_title3',{category:'help',type:'text'})}</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>{babel('terms_text3',{category:'help',type:'text'})}</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							</div>
							<Paper className = {classes.paper}>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={this.state.accepted}
												onChange={this.consent}
											/>
										}
										label={babel("acknowledge terms",{category:'forms'})}
									/>
								</FormGroup>
							</Paper>
						</div>
					)
				default:
			}
		}
		return (
			<div>
				<Stepper activeStep={activeStep} orientation="vertical" className = {classes.stepper}>
					{steps.map((label, index) => {
						return (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
								<StepContent>
									{getStepContent(index)}
									<div className={classes.actionsContainer}>
										<div>
											<Button
												disabled={activeStep === 0}
												onClick={this.handleBack}
												className={classes.button}
											>
												{babel('back',{category:'chrome',type:'text'})}
											</Button>
											{activeStep !== steps.length - 1 &&
												<Button
													raised
													color="primary"
													onClick={this.handleNext}
													className={classes.button}
													disabled = {activeStep === 1 && !this.valid()}
												>
													{babel('next',{category:'chrome',type:'text'})}
												</Button>
											}
											{activeStep === steps.length - 1 &&
												<Button
													raised
													color="primary"
													onClick={this.submit}
													className={classes.button}
													disabled = {!this.state.accepted}
												>
													{babel('Submit your offer to '+dir,{category:'forms'})}
												</Button>
											}
										</div>
									</div>
								</StepContent>
							</Step>
						);
					})}
				</Stepper>
			</div>
		)
	}
}
Form.propTypes = {
  classes: PropTypes.object.isRequired,
};
Form = withStyles(styles)(Form);

class Create extends Component {
	render(){
		const {classes,babel,root,data} = this.props;
		return (
			<div className = {classes.wrapper}>
				<Button className = {classes.button} raised dense color = 'primary' onClick = {()=>root('FullScreenDialog')('Create offer to sell',<Form dir = 'SELL' root={root} babel = {babel} data = {data}/>)}>
					{babel('Create offer to sell BTC',{category:'chrome'})}
				</Button>
				<Button className = {classes.button} raised dense color = 'primary' onClick = {()=>root('FullScreenDialog')('Create offer to buy',<Form dir = 'BUY' root={root} babel = {babel} data = {data}/>)}>
					{babel('Create offer to buy BTC',{category:'chrome'})}
				</Button>
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={root('showown')}
								onChange={(event,checked) => root('showown',checked)}
							/>
						}
						label={babel("Show your own offers?",{category:'chrome'})}
					/>
				</FormGroup>
			</div>
		)
	}
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Create);
