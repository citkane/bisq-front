/* HACK - We need to get this from API as soon as it can provide enough detail */
var markets = require('../../data/markets.json');
/* END HACK */

function getPrecision(p){
	var n = 1
	while (p > 0){
		n = n*10;
		p--
	}
	return n;
}

Object.keys(markets.currencies).forEach((key)=>{
	markets.currencies[key].symbol = key;
	markets.currencies[key].precision = getPrecision(markets.currencies[key].precision)
	markets.currencies[key].toDecimal = function(val){
		val = val*1;
		return Math.round(val)/markets.currencies[key].precision
	}
	markets.currencies[key].fromDecimal = function(val){
		val = val*1;
		return Math.round(val*markets.currencies[key].precision)
	}
	markets.currencies[key].invert = function(val){
		val = val*1;
		return Math.round(markets.currencies[key].precision/val*markets.currencies[key].precision)/markets.currencies[key].precision;
	}
	markets.currencies[key].round = function(val){
		val = val*1;
		return Math.round(val*markets.currencies[key].precision)/markets.currencies[key].precision;
	}
})
var out = {};
Object.keys(markets).forEach((key)=>{
	out[key] = markets[key];
})
module.exports = out;
