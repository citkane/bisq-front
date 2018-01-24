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
const rtl = ['ar','arc','dv','far','ha','he','khw','ks','ku','ps','ur','yi']

global.appRoot = path.join(path.resolve(__dirname),'../../');
var lang = require(path.join(appRoot,'src/resources/language/seed_lang.json'));
var langCodes = [];
const pace = 100 //request interval for API calls in milliseconds
var LC;
var translate_interval;
var codes_interval;

var apath = path.join(appRoot,'server/language/api_key.txt')
if(!fs.existsSync(apath)){
	console.log('Please create a plain text file containing only your Google Translate API key at:\n'+apath);
	return;
}
const api_key = fs.readFileSync(apath, 'utf8');
const trans = require('google-translate')(api_key);
console.log('> Getting supported languages...\n')

trans.getSupportedLanguages('en',function(err,languageCodes) {
	if(err) console.error(err);
	setTimeout(()=>{
		Codes(languageCodes,pace);
	},pace)
});
function Codes(languageCodes,p){
	var i = languageCodes.length;
	codes_interval = setInterval(()=>{
		if(!languageCodes.length) return;
		var code = languageCodes.shift();
		if(code.language === 'en'){
			langCodes.push({name:'English',language:'en',dir:'ltr'});
			i--;
			if(!i){
				console.log('> Got supported languages.\n');
				setTimeout(()=>{
					buildLang(langCodes)
				},pace)
			}
			if(!languageCodes.length) clearInterval(codes_interval);
			return;
		}
		trans.translate(code.name,'en',code.language, function(err, translation) {
			if(err){
				err = JSON.parse(err.body).error.message;
				console.error('> ERROR ('+i+')\n'+err+(err==='User Rate Limit Exceeded'?' (Leave it running, this will eventually resolve)':'')+'\n');
				languageCodes.push(code);
				if(p > 2000) return;
				p=p+500;
				clearInterval(codes_interval);
				Codes(languageCodes,p)
			}else{
				console.log(code.name+' ('+i+')');
				var dir = rtl.indexOf(code.language)===-1?"ltr":"rtl";
				langCodes.push({name:translation.translatedText,language:code.language,dir:dir})
				i--;
				if(!i){
					console.log('> Got supported languages.\n');
					setTimeout(()=>{
						buildLang(langCodes)
					},pace)
					return;
				}
				if(p > pace){
					clearInterval(codes_interval);
					p = p-500;
					Codes(languageCodes,p)
				}
			}
		})
		if(!languageCodes.length) clearInterval(codes_interval);
	},p)
}
function buildLang(languageCodes){
	LC = languageCodes;
	console.log('> Getting lang.json from modules.\n')

	var targets = languageCodes.filter((code)=>{
		return code.language!=='en';
	}).map((code)=>{
		return code.language;
	});
	var files = fs.readdirSync(path.join(appRoot,'src/components'));
	files.forEach(function(dir){
		dir = path.join(appRoot,'src/components/',dir);
		if(!fs.statSync(dir).isDirectory()) return;
		if(fs.readdirSync(dir).indexOf('lang.json') < 0) return;
		add(require(path.join(dir,'lang.json')));
	})

	console.log('> Starting translations.\n')

	var jobs = [];
	Object.keys(lang).forEach((section)=>{
		var strings = {}
		targets.forEach((target)=>{
			strings[target]=[];
			Object.keys(lang[section]).forEach((id)=>{
				strings[target].push({id:id,en:lang[section][id].en})
			})
		})

		Object.keys(strings).forEach((target)=>{
			if(strings[target].length){
				var s = strings[target].map((f)=>{
					return f.en;
				})
				jobs.push({s:s,target:target,strings:strings,target:target,section:section})
			}
		});
	});
	Translate(jobs,pace);
}
function Translate(jobs,p){
	var i = jobs.length;
	translate_interval = setInterval(()=>{
		if(!jobs.length) return;
		const job = jobs.shift();
		const {strings,target,section,s} = job
		trans.translate(s,'en',target, function(err, translation) {
			if(!err){
				i--;
				console.log('\n> Translated section '+section+' into '+target+' ('+i+')')
				translation.forEach((t)=>{
					strings[target].some((t2)=>{
						if(t2.en === t.originalText){
							var id = t2.id;
							if(!lang[section][t2.id][target]) lang[section][t2.id][target] = t.translatedText;
						}
					})
				})
				if(p > pace){
					clearInterval(translate_interval);
					p = p-500;
					Translate(jobs,p);
				}
			}else{
				err = JSON.parse(err.body).error.message;
				console.error('> ERROR ('+i+')\n'+err+(err==='User Rate Limit Exceeded'?' (Leave it running, this will eventually resolve)':'')+'\n');
				jobs.push(job)
				if(p > 2000) return;
				clearInterval(translate_interval);
				p = p+500
				Translate(jobs,p);
				return;
			}
			if(!i){
				if(!jobs.length) clearInterval(translate_interval);
				writeLang(lang)
			}
		});
	},p)
}

function writeLang(lang){
	var targets = LC.sort((a,b)=>{
		if(a.language > b.language) return 1;
		if(a.language < b.language) return -1;
		return 0;
	})
	lang.list = targets;
	lang = JSON.stringify(lang,null,'\t');
	var out = path.join(appRoot,'src/resources/language/master_lang.json')
	fs.writeFileSync(out,lang);
	console.log('\n\n> SUCCESS\n language is written to'+out)
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
