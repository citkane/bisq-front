var markets = require('../../data/markets.json');
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
		return Math.round(val)/markets.currencies[key].precision
	}
	markets.currencies[key].fromDecimal = function(val){
		return Math.round(val*markets.currencies[key].precision)
	}
	markets.currencies[key].invert = function(val){
		return Math.round(markets.currencies[key].precision/val*markets.currencies[key].precision)/markets.currencies[key].precision;
	}
	markets.currencies[key].round = function(val){
		return Math.round(val*markets.currencies[key].precision)/markets.currencies[key].precision;
	}
})

module.exports = markets;
