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
const tools = require('./tools.js');

var market = function(){}

market.prototype.get = function(command,params){
	var url = 'https://markets.bisq.network/api/'+command+tools.params(params);
	return new Promise(function(resolve,reject){
		request.get({
			url:url,
			json:true,
		},function(err,resp,body){
			resolve(body);
		})
	})
}
market.prototype.formatMarkets = function(data){
	var left = {};
	var right = {};
	/*
	var m = Object.keys(data).map((key)=>{
		return data[key];
	})
	m.forEach((market)=>{
		if(left.indexOf(market.pair.split('_')[0]+' - '+market.lname)===-1) left.push(market.pair.split('_')[0]+' - '+market.lname);
		if(right.indexOf(market.pair.split('_')[1]+' - '+market.rname)===-1) right.push(market.pair.split('_')[1]+' - '+market.rname);
	})
	*/
	Object.keys(data).forEach((key)=>{
		if(!left[data[key].lsymbol]) left[data[key].lsymbol] = data[key];
		if(!right[data[key].rsymbol]) right[data[key].rsymbol] = data[key];
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
	//left = left.sort()
	//right = right.sort()
	var markets = {
		left:left,
		right:right,
		list:data
	}
	return markets;
}
module.exports = new market();
