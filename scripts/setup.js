"use strict"

const child = require('child_process');
const tools = require('../server/tools.js');
const dev = require('../server/makedev.js');
const devsettings = require('../devSettings.js');

dev.make(devsettings.startport,true).then(()=>{
	console.log('> Seednode has started');
	var count = 0;
	devsettings.clients.forEach((client)=>{
		if(client.react){
			console.log('> Start building production for '+client.dirname+' to '+process.cwd()+'/build/'+client.name+'\nPlease wait, it could take a few minutes....');
			var env = tools.getEnv();
			env.SERVER_PORT = client.port+1;
			env.APP_NAME = client.name;
			child.spawnSync('node',['scripts/build.js'],{
				cwd:'./',
				env:env
			});
			console.log('> Finished building production for '+client.dirname);
		}
		var user = dev.makeuser(client.dirname,client.port+2,client.gui,devsettings.startport);
		user.stdout.on('data',(data)=>{
			if(data.indexOf('Start parse blocks:') !== -1){
				count++
				console.log('> '+client.dirname+' has started.')
				if(count === devsettings.clients.length) console.log('\nSetup is ready. Please fund the regtest network and create an arbitrator\nCancel (ctr c) the terminal to exit when done.')
			}
		})
	})

});
