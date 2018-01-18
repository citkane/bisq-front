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
