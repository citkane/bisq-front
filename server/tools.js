"use strict";

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
