"use strict"

const child = require('child_process');
const tools = require('./tools.js');
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
	this.seedNode = child.spawn('java',['-jar','SeedNode.jar','--baseCurrencyNetwork=BTC_REGTEST','--useLocalhost=true','--myAddress=localhost:'+port,'--nodePort='+port,'--appName=bisq_seed_node_localhost_'+port],{cwd:'/var/opt/bisq-network/seednode/target/'});
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
	console.log('> Starting the BISQ API server '+appName+' in '+(gui?'GUI':'headless')+' mode at localhost:'+(port+1));
	var e = tools.getEnv();
	e.BISQ_API_PORT = port+1;
	gui = gui?'io.bisq.api.app.BisqApiWithUIMain':'io.bisq.api.app.ApiMain';
	var com = 'mvn exec:java -Dexec.mainClass="'+gui+'" -Dexec.args="--baseCurrencyNetwork=BTC_REGTEST --bitcoinRegtestHost localhost --nodePort '+port+' --useLocalhost true --appName '+appName+' --seedNodes=localhost:'+seedport+'"'
	return child.exec(com,{
		cwd:'/var/opt/bisq-api',
		env:e
	})
}

dev.prototype.generate = function(amount){
	btc.generate(amount,(error, data) => {
		if(error) console.error('\n> Bitcoin-core error while generating:\n'+error);
		//console.log(data)
	});
}

module.exports = new dev();
