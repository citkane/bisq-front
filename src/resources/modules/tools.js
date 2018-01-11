var fees = {
	SELL:{
		security:2.73/100,
		trading:.2/100,
		mining:4.63/100
	},
	BUY:{
		security:10/100,
		trading:.2/100,
		mining:5.14/100
	}
}
var tools = function(){};


tools.prototype.toXMR = function(xmr){
	return xmr/100000000;
}
tools.prototype.toFiat = function(amount){
	return amount/10000;
}
tools.prototype.toSatoshi = function(btc){
	return btc*100000000;
}
tools.prototype.toBtc = function(sat){
	return sat/100000000;
}
tools.prototype.fees = function(dir,btc){
	var fee = fees[dir];
	var sat = this.toSatoshi(btc);
	var data =  {
		security:{
			rate:fee.security*100+'%',
			value:sat*fee.security,
			btc:this.toBtc(sat*fee.security)
		},
		trading:{
			rate:fee.trading*100+'%',
			value:sat*fee.trading,
			btc:this.toBtc(sat*fee.trading)
		},
		mining:{
			rate:fee.mining*100+'%',
			value:sat*fee.mining,
			btc:this.toBtc(sat*fee.mining)
		}
	}
	data.total = {
		value:data.security.value+data.trading.value+data.mining.value+(dir==='BUY'?sat:0)
	}
	data.total.btc = this.toBtc(data.total.value);
	return data;
}
tools.prototype.formatTrade = function(trade){

	var types = {
		'sellerAsTakerTrade':['selling','taker'],
		'buyerAsTakerTrade':['buying','taker'],
		'sellerAsMakerTrade':['selling','maker'],
		'buyerAsMakerTrade':['buying','maker']
	}
	var type = Object.keys(trade)[0];
	trade = trade[type].trade;
	console.log(type,trade)
	var offer = trade.offer.offerPayload;
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
	var base = offer.paymentMethodId==='BLOCK_CHAINS'?offer.counterCurrencyCode:offer.baseCurrencyCode;
	var counter = offer.paymentMethodId==='BLOCK_CHAINS'?offer.baseCurrencyCode:offer.counterCurrencyCode;
	var amount = this.toBtc(trade.contract.tradeAmount);
	var price = base==='BTC'?this.toFiat(trade.contract.tradePrice):Math.round(100000000/trade.contract.tradePrice*1000000000000)/1000000000000;
	//var price = base==='BTC'?this.toFiat(trade.contract.tradePrice):this['to'+base](trade.contract.tradePrice)
	//var volume = base==='BTC'?Math.round(amount*price*100)/100:amount/price;
	var volume = base==='BTC'?Math.round(amount*price*100)/100:Math.round(trade.contract.tradeAmount/trade.contract.tradePrice*1000000000000)/1000000000000;

	var stage = 0;
	if (trade.state === 'DEPOSIT_CONFIRMED_IN_BLOCK_CHAIN') stage = 1;
	if (trade.state === 'SELLER_RECEIVED_FIAT_PAYMENT_INITIATED_MSG'||trade.state === 'BUYER_SAW_ARRIVED_FIAT_PAYMENT_INITIATED_MSG') stage = 2;
	if (trade.state === 'BUYER_RECEIVED_PAYOUT_TX_PUBLISHED_MSG'||trade.state === 'SELLER_SAW_ARRIVED_PAYOUT_TX_PUBLISHED_MSG') stage = 3

	return{
		type:types[type],
		date:trade.takeOfferDate,
		Date:new Date(trade.takeOfferDate*1).toUTCString(),
		id:offer.id,
		ago:this.dateAgo(trade.takeOfferDate),
		peer:trade.tradingPeerNodeAddress,
		account:account,
		base:base,
		counter:counter,
		state:trade.state,
		method:offer.paymentMethodId==='BLOCK_CHAINS'?base:offer.paymentMethodId,
		stage:stage,
		amount:amount,
		price:price,
		volume:volume,
		deposit:{
			selling:this.toBtc(offer.sellerSecurityDeposit),
			buying:this.toBtc(offer.buyerSecurityDeposit)
		}
	}
}
tools.prototype.dateAgo = function(then){
	var ago = Math.round((new Date().getTime() - then)/1000);
	var days = Math.floor(ago/(60*60*24))
	ago = ago - days*60*60*24
	var hours = Math.floor(ago/(60*60))
	ago = ago - hours*60*60;
	hours = hours.toString();
	if(hours.length === 1) hours = '0'+hours;
	var minutes = Math.floor(ago/60);
	ago = ago - minutes*60
	minutes = minutes.toString();
	if(minutes.length === 1) minutes = '0'+minutes;
	ago = ago.toString();
	if(ago.length === 1) ago = '0'+ago;
	//return days+'d : '+hours+'h : '+minutes+'m : '+ago+'s'
	return days+'d : '+hours+'h : '+minutes+'m'
}
export default new tools();
