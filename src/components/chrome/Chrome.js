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
import './Chrome.css'

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Hidden from 'material-ui/Hidden';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import SettingsIcon from 'material-ui-icons/Settings';
import List, {ListItem,ListItemText} from 'material-ui/List';
import SideDrawer from './SideDrawer.js';
import Bisq from '../../resources/icons/Bisq.js';
import Bitcoin from '../../resources/icons/Bitcoin.js';

import Settings from './Settings.js';
import Welcome from '../welcome/Welcome.js';
import Market from '../market/Market.js';
import Trade from '../trade/Trade.js';
import Portfolio from '../portfolio/Portfolio.js';
import Funds from '../funds/Funds.js';
import Support from '../support/Support.js';
import Babel from '../../resources/language/Babel.js';
import base from '../../resources/modules/base.js';

const drawerWidth = 240;
const styles = theme => ({
	root: {
		width: '100%',
		height: '100%',
		zIndex: 1,
		overflow: 'hidden',
		//textAlign:theme.direction==='rtl'?'right':'left',
		direction:theme.direction
	},
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		height: '100%',
		//flexDirection:theme.direction==='rtl'?'row-reverse':'row'
	},
	appBar: {
		position: 'absolute',
		//marginLeft:drawerWidth,
		//marginLeft:theme.direction==='rtl'?drawerWidth:'auto',
		//marginRight:theme.direction==='ltr'?drawerWidth:'auto',
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginRight:theme.direction==='rtl'?drawerWidth:'auto',
			marginLeft:theme.direction==='ltr'?drawerWidth:'auto'
		},
		display:'flex',
		alignItems:"center",
		flexDirection:'row',
		//flexDirection:theme.direction==='rtl'?'row-reverse':'row',
		justifyContent:'space-between',
		padding:'0 '+theme.spacing.unit*3+'px',
	},
	navIconHide: {
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	drawerHeader: theme.mixins.toolbar,
	drawerPaper: {
		width: 250,
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			position: 'relative',
			height: '100%',
		},
	},
	content: {
		overflowY: "auto",
		position:'relative',
		backgroundColor: theme.palette.background.default,
		width: '100%',
		height: 'calc(100% - 56px)',
		marginTop:'56px',
		[theme.breakpoints.up('sm')]: {
			height: 'calc(100% - 64px)',
			marginTop:'64px',
		},
	},
	drawerInner:{
		height:'100%',
		direction:theme.direction
	},
	settings:{
		display:'flex',
		alignItems:'center'
	},
	hover:{
		cursor:'pointer'
	},
	me:{
		margin:"0 "+theme.spacing.unit+"px"
	},
	menuicon:{
		display:"flex",
		alignItems:"center",
		//flexDirection:theme.direction==='rtl'?'row-reverse':'row'
	},
	price:{
		//display:"flex",
		//alignItems:"center",
		//flexDirection:theme.direction==='rtl'?'row-reverse':'row'
	},
	toolbar:{
		padding:0
	},
	logo:{
		transform:"scale(-1, 1)",
		direction:'ltr'
	}
});
class Balance extends Component{

	render(){
		const {classes} = this.props;
		var btc = <span className={classes.price}><Bitcoin />{this.props.balance}</span>
		return(
			<ListItem className='balance' aria-label={this.props.title}>
				<ListItemText primary = {btc} secondary = {this.props.title} />
			</ListItem>
		)
	}
}
Balance.propTypes = {
	classes: PropTypes.object.isRequired,
};
Balance = withStyles(styles, { withTheme: true })(Balance);

class Wallet extends Component{
	render(){
		const {wallet} = this.props;
		return(
			<List>
				<Balance balance = {wallet.available_balance} title = {<Babel cat = 'wallet'>available</Babel>} />
				<Balance balance = {wallet.reserved_balance} title = {<Babel cat = 'wallet'>reserved</Babel>} />
				<Balance balance = {wallet.locked_balance} title = {<Babel cat = 'wallet'>locked</Babel>} />
			</List>
		)
	}
}
class Chrome extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mobileOpen: false,
		};
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};

	render() {
		const {classes,theme,data,colors} = this.props;
		const screen = base.get('screen');
		const drawer = (
			<div>
				<div className={classes.drawerHeader}>
					<div className = {theme.direction==='rtl'?classes.logo:null}>
						<Bisq id = 'logo' action = {()=>base.set('screen','Welcome',true)} />
					</div>
				</div>
				<Wallet wallet = {data.wallet_detail}/>
				<Divider />
				<SideDrawer />
			</div>
		);
		return (
			<div className={classes.root}>
				<div className={classes.appFrame}>
					<AppBar className={classes.appBar}>
						<Toolbar className = {classes.toolbar}>
							<Grid container spacing = {0} alignItems = 'center'>
								<Grid item className={classes.menuicon}>
									<IconButton
									color="contrast"
									aria-label="open drawer"
									onClick={this.handleDrawerToggle}
									className={classes.navIconHide}
									>
										<MenuIcon />
									</IconButton>
									<Typography type="title" color = 'inherit'>
										<Babel cat = 'chrome'>{screen}</Babel>
									</Typography>
								</Grid>
							</Grid>
						</Toolbar>
						<div className = {classes.settings}>
							<span className = {classes.me}>{base.get('me').name}</span>
							<SettingsIcon className = {classes.hover} onClick={()=>{
								base.get('FullScreenDialog')(<Babel cat='chrome'>Settings</Babel>,<Settings colors={colors}/>)
							}}/>
						</div>

					</AppBar>
					<Hidden mdUp>
						<Drawer
							type="temporary"
							open={this.state.mobileOpen}
							className={classes.drawerInner}
							classes={{
								paper: classes.drawerPaper,
							}}
							onClose={this.handleDrawerToggle}
							ModalProps={{
								keepMounted: true, // Better open performance on mobile.
							}}
						>
							{drawer}
						</Drawer>
					</Hidden>
					<Hidden mdDown implementation="css" >
						<Drawer
							type="permanent"
							open
							className={classes.drawerInner}
							classes={{
								paper: classes.drawerPaper,
							}}
						>
							{drawer}
						</Drawer>
		            </Hidden>
					<main className={classes.content}>
						{screen === 'Welcome' && <Welcome data={data}/>}
						{screen === 'Market' && <Market data = {data}/>}
						{screen === 'Trade' && <Trade data={data}/>}
						{screen === 'Portfolio' && <Portfolio data={data}/>}
						{screen === 'Funds' && <Funds data={data}/>}
						{screen === 'Support' && <Support data={data}/>}
					</main>
				</div>
			</div>
		);
	}
}
Chrome.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(Chrome);
