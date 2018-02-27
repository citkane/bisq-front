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
import Lang from './resources/language/master_lang.json';
import markets from './resources/modules/markets.js';
import Api from './resources/modules/api.js';
import tools from './resources/modules/tools.js';
import base from './resources/modules/base.js';

/*TODO create vector icons for all potential base market currencies*/
	import Bitcoin from './resources/icons/Bitcoin.js';
	const graphics = {
		Bitcoin:Bitcoin,
		Dash:Bitcoin,
		Dogecoin:Bitcoin,
		Litecoin:Bitcoin,
		fallback:Bitcoin
	}
/*END TODO*/

const Colors = {'teal':teal,'blue':blue,'purple':purple,'indigo':indigo,'cyan':cyan,'green':green,'amber':amber,'brown':brown};
const colors = ['teal','blue','purple','indigo','cyan','green','amber','brown'];
const s = document.location.protocol+'//'+document.location.hostname+':'+process.env.SERVER_PORT;
const socket = socketIOClient(s);
const api = new Api(socket);


console.log('');
console.log('process',process.env);
console.log('');

window.ui_settings = {
	lang:'en'
}

class App extends Component {
	constructor(props) {
		super(props);
		var def = {
			lang:"en",
			theme:{
				langDir:"ltr",
				theme:'light',
				color:'teal'
			},
			screen:"Welcome",
			api:api,
			socket:socket,
			tools:tools,
			Lang:Lang,
			langList:Lang.list,
			showown:true,
			coin:markets.currencies,
			market:{
				primary_market:'BTC',
				secondary_market:'USD',
				pair_market:'btc_usd'
			}
		}
		delete markets.currencies;
		def.market.markets = markets;
		this.state = {
			Global:def,
			theme:this.makeTheme(def.theme.langDir,def.theme.color,def.theme.theme)
		}
	}

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
		});
		return out;
	};

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
			var G = this.state.Global
			Object.keys(data).forEach((key)=>{
				if(key === 'lang') window.ui_settings.lang = data[key];
				if(key === 'active_market') {
					data[key] = this.state.Global.coin[data[key]];
					data[key].graphic = graphics[data[key].name]||graphics.fallback;
				}
				G[key] = data[key];
			})

			base.make(this,this.state.Global);
			base.set('api',api);
			var theme = this.makeTheme(G.theme.langDir,G.theme.color,G.theme.theme);
			console.log('base',base.get());
			console.log('');
			console.log('theme',theme);
			console.log('');
			this.setState({
				Global:G,
				theme:theme,
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
