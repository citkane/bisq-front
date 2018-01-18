"use strict"
const fetch = require('node-fetch');
const tick = 5000;
const dev = require('./makedev.js');
dev.generate(1);
setInterval(()=>{
	dev.generate(1);
},1000*60*1)

function ticker(socket,api){
	this.socket = socket;
	this.api = api;
	this.tock = setInterval(()=>{
		this.emit();
	},tick)
	socket.on('ticker',()=>{
		this.emit();
	})

}

ticker.prototype.emit = function(){
	var data = {};
	var count = 0;
	var endpoints = ['trade_list','account_list','wallet_tx_list','offer_list','wallet_detail'];
	endpoints.forEach((end)=>{
		this.api.get({command:end}).then((d)=>{
			data[end]=d;
			count++;
			if(count === endpoints.length){
				this.socket.emit('ticker',data);
			}
		})
	})
}

module.exports = ticker;
