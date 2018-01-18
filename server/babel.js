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

const fs = require('fs');
const path = require('path');
global.appRoot = path.join(path.resolve(__dirname),'../');

const trans = require('google-translate')("AIzaSyB_jGUlCbK2IFKUmjIXHzKLqwLjF5n2tO0");
var lang = require(path.join(appRoot,'src/components/babel/lang.json'));

var rtl = ['ar','arc','dv','far','ha','he','khw','ks','ku','ps','ur','yi']

trans.getSupportedLanguages('en',function(err,languageCodes) {
	var langCodes = [];
	var count = 0;
	languageCodes.forEach((code)=>{
		if(code.language === 'en'){
			langCodes.push({name:'English',language:'en',dir:'ltr'});
			count++;
			if(count === languageCodes.length){
				buildLang(langCodes)
			}
			return;
		}
		trans.translate(code.name,'en',code.language, function(err, translation) {
			var dir = rtl.indexOf(code.language)===-1?"ltr":"rtl";
			langCodes.push({name:translation.translatedText,language:code.language,dir:dir})
			count++;
			if(count === languageCodes.length){
				buildLang(langCodes)
			}
		})
	})
});

function buildLang(languageCodes){
	var targets = languageCodes.filter((code)=>{
		return code.language!=='en';
	}).map((code)=>{
		return code.language;
	});
	var files = fs.readdirSync(path.join(appRoot,'src/components'));
	files.forEach(function(dir){
		if(dir === 'babel') return;
		dir = path.join(appRoot,'src/components/',dir);
		if(!fs.statSync(dir).isDirectory()) return;
		if(fs.readdirSync(dir).indexOf('lang.json') < 0) return;
		add(require(path.join(dir,'lang.json')));
	})

	var i = 0;
	Object.keys(lang).forEach((section)=>{
		var strings = {}
		targets.forEach((target)=>{
			strings[target]=[];
			Object.keys(lang[section]).forEach((id)=>{
				strings[target].push({id:id,en:lang[section][id].en})
			})
		})
		var i2 = 0;
		Object.keys(strings).forEach((target)=>{

			if(strings[target].length){

				var s = strings[target].map((f)=>{
					return f.en;
				})

				trans.translate(s,'en',target, function(err, translation) {

					i2++;
					if(i2 === Object.keys(strings).length) i++;

					if(!err){
						translation.forEach((t)=>{
							strings[target].some((t2)=>{
								if(t2.en === t.originalText){
									var id = t2.id;
									if(!lang[section][t2.id][target]) lang[section][t2.id][target] = t.translatedText;
								}
							})
						})
					}
					if(i === Object.keys(lang).length) writeLang(lang,languageCodes)
				});


			}else{
				i2++;
				if(i2 === Object.keys(strings).length) i++;
				if(i === Object.keys(lang).length) writeLang(lang,languageCodes);
			}

		});
	});
}


function writeLang(lang,targets){
	targets = targets.sort((a,b)=>{
		if(a.language > b.language) return 1;
		if(a.language < b.language) return -1;
		return 0;
	})
	lang.list = targets;
	lang = JSON.stringify(lang,null,'\t');
	fs.writeFileSync(path.join(appRoot,'src/resources/lang.json'),lang);
}


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
