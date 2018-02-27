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

const request = require('request');
const tools = require('../src/resources/modules/tools.js');
const fs = require('fs');
const path = require('path');

var market = function(){}

market.prototype.get = function(command,params){
	var url = 'https://markets.bisq.network/api/'+command+tools.params(params);
	return new Promise(function(resolve,reject){
		request.get({
			url:url,
			json:true,
		},function(err,resp,body){
			if(err){
				reject({command:command,data:err});
				return;
			}
			!body?reject({command:command,data:'failed to process market data'}):resolve({command:command,data:body});
		})
	})
}
market.prototype.formatMarkets = function(data){
	var left = {};
	var right = {};
	var curr = {};
	var sides = ['l','r'];
	Object.keys(data).forEach((key)=>{
		if(!left[data[key].lsymbol]) left[data[key].lsymbol] = data[key];
		if(!right[data[key].rsymbol]) right[data[key].rsymbol] = data[key];
		sides.forEach((s)=>{
			if(!curr[data[key][s+'symbol']]) curr[data[key][s+'symbol']]={
				name:data[key][s+'name'],
				precision:data[key][s+'precision'],
				type:data[key][s+'type'],
				todec:function(amount){
					return amount;
				}
			}
		})
	})
	left = Object.keys(left).filter((lkey)=>{
		return Object.keys(right).some((rkey)=>{
			return !!data[lkey.toLowerCase()+'_'+rkey.toLowerCase()]
		})
	}).map((key)=>{
		return left[key];
	})
	right = Object.keys(right).map((key)=>{
		return right[key];
	})
	var markets = {
		left:left,
		right:right,
		list:data,
		currencies:curr
	}
	return markets;
}
market.prototype.make = function(){
	console.log('> Getting latest currency data from https://markets.bisq.network\nPlease wait...\n')
	var count = 0;
	var done = false;
	var exists = fs.existsSync(path.join(appRoot,'src/data/markets.json'))
	return new Promise((resolve,reject)=>{
		this.get('markets').then((data)=>{
			if(done) return;
			clearTimeout(to);
			data = this.formatMarkets(data.data);
			data = JSON.stringify(data,null,'\t');
			fs.writeFileSync(path.join(appRoot,'src/data/markets.json'),data);
			resolve(false);
		},(err)=>{
			if(done) return;
			clearTimeout(to);
			if(exists){
				resolve(err.toString());
			}else{
				reject(err.toString());
			}
		})
		var to = setTimeout(()=>{
			done = true;
			var m = 'https://markets.bisq.network is not responding in time.'
			exists?resolve(m):reject(m);
		},1000)
	})
}
module.exports = new market();
