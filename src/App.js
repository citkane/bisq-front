import socketIOClient from "socket.io-client";
import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Chrome from './components/chrome/Chrome.js';
import Babel from './components/babel/Babel.js';
import FullScreenDialog from './components/dialog/FullScreenDialog.js';
import AlertDialog from './components/dialog/AlertDialog.js';

import teal from 'material-ui/colors/teal';
import blue from 'material-ui/colors/blue';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import cyan from 'material-ui/colors/cyan';
import green from 'material-ui/colors/green';
import amber from 'material-ui/colors/amber';
import brown from 'material-ui/colors/brown';

import pink from 'material-ui/colors/pink';

import lang from './resources/lang.json';
import Api from './resources/modules/api.js';
import tools from './resources/modules/tools.js';

const Colors = {'teal':teal,'blue':blue,'purple':purple,'indigo':indigo,'cyan':cyan,'green':green,'amber':amber,'brown':brown};
const colors = ['teal','blue','purple','indigo','cyan','green','amber','brown'];

const s = document.location.protocol+'//'+document.location.hostname+':'+process.env.SERVER_PORT;
//console.log('process',process.env);

const socket = socketIOClient(s);
const api = new Api(socket);


var market;
socket.on('market',(data)=>{
	market = data;
	/*
	var curr = [];
	var list = market.markets.list;
	Object.keys(list).forEach((key)=>{
		if (curr.indexOf(list[key].lname)===-1) curr.push(list[key].lname)
		if (curr.indexOf(list[key].rname)===-1) curr.push(list[key].rname)
	})
	var foo = {}
	curr.forEach((v)=>{
		foo[v]={
			"en":v
		}
	})
	console.log(JSON.stringify(foo))
	*/
})


class App extends Component {
	constructor(props) {
		super(props);
		this.root = this.root.bind(this);
		this.babel = this.babel.bind(this);

	}
	state = {
		Global:{
			lang:"en",
			langDir:"ltr",
			screen:"Welcome",
			api:api,
			tools:tools,
			theme:'light',
			color:'teal',
			langList:lang.list,
			showown:true,
			primary_market:'BTC',
			secondary_market:'USD',
			pair_market:'btc_usd'
		}
	}
	babel(key,opts){
		if(!opts.type) opts.type = 'text';
		if(!opts.category || !lang[opts.category][key]){
			Object.keys(lang).some(function(key2){
				if(lang[key2][key]){
					opts.category = key2;
					return true;
				}
				return false;
			})

		}

		var string;
		if(!lang[opts.category][key]){
			console.warn('"'+key+'" is not defined in Babel');
			string = key;
		}
		if(!string) string = lang[opts.category][key][this.state.Global.lang];
		if(!string) string = lang[opts.category][key].en;
		if(opts.type === 'text') return string;
		return(
			<Babel lang={this.state.Global.lang} string = {string} category = {opts.category} type = {opts.type} aria = {opts.aria}/>
		)
	}

	root(key,val){
		if(typeof val === 'undefined') return this.state.Global[key];
		var G = this.state.Global;
		G[key] = val;
		if(key==='lang'){
			lang.list.some((l)=>{
				if(l.language === val){
					G.langDir = l.dir;
					return true;
				}
				return false;
			})
		}
		this.setState({
			Global:G,
		},()=>{
			socket.emit('settings',{
				lang:this.state.Global.lang,
				langDir:this.state.Global.langDir,
				screen:this.state.Global.screen,
				theme:this.state.Global.theme,
				color:this.state.Global.color,
				showown:this.state.Global.showown,
				primary_market:this.state.Global.primary_market,
				secondary_market:this.state.Global.secondary_market,
				pair_market:this.state.Global.pair_market
			})
			if(key === 'theme'||key === 'color'||key === 'lang') this.makeTheme();
		})

	}
	makeTheme = () =>{
		this.setState({
			theme:createMuiTheme({
				direction:this.state.Global.langDir,
				palette: {
					primary: Colors[this.state.Global.color],
					secondary:pink,
					type:this.state.Global.theme
				},
				status: {
					danger: 'orange',
				},
			})
		},()=>{
			console.log(this.state.theme);
		})
	}
	componentWillMount(){
		this.root('api',api);
	}

	componentDidMount(){
		//console.log('theme',this.theme);
		var data = {
			market:market
		};
		['currency_list','market_list'].forEach(function(command){
			socket.on(command, function(data2){
				//self.root(command,data)
				data[command] = data2
				console.log(command,data2);
				console.log('');
			});
			api.get(command);
		})
		var log;
		socket.on('ticker',(data2)=>{
			data2.market = market;
			Object.keys(data2).forEach(function(key){
				if(!log){
					console.log(key,data2[key]);
					console.log('');
				}
				data[key] = data2[key];
			})
			log = true;
			this.setState({data:data});
		})
		api.ticker();
		socket.emit('getSettings');
		socket.once('getSettings',(data)=>{
			if(data){
				console.log(data)
				var G = this.state.Global
				Object.keys(data).forEach((key)=>{
					G[key] = data[key];
				})
				this.setState({
					Global:G
				},()=>{
					this.makeTheme();
				})
			}else{
				this.makeTheme();
			}
		})
		api.market('markets').then((data)=>{
			var left = [];
			var right = [];
			var G = this.state.Global;

			data = Object.keys(data).map((key)=>{
				return data[key];
			})
			data.forEach((market)=>{
				if(left.indexOf(market.pair.split('_')[0]+' - '+market.lname)===-1) left.push(market.pair.split('_')[0]+' - '+market.lname);
				if(right.indexOf(market.pair.split('_')[1]+' - '+market.rname)===-1) right.push(market.pair.split('_')[1]+' - '+market.rname);
			})
			left = left.sort()
			right = right.sort()
			G.markets = {
				left:left,
				right:right,
				list:data
			}
			this.setState({Global:G});
		})
	}
	render() {
		if(!this.state.data||!this.state.theme) return(
			<div>
				Could not connect to backend at port:{process.env.SERVER_PORT}
			</div>
		);
		return (
			<MuiThemeProvider theme={this.state.theme}>
				<Chrome root = {this.root} babel = {this.babel} data = {this.state.data} colors = {colors}/>
				<FullScreenDialog root = {this.root} babel = {this.babel} />
				<AlertDialog root  = {this.root} babel = {this.babel} />
			</MuiThemeProvider>
		);
	}
}

export default App;
