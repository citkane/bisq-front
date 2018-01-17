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
		const {wallet,babel} = this.props;
		return(
			<List>
				<Balance balance = {wallet.available_balance} title = {babel('available',{category:'wallet',type:'text'})} />
				<Balance balance = {wallet.reserved_balance} title = {babel('reserved',{category:'wallet',type:'text'})} />
				<Balance balance = {wallet.locked_balance} title = {babel('locked',{category:'wallet',type:'text'})} />
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
		const {classes,theme,babel,root,data,colors} = this.props;
		const screen = root('screen');
		const drawer = (
			<div>
				<div className={classes.drawerHeader}>
					<div className = {theme.direction==='rtl'?classes.logo:null}>
						<Bisq id = 'logo' action = {()=>root('screen','Welcome')} />
					</div>
				</div>
				<Wallet root = {root} babel = {babel} wallet = {data.wallet_detail}/>
				<Divider />
				<SideDrawer root={root} babel={babel}/>
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
									<Typography type="title" color = 'inherit'>{babel(screen,{category:'chrome'})}</Typography>
								</Grid>
							</Grid>
						</Toolbar>
						<div className = {classes.settings}>
							<span className = {classes.me}>{root('me').name}</span>
							<SettingsIcon className = {classes.hover} onClick={()=>{
								root('FullScreenDialog')('Settings',<Settings root={root} babel = {babel} colors={colors}/>)
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
						{screen === 'Welcome' && <Welcome babel={babel} root={root} data={data}/>}
						{screen === 'Market' && <Market babel={babel} root={root} data = {data}/>}
						{screen === 'Trade' && <Trade babel={babel} root={root} data={data}/>}
						{screen === 'Portfolio' && <Portfolio babel={babel} root={root} data={data}/>}
						{screen === 'Funds' && <Funds babel={babel} root={root} data={data}/>}
						{screen === 'Support' && <Support babel={babel} root={root} data={data}/>}
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
