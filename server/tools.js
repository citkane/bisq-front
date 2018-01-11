"use strict";

function tools(){};

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
