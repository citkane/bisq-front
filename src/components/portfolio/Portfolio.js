import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Detail from './Detail.js';
import BuySell from '../trade/BuySell.js';
import './Portfolio.css';
import tools from '../../resources/modules/tools'

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
});

class Portfolio extends Component {

	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const {classes,root,babel,data} = this.props;
		const {value} = this.state;
		const trades = data.trade_list.map(function(trade){
			return tools.formatTrade(trade)
		}).sort(function(a,b){
			return a.date < b.date?0:1
		})
		return (
			<div className={classes.root}>
				<AppBar position="static" color = 'default'>
					<Tabs value={value} onChange={this.handleChange} indicatorColor = 'primary'>
						<Tab label={babel('Open trades',{type:'text',category:'chrome'})} aria-label = {babel('Open trades',{type:'text',category:'chrome'})}/>
						<Tab label={babel('Open offers',{type:'text',category:'chrome'})} aria-label = {babel('Open offers',{type:'text',category:'chrome'})}/>
						<Tab label={babel('History',{type:'text',category:'chrome'})} aria-label = {babel('History',{type:'text',category:'chrome'})}/>
						<Tab label={babel('Failed',{type:'text',category:'chrome'})} aria-label = {babel('Failed',{type:'text',category:'chrome'})}/>
					</Tabs>
				</AppBar>
				{value === 0 && <TabContainer  className={classes.content}><Detail trades = {trades} babel = {babel} root = {root}/></TabContainer>}
				{value === 1 && <TabContainer className={classes.content}><div><BuySell dir = 'OWN' root = {root} babel = {babel} data = {data} /></div></TabContainer>}
				{value === 2 && <TabContainer  className={classes.content}><div>ToDo</div></TabContainer>}
				{value === 3 && <TabContainer className={classes.content}><div>ToDo</div></TabContainer>}
			</div>
		);
	}
}

Portfolio.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Portfolio);
