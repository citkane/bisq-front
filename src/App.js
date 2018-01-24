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

import socketIOClient from "socket.io-client";
import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Chrome from './components/chrome/Chrome.js';
import FullScreenDialog from './resources/dialog/FullScreenDialog.js';
import AlertDialog from './resources/dialog/AlertDialog.js';

import teal from 'material-ui/colors/teal';
import blue from 'material-ui/colors/blue';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import cyan from 'material-ui/colors/cyan';
import green from 'material-ui/colors/green';
import amber from 'material-ui/colors/amber';
import brown from 'material-ui/colors/brown';

import pink from 'material-ui/colors/pink';

import lang from './resources/language/master_lang.json';
import Api from './resources/modules/api.js';
import tools from './resources/modules/tools.js';

const Colors = {'teal':teal,'blue':blue,'purple':purple,'indigo':indigo,'cyan':cyan,'green':green,'amber':amber,'brown':brown};
const colors = ['teal','blue','purple','indigo','cyan','green','amber','brown'];

const s = document.location.protocol+'//'+document.location.hostname+':'+process.env.SERVER_PORT;
//console.log('process',process.env);

const socket = socketIOClient(s);
const api = new Api(socket);


window.ui_settings = {
	lang:'en'
}


class App extends Component {
	constructor(props) {
		super(props);
		this.root = this.root.bind(this);
		//this.babel = this.babel.bind(this);
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
			pair_market:'btc_usd',
			base_market:'BTC'
		}
	}
	/*
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
	*/
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
			//market:market
		};

		var log;
		socket.on('ticker',(data2)=>{
			if(data2.error){
				console.error(data2.error);
				return;
			}
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
				//console.log(data)
				var G = this.state.Global
				Object.keys(data).forEach((key)=>{
					if(key === 'lang') window.ui_settings.lang = data[key];
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
	}
	render() {

		if(!this.state.data||!this.state.theme) return(
			<div>
				Could not connect to backend at port:{process.env.SERVER_PORT}
			</div>
		);
		return (
			<MuiThemeProvider theme={this.state.theme}>
				<Chrome root = {this.root} data = {this.state.data} colors = {colors}/>
				<FullScreenDialog root = {this.root} />
				<AlertDialog root  = {this.root} />
			</MuiThemeProvider>
		);
	}
}

export default App;
