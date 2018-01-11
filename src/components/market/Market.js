import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

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

class Market extends Component {
	constructor(props) {
		super(props);
		this.root = this.props.root;
		this.babel = this.props.babel;
	}
	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<div className={classes.root}>
				<AppBar position="static" color = 'default'>
				<Tabs value={value} onChange={this.handleChange} indicatorColor = 'primary'>
					<Tab label={this.babel('Offer Book',{type:'text',category:'chrome'})} aria-label = {this.babel('Offer Book',{type:'text',category:'chrome'})}/>
					<Tab label={this.babel('Spread',{type:'text',category:'chrome'})} aria-label = {this.babel('Spread',{type:'text',category:'chrome'})}/>
					<Tab label={this.babel('Trades',{type:'text',category:'chrome'})} aria-label = {this.babel('Trades',{type:'text',category:'chrome'})}/>
				</Tabs>
				</AppBar>
				{value === 0 && <TabContainer  className={classes.content}>To Do</TabContainer>}
				{value === 1 && <TabContainer className={classes.content}>To Do</TabContainer>}
				{value === 2 && <TabContainer className={classes.content}>To Do</TabContainer>}
			</div>
		);
	}
}

Market.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Market);
