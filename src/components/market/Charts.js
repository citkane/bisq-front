import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import 'anychart/dist/css/anychart-ui.min.css';

function makeChart(){
	//return new Promise(function(resolve,reject){
		//import('anychart/dist/css/anychart-ui.min.css');
		//import('anychart')
		//.then((anychart) => {
			var chart = {
				stage:anychart.graphics.create(),
				chart:anychart.stock(),
				table1:anychart.data.table('x'),
				table2:anychart.data.table('x'),
				rangeSelector:anychart.ui.rangeSelector(),
			}
			chart.rangeSelector.render(chart.chart);
			chart.top = chart.chart.plot(0);
			chart.bottom = chart.chart.plot(1);
			chart.top.candlestick(chart.table1.mapAs({'open':"o",'high': "h", 'low':"l", 'close':"c"})).name("Market indicators");
			chart.top.spline(chart.table1.mapAs({'value': "m"})).name("Median Price");
			chart.bottom.column(chart.table2.mapAs({'value': "v"})).name("Volume");

			chart.top.bounds(0, 0, '100%', '75%');
			chart.bottom.bounds(0, '75%', '100%', '25%');
			return chart;
			//resolve(chart);
		//})
	//})
}



const styles = theme => ({
	paper:{
		//padding:theme.spacing.unit*3
	}
});
class Charts extends Component {
	constructor(props) {
		super(props);
		this.root = this.props.root;
		this.pair = this.root('pair_market');
		this.state = {};

	}

	getChart = (chart)=>{
		this.pair=this.props.root('pair_market')
		const api = this.props.root('api');
		chart.table1.remove();
		chart.table2.remove();

		api.market('hloc',{market:this.pair,interval:'day'}).then((data)=>{
			var D = data.map((item)=>{
				return {
					x:new Date(item.period_start*1000),
					o:item.open,
					h:item.high,
					l:item.low,
					c:item.close,
					m:(item.open*1+item.close*1)/2
				}
			})
			chart.table1.addData(D);

		})
		api.market('volumes',{market:this.pair,interval:'day'}).then((data)=>{
			var D = data.map((item)=>{
				return {
					x:new Date(item.period_start*1000),
					v:item.volume
				}
			})
			chart.table2.addData(D);
		})
	}
	componentDidMount(){
		//makeChart().then((chart)=>{
			var chart = makeChart();
			this.getChart(chart);
			ReactDOM.render(
				<AnyChart
					width='100%'
					height={600}
					instance={chart.stage}
					charts={[chart.chart]}
					id = 'chartcontainer'
				/>,
				document.getElementById('anychart')
			);
		//})
	}
	componentDidUpdate(prevProps, prevState){
		if(this.pair!==this.props.root('pair_market')) this.getChart();
	}
	render(){
		const {classes,babel,root} = this.props;
		return(
			<Paper className={classes.paper}>
				<div id='anychart'></div>
			</Paper>
		)
	}
}

Charts.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Charts);
