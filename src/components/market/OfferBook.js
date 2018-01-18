import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

const styles = theme => ({
	paper:{
		padding:theme.spacing.unit*3
	},
	row:{
		padding:theme.spacing.unit+'px 0',
		display:'flex',
		alignItems:'center',
		justifyContent:'space-between'
	},
	inline:{
		display:'inline'
	}
});

class OfferBook extends Component {
	constructor(props) {
		super(props);
		this.root = this.props.root;
		this.pair = this.root('pair_market');
		this.state = {};
	}

	getOffers = ()=>{
		this.pair = this.props.root('pair_market');
		const api = this.props.root('api');
		api.market('offers',{market:this.pair}).then((data)=>{
			console.error(data[Object.keys(data)[0]]);
			this.setState({
				offers:data[Object.keys(data)[0]]
			})
		})
	}
	componentDidMount(){
		this.getOffers();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.pair!==this.props.root('pair_market')) this.getOffers();
	}
	render(){
		const {classes,babel,root} = this.props;
		const {offers} = this.state;
		if(!offers) return null;
		//console.log(root('pair_market'))
		//const offers = this.state.offers[root('pair_market')];

		return(
			<Grid container>
				<Grid item sm={12} md ={6}>
					<Paper className = {classes.paper}>
						<Typography type='title' gutterBottom>{babel('Offers to buy',{category:'cards'})}</Typography>
						{offers.buys.map((offer,i)=>{
							return (
								<div key = {i}>
									<Divider light />
									<div className={classes.row}>
										<div>
											<Typography className={classes.inline} type = 'body2' component='span'>{offer.price*1} </Typography>
											{root('secondary_market')} / {root('primary_market')}
										</div>
										<Typography type = 'caption'>({offer.amount*1===offer.min_amount*1?offer.amount*1:offer.min_amount*1+' - '+offer.amount*1} {root('primary_market')})</Typography>
									</div>
								</div>
							)
						})}
					</Paper>
				</Grid>
				<Grid item sm={12} md ={6}>
					<Paper className = {classes.paper}>
						<Typography type='title' gutterBottom>{babel('Offers to sell',{category:'cards'})}</Typography>
						{offers.sells.map((offer,i)=>{
							return (
								<div key = {i}>
									<Divider light />
									<div className={classes.row}>
										<div>
											<Typography className={classes.inline} type = 'body2' component='span'>{offer.price*1} </Typography>
											{root('secondary_market')} / {root('primary_market')}
										</div>
										<Typography type = 'caption'>({offer.amount*1===offer.min_amount*1?offer.amount*1:offer.min_amount*1+' - '+offer.amount*1} {root('primary_market')})</Typography>
									</div>
								</div>
							)
						})}
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

OfferBook.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferBook);
