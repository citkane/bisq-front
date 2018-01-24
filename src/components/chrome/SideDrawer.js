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

import List, { ListItem,ListItemIcon,ListItemText} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import PublicIcon from 'material-ui-icons/Public';
import TradeIcon from 'material-ui-icons/ShoppingCart';
import FolderIcon from 'material-ui-icons/Folder';
import WalletIcon from 'material-ui-icons/AccountBalanceWallet';
import SupportIcon from 'material-ui-icons/Forum';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Babel from '../../resources/language/Babel.js';
import base from '../../resources/modules/base.js';


const styles = theme => ({
	active:{
		background:theme.palette.background.contentFrame,
		//flexDirection:theme.direction==='rtl'?'row-reverse':'row'
	},
	list:{
		//flexDirection:theme.direction==='rtl'?'row-reverse':'row'
	}
})

class SideDrawer extends Component {

	render() {
		const {classes} = this.props;
		return (
			<div>
				<List>
					<ListItem className = {base.get('screen') === 'Market'?classes.active:classes.list} button onClick = {()=>base.set('screen','Market',true)}>
						<ListItemIcon>
							<PublicIcon />
						</ListItemIcon>
						<ListItemText primary ={<Babel cat = 'chrome' aria>Market</Babel>} />
					</ListItem>
					<ListItem className = {base.get('screen') === 'Trade'?classes.active:classes.list} button onClick = {()=>base.set('screen','Trade',true)}>
						<ListItemIcon>
							<TradeIcon />
						</ListItemIcon>
						<ListItemText primary ={<Babel cat = 'chrome' aria>Trade</Babel>} />
					</ListItem>
					<ListItem className = {base.get('screen') === 'Portfolio'?classes.active:classes.list} button onClick = {()=>base.set('screen','Portfolio',true)}>
						<ListItemIcon>
							<FolderIcon />
						</ListItemIcon>
						<ListItemText primary ={<Babel cat = 'chrome' aria>Portfolio</Babel>} />
					</ListItem>
					<ListItem className = {base.get('screen') === 'Funds'?classes.active:classes.list} button onClick = {()=>base.set('screen','Funds',true)}>
						<ListItemIcon>
							<WalletIcon />
						</ListItemIcon>
						<ListItemText primary ={<Babel cat = 'chrome' aria>Funds</Babel>} />
					</ListItem>
					<ListItem className = {base.get('screen') === 'Support'?classes.active:classes.list} button onClick = {()=>base.set('screen','Support',true)}>
						<ListItemIcon>
							<SupportIcon />
						</ListItemIcon>
						<ListItemText primary ={<Babel cat = 'chrome' aria>Support</Babel>} />
					</ListItem>
				</List>
				<Divider />
			</div>
		)
	}
}
SideDrawer.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SideDrawer);
