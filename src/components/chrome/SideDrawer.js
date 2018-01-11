import React, { Component } from 'react';

import List, { ListItem,ListItemIcon,ListItemText} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import PublicIcon from 'material-ui-icons/Public';
import TradeIcon from 'material-ui-icons/ShoppingCart';
import FolderIcon from 'material-ui-icons/Folder';
import WalletIcon from 'material-ui-icons/AccountBalanceWallet';
import SupportIcon from 'material-ui-icons/Forum';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	active:{
		background:theme.palette.background.contentFrame
	}
})

class SideDrawer extends Component {

	render() {
		const {classes,babel,root} = this.props;
		return (
			<div>
				<List>
					<ListItem className = {root('screen') === 'Market'?classes.active:null} button onClick = {()=>root('screen','Market')}>
						<ListItemIcon>
							<PublicIcon />
						</ListItemIcon>
						<ListItemText primary ={babel('Market',{type:'span',category:'chrome',aria:true})} />
					</ListItem>
					<ListItem className = {root('screen') === 'Trade'?classes.active:null} button onClick = {()=>root('screen','Trade')}>
						<ListItemIcon>
							<TradeIcon />
						</ListItemIcon>
						<ListItemText primary ={babel('Trade',{type:'span',category:'chrome',aria:true})} />
					</ListItem>
					<ListItem className = {root('screen') === 'Portfolio'?classes.active:null} button onClick = {()=>root('screen','Portfolio')}>
						<ListItemIcon>
							<FolderIcon />
						</ListItemIcon>
						<ListItemText primary ={babel('Portfolio',{type:'span',category:'chrome',aria:true})} />
					</ListItem>
					<ListItem className = {root('screen') === 'Funds'?classes.active:null} button onClick = {()=>root('screen','Funds')}>
						<ListItemIcon>
							<WalletIcon />
						</ListItemIcon>
						<ListItemText primary ={babel('Funds',{type:'span',category:'chrome',aria:true})} />
					</ListItem>
					<ListItem className = {root('screen') === 'Support'?classes.active:null} button onClick = {()=>root('screen','Support')}>
						<ListItemIcon>
							<SupportIcon />
						</ListItemIcon>
						<ListItemText primary ={babel('Support',{type:'span',category:'chrome',aria:true})} />
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
