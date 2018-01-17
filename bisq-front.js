'use strict';

const app = require('express')();
const child = require('child_process');
var path = require('path');
global.appRoot = path.resolve(__dirname);


const dev = require('./server/makedev.js');
var Api = require('./server/api.js');
const tools = require('./server/tools.js');
const ticker = require('./server/ticker.js');
const mark = require('./server/market.js');
const devsettings = require('./devSettings.js');

const production = process.env.NODE_ENV==='production'?true:false;

global.market = {};
mark.get('markets').then((data)=>{
	market.markets = mark.formatMarkets(data);
})

dev.make(devsettings.startport).then((port)=>{
	console.log('> Started the seednode on localhost:'+port);
	devsettings.clients.forEach((client)=>{
		new makeInstance(client);
	})
});
//dev.log();



function makeInstance(client){
	var {port,name,dirname,gui,react} = client;

	var user = dev.makeuser(dirname,port+2,gui,devsettings.startport);
	user.stdout.on('data', function(data) {
	    if(data.indexOf('Start parse blocks:') !== -1 && react){
			console.log('\n> Started the BISQ API server '+dirname+'\nBrowse the API at http://localhost:'+(port+3)+'/swagger');
			console.log('\n> Starting the http '+(production?'production':'DEVELOPMENT')+' server for '+name+'\nBrowse to http://localhost:'+port+' to view.\n');
			if(production){
				makeSocket(client);
				child.fork('node_modules/.bin/serve',['-s','-p '+port,'build/'+name]);
				return;
			}
			var env = tools.getEnv();
			env.PORT = port;
			env.SERVER_PORT = port+1;
			makeSocket(client);
			var web = child.spawn('node',['scripts/start.js'],{env:env});
			web.stderr.on('data', (data) => {
				console.error(`stderr: ${data}`);
			});

		}
	});
}
function makeSocket(client){
	var {port,name,dirname,gui,react} = client;
	var settings = {
		peers:devsettings.clients.filter((client)=>{
			return (client.react && port!==client.port)
		}),
		me:client
	}
	const http = require('http').Server(app);
	const io = require('socket.io')(http);
	io.on('connection', function(socket){
		console.log('> '+name+' connected via websocket on localhost:'+(port+1));
		var api = new Api(socket,port+3);
		socket.emit('market',market);

		new ticker(socket,api);

		socket.on('settings',function(data){
			Object.keys(data).forEach((key)=>{
				settings[key] = data[key];
			})
		})
		socket.on('getSettings',function(){
			socket.emit('getSettings',settings);
		})
		socket.on('disconnect',function(){
			console.log('> '+name+' disconnected websocket from localhost:'+(port+1));
			api = null;
		})
		socket.on('generate',function(data){
			dev.generate(data);
		})
	});

	http.listen(port+1, function(){
	  console.log('> Node socket API relay server for '+name+' is listening on localhost:'+(port+1));
	});
}
