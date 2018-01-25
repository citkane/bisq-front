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
import Input, { InputLabel } from 'material-ui/Input';
import {FormControl} from 'material-ui/Form';
import Select from 'material-ui/Select';
import Babel from '../../resources/language/Babel.js';
import base from '../../resources/modules/base.js';

/*HACK - react does not want to render `<Babel /> - {somether var}` within an option tag */
	import Lang from '../../resources/language/master_lang.json';
	const C = Lang.currency;
/*END HACK */

var Charts;
var markets;
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
		this.l = base.get('market').primary_market;
		this.r = base.get('market').secondary_market;
		markets = base.get('market').markets;
		this.right = markets.right.filter((item)=>{
			return !!markets.list[this.l.toLowerCase()+'_'+item.rsymbol.toLowerCase()]
		})
	}
	state = {
		value: 0,
	};

	handleSelect = event => {
		if(event.target.name === 'primary_market'){
			this.l = event.target.value;
			this.right = markets.right.filter((item)=>{
				return !!markets.list[this.l.toLowerCase()+'_'+item.rsymbol.toLowerCase()]
			})
			this.r = this.right[0].rsymbol
		}else{
			this.r = event.target.value
		}
		var newmarket = base.get('market');
		newmarket.primary_market = this.l;
		newmarket.secondary_market = this.r;
		newmarket.pair_market = this.l.toLowerCase()+'_'+this.r.toLowerCase();

		base.set('market',newmarket,true);
	};
	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		if(!Charts) return null;
		const {classes} = this.props;
		const {value} = this.state;
		return (
			<div className={classes.root}>
				<AppBar position="static" color = 'default'>
				<Tabs value={value} onChange={this.handleChange} indicatorColor = 'primary'>
					<Tab label={
						<Babel cat = 'chrome' aria>Offer Book</Babel>
					} />
					<Tab label={
						<Babel cat = 'chrome' aria>Charts</Babel>
					} />

				</Tabs>
				</AppBar>
				<div className = {classes.selects} >
					<form autoComplete="off">
						<FormControl className={classes.select}>
							<InputLabel htmlFor="primary_market" classes = {{root:classes.label}}>
								<Babel cat = 'forms'>Primary Market</Babel>
							</InputLabel>
							<Select
								value={this.l}
								onChange={this.handleSelect}
								input={<Input name="primary_market" id="primary_market" />}
								native
							>
								{markets.left.map((item,i)=>{
									return <option value={item.lsymbol} key={i} >
										{item.lsymbol + ' - '+C[item.lname][window.ui_settings.lang]}
									</option>
								})}

							</Select>
						</FormControl>
					</form>
					<form autoComplete="off">
						<FormControl className={classes.select}>
							<InputLabel htmlFor="secondary_market">
								<Babel cat = 'forms'>Secondary Market</Babel>
							</InputLabel>
							<Select
								value={this.r}
								onChange={this.handleSelect}
								input={<Input name="secondary_market" id="secondary_market" ref = {(val)=>this.secondary_market = val}/>}
								native

							>
								{this.right.map((item,i2)=>{
									return <option value={item.rsymbol} key={i2}>
										{item.rsymbol + ' - '+C[item.rname][window.ui_settings.lang]}
									</option>
								})}
							</Select>
						</FormControl>
					</form>
				</div>
				{value === 0 && <TabContainer  className={classes.content}><OfferBook /></TabContainer>}
				{value === 1 && <TabContainer className={classes.content}><Charts /></TabContainer>}

			</div>
		);
	}
}

Market.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Market);
