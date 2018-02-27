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
var coin = require('../../src/resources/modules/markets.js').currencies;

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
	var error;
	data = data.map((trade)=>{
		if(!trade) error = true;
		return formatTrade(trade);
	})
	if(!error)data = data.sort(function(a,b){
		return a.date < b.date?0:1
	})
	return !error?data:false;
}
convert.prototype.trade_detail = function(data){
	return formatTrade(data);
}
convert.prototype.offer_list = function(data){
	var error;
	data = data.map((offer)=>{
		if(!offer) error = true;
		return formatOffer(offer);
	})
	return !error?data:false;
}
convert.prototype.offer_detail = function(offer){
	return formatOffer(offer);
}
convert.prototype.account_list = function(data){
	if(!data) return false;
	var error;
	data = data.map((ac)=>{
		try {
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
				trade_currencies:ac.trade_currencies
			}
		}
		catch(err){
			console.error(err);
			error =true;
			return false;
		}
	});
	return !error?data:false;
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
	try {
		var M = coin[offer.other_currency]
		if(M.type!=='fiat'){
			offer.other_amount = M.fromDecimal(offer.other_amount);
			offer.other_amount = M.invert(offer.other_amount);
		}
		/*Invert semantics for human language*/
		if(offer.price_detail.use_market_price) offer.price_detail.market_price_margin = offer.price_detail.market_price_margin*(offer.direction==='SELL'?100:-100);
		return offer;
	}
	catch(err){
		console.error(err);
		return false;
	}
}

const types = {
	'sellerAsTakerTrade':['selling','taker'],
	'buyerAsTakerTrade':['buying','taker'],
	'sellerAsMakerTrade':['selling','maker'],
	'buyerAsMakerTrade':['buying','maker']
};
function formatTrade(trade){

	try {
		var type = Object.keys(trade)[0];
		trade = trade[type].trade;
		var Trade = JSON.parse(trade.contractAsJson);
		var payload = Trade.offerPayload;
		var base = payload.baseCurrencyCode;
		var counter = payload.counterCurrencyCode;
		var method = payload.paymentMethodId;
		var fiat = method==='BLOCK_CHAINS'?false:true;
		var account = Trade.takerPaymentAccountPayload;

	/*HACK fiat currencies are coming in at two decimal places too high from bisq-api*/
		if(coin[counter].type === 'fiat') Trade.tradePrice = Trade.tradePrice/100
	/*END HACK*/

		var invert = false;
		if(!fiat){
			invert = {
				method:counter
			}
			invert.price = coin[counter].invert(Trade.tradePrice);
			invert.volume = coin[counter].toDecimal(Trade.tradeAmount*invert.price);
			invert.amount = coin[base].toDecimal(Trade.tradeAmount);
		}

		var amount = coin[base].toDecimal(Trade.tradeAmount);
		var volume = coin[counter].toDecimal(amount*Trade.tradePrice);
		var price = coin[counter].toDecimal(Trade.tradePrice);

		var stage = 0;
		if (trade.state === 'DEPOSIT_CONFIRMED_IN_BLOCK_CHAIN') stage = 1;
		if (trade.state === 'SELLER_RECEIVED_FIAT_PAYMENT_INITIATED_MSG'||trade.state === 'BUYER_SAW_ARRIVED_FIAT_PAYMENT_INITIATED_MSG') stage = 2;
		if (trade.state === 'BUYER_RECEIVED_PAYOUT_TX_PUBLISHED_MSG'||trade.state === 'SELLER_SAW_ARRIVED_PAYOUT_TX_PUBLISHED_MSG') stage = 3

		return{
			type:types[type],
			date:trade.takeOfferDate,
			Date:new Date(trade.takeOfferDate*1).toUTCString(),
			id:payload.id,
			ago:tools.dateAgo(trade.takeOfferDate),
			peer:trade.tradingPeerNodeAddress,
			account:account,
			base:base,
			counter:counter,
			state:trade.state,
			method:method,
			stage:stage,
			amount:amount,
			price:price,
			volume:volume,
			deposit:{
				selling:coin[base].toDecimal(payload.sellerSecurityDeposit),
				buying:coin[base].toDecimal(payload.buyerSecurityDeposit)
			},
			fiat:fiat,
			invert:invert
		}
	}
	catch(err){
		console.error(err);
		return false;
	}

}

 module.exports = new convert();
