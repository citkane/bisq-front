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
import base from './resources/modules/base.js';

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
		var def = {
			lang:"en",
			langDir:"ltr",
			screen:"Welcome",
			api:api,
			socket:socket,
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
		this.state = {
			Global:def,
			theme:this.makeTheme(def.langDir,def.color,def.theme)
		}
	}
	/*
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
	*/
	makeTheme = (dir,color,theme) =>{
		var out = createMuiTheme({
			direction:dir,
			palette: {
				primary: Colors[color],
				secondary:pink,
				type:theme
			},
			status: {
				danger: 'orange',
			},
		})
		console.log('Theme',out);
		return out;
	}

	componentDidMount(){
		var log;
		socket.on('ticker',(data)=>{
			if(data.error){
				console.error(data.error);
				return;
			}
			if(!log){
				Object.keys(data).forEach(function(key){
					console.log(key,data[key]);
					console.log('');
				})
				log = true;
			}
			this.setState({
				data:data,
				ready_data:true
			});
		})
		api.ticker();

		socket.once('getSettings',(data)=>{
			console.warn(data)
			var G = this.state.Global
			Object.keys(data).forEach((key)=>{
				if(key === 'lang') window.ui_settings.lang = data[key];
				G[key] = data[key];
			})
			base.make(this,this.state.Global);
			base.set('api',api);

			this.setState({
				Global:G,
				theme:this.makeTheme(G.langDir,G.color,G.theme),
				ready_settings:true
			})
		})
		socket.emit('getSettings');
	}
	render() {

		if(!this.state.ready_data || !this.state.ready_settings) return(
			<div>
				Connecting to backend at port:{process.env.SERVER_PORT}
			</div>
		);
		return (
			<MuiThemeProvider theme={this.state.theme}>
				<Chrome data = {this.state.data} colors = {colors}/>
				<FullScreenDialog />
				<AlertDialog />
			</MuiThemeProvider>
		);
	}
}

export default App;
