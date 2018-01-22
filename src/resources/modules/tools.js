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

//Shared Server and client

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

//Server
tools.prototype.getEnv = function(){
	var env = {};
	Object.keys(process.env).forEach(function(key){
		if(process.env.hasOwnProperty(key)) env[key]=process.env[key];
	})
	return env;
}
tools.prototype.params = function(data){
	if(!data) return '';
	var string = ''
	Object.keys(data).forEach(function(key,i){
		string+=(i===0?'?':'&')+key+'='+data[key];
	})
	return string;
}
module.exports = new tools();
//export default new tools();
