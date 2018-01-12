'use strict';

const app = require('express')();
const child = require('child_process');
var path = require('path');
global.appRoot = path.resolve(__dirname);


const dev = require('./server/makedev.js');
var Api = require('./server/api.js');
const tools = require('./server/tools.js');
const ticker = require('./server/ticker.js');
//const bob = new makeInstance(3100,'Bisq-Regtest-Bob',true);
//const alice = new makeInstance(3200,'Bisq-Regtest-Alice',true);
//const arbitrator = new makeInstance(3300,'Bisq-Regtest-Arbitrator',true);

new makeInstance(3100,'Bisq-Regtest-Bob',true,true);
new makeInstance(3200,'Bisq-Regtest-Alice',true,true);
new makeInstance(3300,'Bisq-Regtest-Arbitrator',true,false);


function makeInstance(port,name,gui,react){
	var settings;
	const http = require('http').Server(app);
	const io = require('socket.io')(http);
	io.on('connection', function(socket){
		console.log(port+' connected');
		var api = new Api(socket,port+3);
		new ticker(socket,api);

		socket.on('settings',function(data){
			settings = data;
		})
		socket.on('getSettings',function(){
			socket.emit('getSettings',settings);
		})
		socket.on('disconnect',function(){
			console.log(port+' disconnected');
			api = null;
		})
		socket.on('generate',function(data){
			console.log(data);
			dev.generate(data);
		})
	});

	http.listen(port+1, function(){
	  console.log('Server listening on *:'+(port+1));
	});
	var user = dev.makeuser(name,port+2,gui);

	user.stdout.on('data', function(data) {
	    if(data.indexOf('Start parse blocks:') !== -1 && react){
			console.log('Starting '+name);
			var env = tools.getEnv();
			env.PORT = port;
			env.SERVER_PORT = port+1;
			child.fork('scripts/start.js',{env:env})
		}
	});
}
