"use strict"

const gui = false;
var devsettings = function(){
	this.startport = 3100;
	this.clients = {
		Bob:{
			gui:gui,
			react:true,
			url:'bob.openpoint.ie'
		},
		Alice:{
			gui:true,
			react:true,
			url:'alice.openpoint.ie'
		},
		Arbitrator:{
			gui:gui,
			react:false
		}
	}
	this.makeClients();
}
devsettings.prototype.makeClients = function(){
	var count = 0;
	this.clients = Object.keys(this.clients).map((client)=>{
		count = count+10;
		var c = this.clients[client];
		return {
			name:client,
			dirname:'Bisq-Regtest-'+client,
			port:this.startport+count,
			gui:c.gui,
			react:c.react,
			url:c.url
		}
	})
}
module.exports = new devsettings()
