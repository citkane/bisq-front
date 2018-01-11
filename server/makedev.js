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


function dev(){

	const core = child.spawn('bitcoind',['-regtest','-server','-printtoconsole','-rpcuser=regtest','-rpcpassword=test']);

	const seedNode = child.spawn('java',['-jar','SeedNode.jar','--baseCurrencyNetwork=BTC_REGTEST','--useLocalhost=true','--myAddress=localhost:2002','--nodePort=2002','--appName=bisq_seed_node_localhost_2002'],{cwd:'/var/opt/bisq-network/seednode/target/'});

	[core,seedNode].forEach((p)=>{
		p.stdout.on('data', (data) => {
			//console.log(`stdout: ${data}`);
		});
		p.stderr.on('data', (data) => {
			//console.log(`stderr: ${data}`);
		});
		p.on('close', (code) => {
			//console.log(`child process exited with code ${code}`);
		});
	})


}
dev.prototype.makeuser = function(appName,port,gui){
	var e = tools.getEnv();
	e.BISQ_API_PORT = port+1;
	gui = gui?'io.bisq.api.app.BisqApiWithUIMain':'io.bisq.api.app.ApiMain';
	var com = 'mvn exec:java -Dexec.mainClass="'+gui+'" -Dexec.args="--baseCurrencyNetwork=BTC_REGTEST --bitcoinRegtestHost localhost --nodePort '+port+' --useLocalhost true --appName '+appName+' --seedNodes=localhost:2002"'
	return child.exec(com,{
		cwd:'/var/opt/bisq-api',
		env:e
	})
}

dev.prototype.generate = function(amount){
	btc.generate(amount);
}

module.exports = new dev();
