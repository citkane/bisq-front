"use strict"

const fs = require('fs');
const path = require('path');
var lang = require(path.join(appRoot,'src/components/babel/lang.json'));

var files = fs.readdirSync(path.join(appRoot,'src/components'));
files.forEach(function(dir){
	if(dir === 'babel') return;
	dir = path.join(appRoot,'src/components/',dir);
	if(!fs.statSync(dir).isDirectory()) return;
	if(fs.readdirSync(dir).indexOf('lang.json') < 0) return;
	add(require(path.join(dir,'lang.json')));
})
lang = JSON.stringify(lang,null,'\t');
fs.writeFileSync(path.join(appRoot,'src/resources/lang.json'),lang);

function add(data){
	Object.keys(data).forEach(function(key){
		if(!lang[key]){
			lang[key] = data[key];
		}else{
			Object.keys(data[key]).forEach(function(key2){
				if(!lang[key][key2]){
					lang[key][key2] = data[key][key2]
				}
			})
		}
	})
}
