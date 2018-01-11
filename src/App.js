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

const socket = socketIOClient(s);
const api = new Api(socket);


class App extends Component {
	constructor(props) {
		super(props);
		this.root = this.root.bind(this);
		this.babel = this.babel.bind(this);

	}
	state = {
		Global:{
			lang:"en",
			screen:"Welcome",
			api:api,
			tools:tools,
			theme:'light',
			color:'teal'
		}
	}
	babel(key,opts){
		if(!opts.type) opts.type = 'span';
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
			//console.warn('"'+key+'" is not defined in Babel');
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
		this.setState({
			Global:G,
		},()=>{

			if(key === 'theme'||key === 'color') this.makeTheme();
		})
	}
	makeTheme = () =>{
		this.setState({
			theme:createMuiTheme({
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
		api.generate(1)
		this.makeTheme();
		//console.log('theme',this.theme);
		//console.log('');

		var self = this;
		var data = {};
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
	}
	render() {
		if(!this.state.data||!this.state.theme) return null;
		return (
			<MuiThemeProvider theme={this.state.theme}>
				<Chrome root = {this.root} babel = {this.babel} data = {this.state.data} colors = {colors}/>
				<FullScreenDialog root = {this.root} babel = {this.babel} />
				<AlertDialog root = {this.root} babel = {this.babel} />
			</MuiThemeProvider>
		);
	}
}

export default App;
