'use strict';

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

const path = require('path');

/*global appRoot children:true*/
/*eslint no-undef: "error"*/
global.appRoot = path.resolve(__dirname);
global.children = [];

const fs = require('fs');
const psTree = require('ps-tree');
const child = require('child_process');
const devsettings = require('./devSettings.js');
const dev = require('./server/makedev.js');
const tools = require('./src/resources/modules/tools.js');
const market = require('./server/market.js');
const express = require('express');

const production = process.env.NODE_ENV === 'production';
const headless = !process.env.DESKTOP_SESSION;

let ticker;
let Api;

process.on("uncaughtException", err => {
	console.log("got the error");
	console.error(err);
	tools.kill(children);
    process.exit(1);
});
process.on('exit',()=>{
    tools.kill(children);
    process.exit(1);
});
process.on('SIGINT',()=>{
    tools.kill(children);
    process.exit(1);
});

/* HACK - We need to get this from API as soon as it can provide enough detail */
market.make('markets').then((data)=>{
	if(data){
		console.log('> Could not connect to BISQ market api\n'+data+'\n\nMarket already on file, continuing...\n\n')
	}

	Api = require('./server/api.js');
/* END HACK */

	dev.make(devsettings.startport,false).then((port)=>{
		console.log('> Started the seednode on localhost:'+port);
		ticker = require('./server/ticker.js');
		devsettings.clients.forEach((client)=>{
			new MakeInstance(client);
		});
	});

	//dev.log(); //enable logging to console for seednode and bicoin-core

/* HACK */
},(err)=>{
	console.error('> Could not connect to BISQ market api\n'+err+'\n\nAborting...\n\n');
});
/* END HACK */

/* TODO implement twister as communication layer for support (not dispute)
devsettings.clients.forEach((client)=>{
	var {port,name,dirname,gui,react} = client;
	console.log(name,port)
	child.exec('../twister-core/twisterd -datadir='+appRoot+'/'+name+' -port='+port+' -daemon -rpcport='+(port+1))
})
return;
*/

const done = [];

function MakeInstance(client){
	let {port,name,dirname,gui,react} = client;
	if(headless) gui = false;

    const user = dev.makeuser(dirname,(port + 2),gui,devsettings.startport);
    user.stdout.on('data', function(data) {
        //console.log(data.toString());
	    if((data.indexOf('Start parse blocks:') !== -1 || data.indexOf('onBootstrapComplete') !== -1) && react && done.indexOf(name)===-1){
			done.push(name);
			console.log('\n> Started the BISQ API server '+dirname+'\nBrowse the API at http://localhost:'+(port+3)+'/swagger');
			console.log('\n> Starting the http '+(production?'production':'DEVELOPMENT')+' server for '+name+'\nBrowse to http://localhost:'+port+' to view.\n');
			makeSocket(client);
			if(production){

                const whitelist = ['localhost:' + port, client.url, client.onion];
                const app = express();
				const pub = path.join(appRoot,'build',name);
                //const allowed = whitelist[0];
                app.use(function(req,res,next){
                    const origin = req.get('host');
                    console.log("Http origin: "+origin,whitelist,whitelist.indexOf(origin));
                    if(!origin || whitelist.indexOf(origin)!==-1){
						next()
					}else{
						res.status(403).send('Blocked by CORS');
					}
				},express.static(pub));
				app.listen(port);
				return;
			}else{
                const env = tools.getEnv();
                env.PORT = port;
				env.SERVER_PORT = port+1;
                const web = child.spawn('node', ['scripts/start.js'], {env: env});
                web.stderr.on('data', (data) => {
					console.error(`stderr: ${data}`);
				});
			}
		}
		if(data.indexOf('ERROR') === 0){
			console.log('\n> BISQ API error for '+name);
			console.error(data);
		}
	});
}

/*TODO build an authorisation system */
	function Auth(){
		return true;
	}
/* END TODO */


function makeSocket(client2){
	const relay = express();
	var {port,name,dirname,gui,react} = client2;
	var settings = {
		peers:devsettings.clients.filter((client2)=>{
			return (client2.react && port!==client2.port)
		}),
		me:client2,

	/*TODO implement base market switching and automated API restart */
		base_markets:['BTC','DOGE','DASH','LTC'],
		active_market:'BTC'
	/*END TODO*/
	};

	const http = require('http').Server(relay);
	const io = require('socket.io')(http);

	var allowed = [
	    'http://localhost:'+port,
        'http://'+client2.url,
        'http://'+client2.onion,
        'https://localhost:'+port,
        'https://'+client2.url,
        'https://'+client2.onion,
        'https://localhost:'+port
    ];
	io.origins((origin, callback) => {
        console.log("Origin: "+origin);
		if (allowed.indexOf(origin) === -1) {
			return callback('origin not allowed', false);
		}
		callback(null, true);
	});

	io.on('connection', function(socket){
		console.log('> '+name+' connected via websocket on localhost:'+(port+1));
		var api = new Api(socket,port+3);
		//socket.emit('market',market);

		const tick = new ticker(socket,api);

		socket.on('settings',function(data){
			Object.keys(data).forEach((key)=>{
				if(key === 'active_market') data[key] = data[key].symbol;
				settings[key] = data[key];
			})
		});
		socket.on('getSettings',function(){
			socket.emit('getSettings',settings);
		});
		socket.on('disconnect',function(){
			clearInterval(tick.tock);
			console.log('> '+name+' disconnected websocket from localhost:'+(port+1));
			api = null;
		});
		socket.on('generate',function(data){
			dev.generate(data);
		})
	});
	http.listen(port+1, function(){
	  console.log('> Node socket API relay server for '+name+' is listening on localhost:'+(port+1));
	});
}
