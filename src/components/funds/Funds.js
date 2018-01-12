import React, { Component } from 'react';
import './Funds.css';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Bitcoin from '../../resources/icons/Bitcoin.js'

const styles = theme => ({
	main:{
		padding:theme.spacing.unit*3
	},
	paper:{
		padding:theme.spacing.unit,
		marginBottom:theme.spacing.unit,
		display:'flex',
		alignItems:'center',
		justifyContent:'space-between',
		flexWrap:'wrap'
	},
	amount:{
		display:'flex',
		alignItems:'center'
	},
	link:{
		textDecoration:'none',
		color:theme.palette.text.primary,
	}
})
class Funds extends Component {
	constructor(props) {
		super(props);
		this.root = this.props.root;
		this.babel = this.props.babel;
	}
	render(){
		const {root,data,classes} = this.props
		var wallet = data.wallet_tx_list;
		const tools = root('tools');
		wallet = wallet.map((trans)=>{
			var dir = trans.value > 0?'+':'-';
			trans.value = dir==='-'?trans.value*-1:trans.value;
			return {
				value:tools.toBtc(trans.value),
				height:trans.confidence.split('height')[1].split(',')[0].trim()*1000+trans.confidence.split('depth')[1].split('.')[0].trim()*1,
				dir:dir,
				fee:trans.fee > 0?tools.toBtc(trans.fee):false,
				hash:trans.hash
			}
		}).sort((a,b)=>{
			if(a.height > b.height)return -1;
			if(a.height < b.height)return 1;
			return 0;
		})
		return(
			<div className = {classes.main}>
				{wallet.map((trans,i)=>{
					return <Paper key = {i} className = {classes.paper}>
						<div className = {classes.amount}>
							<Typography component='span'>{trans.dir}</Typography>
							<Typography component='span' color = {trans.dir==='-'?'accent':'default'}><Bitcoin />{trans.value}&nbsp;</Typography>
							{trans.fee && <Typography component='span' type='caption'> (fee:{trans.fee})</Typography>}
						</div>
						<Typography type='caption'>
							<a className = {classes.link} href={'https://live.blockcypher.com/btc-testnet/tx/'+trans.hash} target='_blank'>{trans.hash}</a>
						</Typography>
					</Paper>
				})}
			</div>
		)
	}
}
Funds.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Funds);
