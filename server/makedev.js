"use strict"

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

const child = require('child_process');
const tools = require('../src/resources/modules/tools.js');
const Btc = require('bitcoin-core');
const btc = new Btc({
	network:'regtest',
	host:'localhost',
	username:'regtest',
	password:'test'
});
//btc.generate(7);
//btc.getInfo().then((help) => console.log(help));


function dev(){}

dev.prototype.make = function(port,gui){
	this.core = child.spawn(gui?'bitcoin-qt':'bitcoind',['-regtest','-server','-printtoconsole','-rpcuser=regtest','-rpcpassword=test']);
	if(typeof children !== 'undefined') children.spawn.push(this.core);
	this.seedNode = child.spawn('java',['-jar','SeedNode.jar','--baseCurrencyNetwork=BTC_REGTEST','--useLocalhost=true','--myAddress=localhost:'+port,'--nodePort='+port,'--appName=bisq_seed_node_localhost_'+port],{cwd:'/var/opt/bisq-network/seednode/target/'});

	if(typeof children !== 'undefined') children.spawn.push(this.seedNode);

	var count = 0;
	return new Promise((resolve,reject)=>{

		this.seedNode.stdout.on('data',(data)=>{
			data = `${data}`;
			if(data.indexOf('onHiddenServicePublished')!==-1){
				count++
				if(count === 2) resolve(port);
			}
		})
		this.core.stdout.on('data', function(data) {
			data = `${data}`;
			if(data.indexOf('msghand thread start')!== -1){
				count++
				if(count === 2) resolve(port)
			}
		})

	})
}
dev.prototype.log = function(){
	[this.core,this.seedNode].forEach((p)=>{
		p.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		p.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});
		p.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
		});
	})
}
dev.prototype.makeuser = function(appName,port,gui,seedport){
	console.log('> Starting the BISQ API server '+appName+' in '+(gui?'GUI':'headless')+' mode at localhost:'+(port+1)+'\nPlease wait....\n');
	var e = tools.getEnv();
	e.BISQ_API_PORT = port+1;
	gui = gui?'io.bisq.api.app.BisqApiWithUIMain':'io.bisq.api.app.ApiMain';
	var com = 'mvn exec:java -Dexec.mainClass="'+gui+'" -Dexec.args="--baseCurrencyNetwork=BTC_REGTEST --bitcoinRegtestHost localhost --nodePort '+port+' --useLocalhost true --appName '+appName+' --seedNodes=localhost:'+seedport+'"'

	var user = child.exec(com,{
		cwd:'/var/opt/bisq-api',
		env:e
	})
	user.on('close',function(code,signal){
		console.log(appName,'code:'+code,'signal:'+signal);
	})
	if(typeof children !== 'undefined') children.exec.push(user);
	return user;
}

dev.prototype.generate = function(amount){
	btc.generate(amount,(error, data) => {
		if(error) console.error('\n> Bitcoin-core error while generating:\n'+error);
		//console.log(data)
	});
}

module.exports = new dev();
