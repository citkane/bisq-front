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
import Babel from '../../resources/language/Babel.js';
import base from '../../resources/modules/base.js';
import money from '../../resources/modules/markets.js';
const M = money.currencies;

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
	},
	warn:{
		color:theme.palette.secondary[500]
	},
	nowarn:{
		color:theme.palette.primary[500]
	}
})
class Form extends Component {
	constructor(props){
		super(props);
		this.accounts = this.props.data.account_list;
		this.currency = [];
		this.accounts.forEach((ac)=>{
			//Get a list of available currencies for the user
			if(this.currency.indexOf(ac.currency) === -1) this.currency.push(ac.currency)
		})
		this.base = base.get('base_market');
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
		var account = this.state.account;
		var val;
		if(event.target.value === '0.'||event.target.value === '.'){
			val = '0.'
		}else{
			val = event.target.value.length?event.target.value:""
		}
		if(val*1 && val*1 > account.limit.max) val = account.limit.max.toString()
		if(val*1 && val*1 < account.limit.min) val = account.limit.min.toString()

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
		var {priceType,account,fixed,percent,amount,min_amount} = this.state;
		const {dir} = this.props;
		const api = base.get('api');

		if(priceType === 'FIXED') fixed = account.fiat?
		M[account.currency].fromDecimal(fixed):
		M[this.base].fromDecimal(M[account.currency].invert(M[account.currency].fromDecimal(fixed)))

		var data = {
			fiat:account.fiat,
			payment_account_id:account.id,
			direction:dir,
			price_type:priceType,
			market_pair:account.pair,
			percentage_from_market_price:percent*1||0,
			amount:M[this.base].fromDecimal(amount*1||min_amount*1),
			min_amount:M[this.base].fromDecimal(min_amount*1||amount*1),
			fixed_price:fixed||0,
		}
		console.log(data);
		api.get('offer_make',data).then((data)=>{

			if(data === true){
				api.ticker();
				base.get('FullScreenDialogClose')();
			}else{
				console.error(data)
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
		const {dir,classes} = this.props;
		const {activeStep,expanded,account,amount,min_amount,currency,accountId,priceType,percent,fixed,accepted} = this.state;
		const steps = [
			<Babel cat = 'forms'>Select your trade account</Babel>,
			<Babel cat = 'forms'>Set your trade amount and price</Babel>,
			<Babel cat = 'forms'>Confirm and publish</Babel>
		];

		const fiat = account.fiat
		const getStepContent = (step) => {
			switch (step) {
				case 0:
					return(
						<Paper className = {classes.paper}>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="currency" shrink>
									<Babel cat = 'forms'>Select currency</Babel>
								</InputLabel>
								<Select

									native
									value={currency}
									onChange={this.handleAccount('currency')}
									input={<Input id="currency" />}
								>
									{this.currency.map((c,i)=>{
										return <option value={c} key = {i}>{c}</option>
									})}
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="account_list" shrink>
									<Babel cat = 'forms'>Select account</Babel>
								</InputLabel>
								<Select
									native
									value={accountId}
									onChange={this.handleAccount('accountId')}
									input={<Input id="account_list" />}
								>
									{this.accounts.filter((ac)=>{
										return currency === ac.currency;
									}).map((ac,i)=>{
										return <option value={ac.id} key = {i}>{ac.type}: {ac.name}</option>
									})}
								</Select>
							</FormControl>
						</Paper>
					)
				case 1:
					var proceed = amount*1||min_amount*1;
					if(min_amount.length && isNaN(min_amount*1)) proceed = 0;
					if(amount.length && isNaN(amount*1)) proceed = 0;

					return(
						<Paper className = {classes.paper2}>
							<div className = {classes.row}>
								<form noValidate autoComplete="off" className={classes.formControl2}>
									<TextField
										id="min_amount"
										label = {dir==='SELL'?
											<Babel cat = 'forms'>Min BTC to sell</Babel>:
											<Babel cat = 'forms'>Min BTC to buy</Babel>
										}
										InputLabelProps = {{className:classes.formControl2}}
										value={min_amount}
										onChange={(e)=>this.setVol(e,true)}
										className={classes.item}
										helperText={'min: '+account.limit.min+' BTC'}
										margin="normal"
									/>
								</form>
								<form noValidate autoComplete="off" className={classes.formControl2}>
									<TextField
										id="amount"
										label = {dir==='SELL'?
											<Babel cat = 'forms'>BTC to sell</Babel>:
											<Babel cat = 'forms'>BTC to buy</Babel>
										}
										value={amount}
										onChange={(e)=>this.setVol(e)}
										className={classes.item}
										helperText={'max: '+account.limit.max+' BTC'}
										margin="normal"
										classes = {{root:classes.formControl2}}
									/>
								</form>
							</div>
							{proceed > 0 && <Divider light className={classes.spacer}/>}
							{proceed > 0 && (
								<div>
									<div className = {classes.row}>

										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="priceType">
												<Babel cat = 'forms'>Price type</Babel>
											</InputLabel>
											<Select
												native
												defaultValue = {priceType}
												onChange={this.handleAccount('priceType')}
												input={<Input id="priceType" />}
											>
												<option value='PERCENTAGE' key = '2'>
													<Babel cat = 'forms'>Percentage from market average</Babel>
												</option>
												<option value='FIXED' key = '1'>
													<Babel cat = 'forms'>Fixed price</Babel>
												</option>
											</Select>

										</FormControl>
									</div>
									<Divider light className={classes.spacer}/>
									<div className = {classes.row}>
										{priceType==='PERCENTAGE' && <form noValidate autoComplete="off" className={classes.formControl}>
											<TextField
												id="percent"
												required
												label = {<Babel cat = 'forms'>Percentage variation</Babel>}
												defaultValue={percent}
												onChange={(e)=>this.setPrice(e,true)}
												labelClassName={classes.label}
												helperText='min -10 max 10 (%)'
											/>
										</form>}
										{priceType==='FIXED' && <form noValidate autoComplete="off" className={classes.formControl}>
											<TextField
												id="fixed"
												required
												label = {<span><Babel cat = 'forms'>Price in</Babel> {currency}</span>}
												defaultValue={fixed}
												onChange={(e)=>this.setPrice(e)}
												className={classes.item}
												helperText={<span><Babel cat = 'forms'>Fixed price for one BTC</Babel> ({currency})</span>}
											/>
										</form>}
									</div>
								</div>
							)}
						</Paper>
					)
				case 2:
					var min = min_amount||amount;
					var max = amount||min_amount;
					var perc = '0% '

					if(percent*1) perc = percent*1 > 0?
						<span className = {dir==='BUY'?classes.warn:classes.nowarn}>
							<span>{percent+'%'} <Babel cat = 'forms'>above</Babel> </span>
						</span>:
						<span className = {dir==='SELL'?classes.warn:classes.nowarn}>
							<span>{(percent*-1)+'%'} <Babel cat = 'forms'>below</Babel> </span>
						</span>;
					return (
						<div>
							<Paper className = {classes.paper2}>
								<Typography type = 'title'>
									<Babel cat = 'forms'>{'Offer to '+dir}</Babel> {min!==max && min+' - '}
									{max} BTC @ {priceType === 'PERCENTAGE' && perc}
									{priceType === 'PERCENTAGE' && (<span>{currency} <Babel cat = 'forms'>market</Babel></span>)}
									{priceType === 'FIXED' && fixed+' '+currency+' / BTC'}
								</Typography>
							</Paper>
							<div className={classes.panels}>
								<ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handlePanel('panel1')}>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography type = 'body2' color = 'primary'>
											<Babel cat = 'help'>terms_title1</Babel>
										</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>
											<Babel cat = 'help'>terms_text1</Babel>
										</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handlePanel('panel2')}>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography type = 'body2' color = 'primary'>
											<Babel cat = 'help'>terms_title2</Babel>
										</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>
											<Babel cat = 'help'>terms_text2</Babel>
										</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handlePanel('panel3')}>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography type = 'body2' color = 'primary'>
											<Babel cat = 'help'>terms_title3</Babel>
										</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>
											<Babel cat = 'help'>terms_text3</Babel>
										</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							</div>
							<Paper className = {classes.paper}>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={accepted}
												onChange={this.consent}
											/>
										}
										label={<Babel cat = 'forms'>acknowledge terms</Babel>}
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
												<Babel cat = 'chrome'>back</Babel>
											</Button>
											{activeStep !== steps.length - 1 &&
												<Button
													raised
													color="primary"
													onClick={this.handleNext}
													className={classes.button}
													disabled = {activeStep === 1 && !this.valid()}
												>
													<Babel cat = 'chrome'>next</Babel>
												</Button>
											}
											{activeStep === steps.length - 1 &&
												<Button
													raised
													color="primary"
													onClick={this.submit}
													className={classes.button}
													disabled = {!accepted}
												>
													<Babel cat = 'forms'>{'Submit your offer to '+dir}</Babel>
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
		const {classes,data,dir} = this.props;
		return (
			<div className = {classes.wrapper}>
				<Button className = {classes.button} raised dense color = 'primary' onClick = {()=>base.get('FullScreenDialog')(<Babel cat='chrome'>Create offer to sell</Babel>,<Form dir = 'SELL' data = {data}/>)}>
					<Babel cat = 'chrome'>Create offer to sell BTC</Babel>
				</Button>
				<Button className = {classes.button} raised dense color = 'primary' onClick = {()=>base.get('FullScreenDialog')(<Babel cat='chrome'>Create offer to buy</Babel>,<Form dir = 'BUY' data = {data}/>)}>
					<Babel cat = 'chrome'>Create offer to buy BTC</Babel>
				</Button>
				{dir !== 'OWN' && <FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={base.get('showown')}
								onChange={(event,checked) => base.set('showown',checked,true)}
							/>
						}
						label={<Babel cat = 'chrome'>Show your own offers?</Babel>}
					/>
				</FormGroup>}
			</div>
		)
	}
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Create);
