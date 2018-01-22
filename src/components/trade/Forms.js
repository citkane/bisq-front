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
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import ExpansionPanel, {ExpansionPanelDetails,ExpansionPanelSummary} from 'material-ui/ExpansionPanel';
import {FormControlLabel,FormGroup,FormControl,FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Select from 'material-ui/Select';

import tools from '../../resources/modules/tools.js';

const styles  = theme => ({
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
		padding:theme.spacing.unit * 2,
		paddingBottom:theme.spacing.unit * 3,
		margin:theme.spacing.unit,
		marginBottom:theme.spacing.unit * 3,
	},
	panels:{
		margin:theme.spacing.unit,
		marginBottom:theme.spacing.unit * 3
	},
	item:{
		margin:'.5em'
	},
	stepper:{
		backgroundColor:theme.palette.background.default,
	},
	button: {
		marginRight: theme.spacing.unit,
	},
	actionsContainer: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit,
	},
	resetContainer: {
		marginTop: 0,
		padding: theme.spacing.unit * 3, // TODO: See TODO note on Stepper
	},
});

class Forms extends Component {
	constructor(props){
		super(props);

		this.accounts = this.props.data.account_list.filter((ac)=>{
			console.error(this.props.offer.other_currency,ac);
			return ac.trade_currencies.indexOf(this.props.offer.other_currency)!==-1;
		}).map((ac)=>{
			return {
				id:ac.id,
				name:this.props.offer.other_currency+': '+ac.name
			}
		});
		this.state = {
			activeStep:0,
			btc:this.props.offer.btc_amount,
			accepted:false,
			expanded:null,
			account:this.accounts[0].id
		}
	}
	handleAccount = name => event => {
		this.setState({[name]:event.target.value});
	};
	handlePanel = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false,
		});
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

	setVal = (event) => {
		this.setState({
			btc:event.target.value||0
		})
	};
	consent = () =>{
		this.setState({
			accepted:this.state.accepted?false:true
		})
	}
	acceptOffer = (id) =>{
		const {root} = this.props;
		console.warn(id,this.state.account,tools.toSatoshi(this.state.btc));
		var self = this;
		root('api').get('offer_take',{
			offer_id:id,
			payment_account_id:this.state.account,
			amount:tools.toSatoshi(this.state.btc)*1
		}).then(function(data){
			console.log(data);
			if(data === true){
				//root('api').generate(1);
				self.handleNext();
			}
		})
	}
	render(){
		const {btc} = this.state;
		const {type,offer,babel,classes,root} = this.props;

		const fixed = offer.btc_amount === offer.min_btc_amount;
		const market = offer.price_detail.use_market_price;
		const deviation = offer.price_detail.market_price_margin*100;
		const fiat = offer.currency.type === 'fiat';
		const total = fiat?Math.round((btc*offer.other_amount)*100)/100:Math.round((btc*offer.other_amount)*1000000000000)/1000000000000;


		switch(type){
			case 'BUY':
			case 'SELL':
				function getSteps() {
					return [
						babel('trade_step1',{category:'forms',type:'text'}),
						type==='BUY'?babel('trade_step2',{category:'forms',type:'text'}):babel('trade_step3',{category:'forms',type:'text'}),
						babel('trade_step4',{category:'forms',type:'text'})
					];
				}
				const steps = getSteps();
				const {activeStep,expanded} = this.state;

				const getStepContent = (step) => {
					switch (step) {
						case 0:
							return(
								<Paper className = {classes.paper}>
									<form noValidate autoComplete="off">
										<TextField
											id="amount"
											required
											disabled = {fixed}
											label = {type==='BUY'?babel('Amount to sell',{category:'forms',type:'text'}):babel('Amount to buy',{category:'forms',type:'text'})}
											defaultValue={offer.btc_amount}
											onChange={this.setVal}
											className={classes.item}
											helperText={fixed?babel('Volume is fixed',{category:'forms',type:'text'}):offer.min_btc_amount+' - '+offer.btc_amount}
											margin="normal"
										/>
									</form>
									<div className = {classes.item}>x</div>
									<div className = {classes.item}>
										<Typography type = 'body1'>{offer.other_amount} {offer.other_currency}</Typography>
										<Typography type = 'caption'>{market?deviation?deviation+'% '+babel('Market average',{category:'forms',type:'text'}):babel('Market average',{category:'forms',type:'text'}):babel('Fixed price',{category:'forms',type:'text'})} </Typography>
									</div>
									<div className = {classes.item}> = </div>
									<Typography type = 'title' className = {classes.item}>{total} {offer.other_currency}</Typography>
								</Paper>
							)
						case 1:
							var fees = (tools.fees(type,btc))
							return(
								<div>
									<Typography type = 'body1'>
										{babel('Funds will be transferred',{category:'forms'})}
									</Typography>
									<Paper className = {classes.paper}>
										<div className = {classes.item}>
											<Typography type = 'body1'>{fees.security.btc}</Typography>
											<Typography type = 'caption'>{babel('Security deposit',{category:'forms'})} @{fees.security.rate}</Typography>
										</div>
										<div className = {classes.item}>+</div>
										<div className = {classes.item}>
											<Typography type = 'body1'>{fees.trading.btc}</Typography>
											<Typography type = 'caption'>{babel('Trading fee',{category:'forms'})} @{fees.trading.rate}</Typography>
										</div>
										<div className = {classes.item}>+</div>
										<div className = {classes.item}>
											<Typography type = 'body1'>{fees.mining.btc}</Typography>
											<Typography type = 'caption'>{babel('Mining fee',{category:'forms'})} @{fees.mining.rate}</Typography>
										</div>
										{type==='BUY' && <div className = {classes.item}>+</div>}
										{type==='BUY' && <div className = {classes.item}>
											<Typography type = 'body1'>{btc}</Typography>
											<Typography type = 'caption'>{babel('Trade amount',{category:'forms'})}</Typography>
										</div>}
										<div className = {classes.item}>=</div>
										<Typography type = 'title' className = {classes.item}>{fees.total.btc} BTC</Typography>
									</Paper>
									<Paper className = {classes.paper}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="account_list">{babel('Account Name',{category:'forms'})}</InputLabel>
											<Select
												native
												value={this.state.account}
												onChange={this.handleAccount('account')}
												input={<Input id="account_list" />}
											>
												{this.accounts.map((ac,i)=>{
													return <option value={ac.id} key = {i}>{ac.name}</option>
												})}
											</Select>
											{fiat && <FormHelperText>{babel('Select your fiat account for this trade',{category:'forms'})}</FormHelperText>}
											{!fiat && <FormHelperText>{babel('Select your altcoin account for this trade',{category:'forms'})}</FormHelperText>}
										</FormControl>
									</Paper>
								</div>
							)
						case 2:
						return (
							<div>
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
											label={babel('acknowledge terms',{category:'forms'})}
										/>
									</FormGroup>
								</Paper>
							</div>
						)
						default:
						return 'Unknown step';
					}
				}
				return(
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
													{activeStep !== steps.length - 1 && <Button
														raised
														color="primary"
														onClick={this.handleNext}
														className={classes.button}
													>
														{babel('next',{category:'chrome',type:'text'})}
													</Button>}
													{activeStep === steps.length - 1 && <Button
														disabled = {!this.state.accepted}
														raised
														color="primary"
														onClick = {()=>this.acceptOffer(offer.offer_id)}
														className={classes.button}
													>
														{type === 'BUY'?babel('sell',{category:'cards',type:'text'}):babel('buy',{category:'cards',type:'text'})}
													</Button>}
												</div>
											</div>
										</StepContent>
									</Step>
								);
							})}
						</Stepper>
						{activeStep === steps.length && (
							<Paper className={classes.paper2}>
								<Typography gutterBottom>{babel('accepted trade',{category:'forms'})}</Typography>
								<Button raised color='primary' onClick={root('FullScreenDialogClose')} className={classes.button}>
									{babel('Offers',{category:'forms'})}
								</Button>
								<Button raised color='primary' onClick={()=>{
									root('FullScreenDialogClose')();
									root('screen','Portfolio');
								}} className={classes.button}>
									{babel('Open Trades',{category:'forms'})}
								</Button>
							</Paper>
						)}
					</div>
				)
			default:
				return(
					<div>Forms!!</div>
				)
		}
	}
}
Forms.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Forms);
