"use strict";

const gui = false;
const devSettings = function () {
    this.startport = 3100;
    this.clients = {
        Bob: {
            gui: gui,
            react: true,
            url: 'bob.openpoint.ie'
        },
        Alice: {
            gui: gui,
            react: true,
            url: 'alice.openpoint.ie'
        },
        Arbitrator: {
            gui: gui,
            react: false
        }
    };
    this.makeClients();
};
devSettings.prototype.makeClients = function(){
	let count = 0;
	this.clients = Object.keys(this.clients).map((client)=>{
		count = count+10;
        let Client = this.clients[client];
        return {
			name:client,
			dirname:'Bisq-Regtest-'+client,
			port:this.startport+count,
			gui:Client.gui,
			react:Client.react,
			url:Client.url
		}
	})
};
module.exports = new devSettings();
