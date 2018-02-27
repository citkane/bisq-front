const fees = {
    /* HACK - we need to be able to get the fee data from the API, hardcoding it for now for development purposes */
    SELL: {
        security: 2.73 / 100,
        trading: .2 / 100,
        mining: 4.63 / 100
    },
    BUY: {
        security: 10 / 100,
        trading: .2 / 100,
        mining: 5.14 / 100
    }
    /* END HACK */
};
const tools = function(){};

//Shared Server and client

tools.prototype.fees = function(dir,btc,func){

	let fee = fees[dir]; /* See HACK at top of file */

	var sat = func.fromDecimal(btc);
	var data =  {
		security:{
			rate:fee.security*100+'%',
			value:sat*fee.security,
			btc:func.toDecimal(sat*fee.security)
		},
		trading:{
			rate:fee.trading*100+'%',
			value:sat*fee.trading,
			btc:func.toDecimal(sat*fee.trading)
		},
		mining:{
			rate:fee.mining*100+'%',
			value:sat*fee.mining,
			btc:func.toDecimal(sat*fee.mining)
		}
	}
	data.total = {
		value:data.security.value+data.trading.value+data.mining.value+(dir==='BUY'?sat:0)
	}
	data.total.btc = func.toDecimal(data.total.value);
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
};

//Server
tools.prototype.getEnv = function(){
	var env = {};
	Object.keys(process.env).forEach(function(key){
		if(process.env.hasOwnProperty(key)) env[key]=process.env[key];
	})
	return env;
}
tools.prototype.params = function(data){
	if(!data) return '/';
	var string = '/'
	Object.keys(data).forEach(function(key,i){
		string+=(i===0?'?':'&')+key+'='+data[key];
	})
	return string;
}
tools.prototype.kill = function(ch){

	for (const child of ch) child.kill();
    /*
    if(!children) var children = {
        exec:[],
        spawn:[]
    }
    var count = children.exec.length;
    //see https://www.npmjs.com/package/ps-tree
    return new Promise((resolve,reject)=>{
        children.spawn.forEach((child)=>{
            child.kill();
        })
        children.exec.forEach((child)=>{
            psTree(child.pid, function (err, Children) {
                cp.spawnSync('kill', ['-9'].concat(Children.map(function (p) { return p.PID })));
                count --
                if(!count) resolve(true);
            });
        })
    })
    */
}
module.exports = new tools();
//export default new tools();
