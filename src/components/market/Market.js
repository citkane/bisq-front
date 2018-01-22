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
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import OfferBook from './OfferBook.js';
//import Charts from './Charts.js';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import market from '../../resources/modules/markets.js';
console.error(market)


var Charts;
import('./Charts.js').then((charts)=>{
	Charts = charts.default;
})

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	content: {
		backgroundColor: theme.palette.background.paper,
		width: '100%',
		height: '100%',
		padding: theme.spacing.unit * 3,
	},
	selects:{
		padding:theme.spacing.unit*3,
		display:"flex"
	},
	select:{
		minWidth:200,
		marginRight:theme.spacing.unit
	},
	label:{
		minWidth:200
	}
});

class Market extends Component {
	constructor(props) {
		super(props);
		this.root = this.props.root;
		this.l = this.root('primary_market');
		this.r = this.root('secondary_market');

		this.right = market.right.filter((item)=>{
			return !!market.list[this.l.toLowerCase()+'_'+item.rsymbol.toLowerCase()]
		})
	}
	state = {
		value: 0,
	};

	handleSelect = event => {
		if(event.target.name === 'primary_market'){
			this.l = event.target.value;
			this.right = market.right.filter((item)=>{
				return !!market.list[this.l.toLowerCase()+'_'+item.rsymbol.toLowerCase()]
			})
			this.r = this.right[0].rsymbol
		}else{
			this.r = event.target.value
		}
		this.root("primary_market",this.l);
		this.root("secondary_market",this.r);
		var pair = this.l.toLowerCase()+'_'+this.r.toLowerCase();
		this.root('pair_market',pair);


		//var l = event.target.name === 'primary_market'?event.target.value:this.root('primary_market').toLowerCase();
		//var r = event.target.name === 'secondary_market'?event.target.value:this.root('secondary_market').toLowerCase();
		//this.root('pair_market',l+'_'+r);
	};
	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		if(!Charts) return null;
		const {classes,babel,data,root} = this.props;
		const {value} = this.state;
		return (
			<div className={classes.root}>
				<AppBar position="static" color = 'default'>
				<Tabs value={value} onChange={this.handleChange} indicatorColor = 'primary'>
					<Tab label={babel('Offer Book',{type:'span',category:'chrome',aria:true})} />
					<Tab label={babel('Charts',{type:'span',category:'chrome',aria:true})} />

				</Tabs>
				</AppBar>
				<div className = {classes.selects} >
					<form autoComplete="off">
						<FormControl className={classes.select}>
							<InputLabel htmlFor="primary_market" classes = {{root:classes.label}}>{babel('Primary Market',{category:'forms'})}</InputLabel>
							<Select
								value={this.l}
								onChange={this.handleSelect}
								input={<Input name="primary_market" id="primary_market" />}
								native
							>
								{market.left.map((item,i)=>{
									return <option value={item.lsymbol} key={i}>{item.lsymbol} - {babel(item.lname,{category:'currency'})}</option>
								})}

							</Select>
						</FormControl>
					</form>
					<form autoComplete="off">
						<FormControl className={classes.select}>
							<InputLabel htmlFor="secondary_market">{babel('Secondary Market',{category:'forms'})}</InputLabel>
							<Select
								value={this.r}
								onChange={this.handleSelect}
								input={<Input name="secondary_market" id="secondary_market" ref = {(val)=>this.secondary_market = val}/>}
								native

							>
								{this.right.map((item,i2)=>{
									return <option value={item.rsymbol} key={i2}>{item.rsymbol} - {babel(item.rname,{category:'currency'})}</option>
								})}
							</Select>
						</FormControl>
					</form>
				</div>
				{value === 0 && <TabContainer  className={classes.content}><OfferBook root={root} babel={babel}/></TabContainer>}
				{value === 1 && <TabContainer className={classes.content}><Charts root={root} babel={babel}/></TabContainer>}

			</div>
		);
	}
}

Market.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Market);
