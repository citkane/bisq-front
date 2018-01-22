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

const tools = require('../../src/resources/modules/tools.js');
const money = require('../../src/resources/modules/markets.js').currencies;

//This is a mapping of API (client and markets.bisq.network/api/) calls to format and return consistent data for bisq-front. Any future upgrade issues should be addressed here.
const convert = function(){
	var self = this;
	this.get = (type,data)=>{
		if(type && typeof this[type] === 'function'){
			return this[type](data);
		}else if(type && data){
			return data;
		}else{
			return false;
		}
	}
}

convert.prototype.trade_list = function(data){
	data = data.map((trade)=>{
		return formatTrade(trade);
	}).sort(function(a,b){
		return a.date < b.date?0:1
	})
	return data;
}
convert.prototype.trade_detail = function(data){
	return formatTrade(data);
}
convert.prototype.offer_list = function(data){
	data = data.map((offer)=>{
		return formatOffer(offer);
	})
	return data;
}
convert.prototype.offer_detail = function(offer){
	return formatOffer(offer);
}
convert.prototype.account_list = function(data){
	data = data.map((ac)=>{
		var type = ac.payment_method_details.contractData.paymentMethodId;
		var fiat = type==='BLOCK_CHAINS'?false:true;
		var currency = ac.trade_currencies[0];
		type = fiat?type:currency;
		var name = ac.account_name.replace(type+':','').replace(type,'').trim();
		if(!name.length) name = ac.account_name;

	/*HACK can't find way yet to determine account min/max from API - hack to allow proof of concept to function */
		var limit = {
			min:0.001,
			max:fiat?0.125:1
		}
	/*End HACK */

		return {
			id:ac.payment_account_id,
			name:name,
			type:type,
			pair:fiat?'BTC_'+currency:currency+'_BTC', //invert the pair for crypto trade
			currency:currency,
			fiat:fiat,
			limit:limit,
		}
	});
	return data;
}
/*
convert.prototype.offer_cancel = function(data){
	return data;
}
convert.prototype.offer_make = function(data){
	return data;
}
convert.prototype.offer_take = function(data){
	return data;
}
convert.prototype.payment_started = function(data){
	return data;
}
convert.prototype.payment_received = function(data){
	return data;
}
convert.prototype.move_funds_to_bisq_wallet = function(data){
	return data;
}
convert.prototype.wallet_detail = function(data){
	return data;
}
convert.prototype.currency_list = function(data){
	return data;
}
convert.prototype.market_list = function(data){
	return data;
}
convert.prototype.wallet_addresses = function(data){
	return data;
}
convert.prototype.wallet_tx_list = function(data){
	return data;
}
*/

function formatOffer(offer){
	var M = money[offer.other_currency]
	if(M.type!=='fiat'){
		offer.other_amount = M.fromDecimal(offer.other_amount);
		offer.other_amount = M.invert(offer.other_amount);
	}
	/*Invert semantics for human language*/
	if(offer.price_detail.use_market_price) offer.price_detail.market_price_margin = offer.price_detail.market_price_margin*(offer.direction==='SELL'?100:-100);
	return offer;
}

const types = {
	'sellerAsTakerTrade':['selling','taker'],
	'buyerAsTakerTrade':['buying','taker'],
	'sellerAsMakerTrade':['selling','maker'],
	'buyerAsMakerTrade':['buying','maker']
}
function formatTrade(trade){
	var type = Object.keys(trade)[0];
	trade = trade[type].trade;
	//console.log(type,trade)
	var offer = trade.offer.offerPayload;
	var fiat = offer.paymentMethodId==='BLOCK_CHAINS'?false:true
	var account = trade.processModel.tradingPeer.paymentAccountPayload;
	Object.keys(account).forEach(function(key){
		if(key.indexOf('AccountPayload')!==-1) account = account[key];
	})
	Object.keys(account).some(function(key){
		if(key.indexOf('AccountPayload')!==-1){
			account = account[key];
			return true;
		}
		return false;
	})
	var base = offer.baseCurrencyCode;
	var counter = offer.counterCurrencyCode;

/*HACK fiat currencies are coming in at two decimal places too high from bisq-api*/

	if(money[counter].type === 'fiat') trade.contract.tradePrice = trade.contract.tradePrice/100

/*END HACK*/

	var invert = false;
	if(!fiat){
		invert = {
			method:offer.counterCurrencyCode
		}
		invert.price = money[counter].invert(trade.contract.tradePrice);
		invert.volume = money[counter].toDecimal(trade.contract.tradeAmount*invert.price);
		invert.amount = money[base].toDecimal(trade.contract.tradeAmount);
	}

	var amount = money[base].toDecimal(trade.contract.tradeAmount);
	var volume = money[counter].toDecimal(amount*trade.contract.tradePrice);
	var price = money[counter].toDecimal(trade.contract.tradePrice);

	var stage = 0;
	if (trade.state === 'DEPOSIT_CONFIRMED_IN_BLOCK_CHAIN') stage = 1;
	if (trade.state === 'SELLER_RECEIVED_FIAT_PAYMENT_INITIATED_MSG'||trade.state === 'BUYER_SAW_ARRIVED_FIAT_PAYMENT_INITIATED_MSG') stage = 2;
	if (trade.state === 'BUYER_RECEIVED_PAYOUT_TX_PUBLISHED_MSG'||trade.state === 'SELLER_SAW_ARRIVED_PAYOUT_TX_PUBLISHED_MSG') stage = 3

	return{
		type:types[type],
		date:trade.takeOfferDate,
		Date:new Date(trade.takeOfferDate*1).toUTCString(),
		id:offer.id,
		ago:tools.dateAgo(trade.takeOfferDate),
		peer:trade.tradingPeerNodeAddress,
		account:account,
		base:base,
		counter:counter,
		state:trade.state,
		method:offer.paymentMethodId,
		stage:stage,
		amount:amount,
		price:price,
		volume:volume,
		deposit:{
			selling:tools.toBtc(offer.sellerSecurityDeposit),
			buying:tools.toBtc(offer.buyerSecurityDeposit)
		},
		fiat:fiat,
		invert:invert
	}
}

 module.exports = new convert();
