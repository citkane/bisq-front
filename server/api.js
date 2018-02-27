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

const request = require('request');
const tools = require('../src/resources/modules/tools.js');
const market = require('./market.js');
const convert = require('./conversion_filters/bisq.js')

const api = function (socket, port){
    this.socket = socket;
    this.endpoint = 'http://localhost:' + port + '/api/';

    this.socket.on('get', (data) => {
        this.submit(data, "get").then(this.success,this.error);
    });
    this.socket.on('delete', (data) => {
        this.submit(data, "delete").then(this.success,this.error);
    });
    this.socket.on('post', (data) => {
        this.submit(data, "post").then(this.success,this.error);
    });
    this.socket.on('put', (data) => {
        this.submit(data, "put").then(this.success,this.error);
    });

    this.socket.on('market', (data) => {
        market.get(data.command, data.params).then(this.success,this.error);
    });

    this.success = (msg)=>{
        this.socket.emit(msg.command,msg.data);
    }

    this.error = (err)=>{
        this.socket.emit(err.command,{error:err.data});
    };
};

api.prototype.submit = function(data,type){
    const url = this.endpoint + data.command + tools.params(data.params);
    if(type === 'post') console.log(url);
    return new Promise(function(resolve,reject){
		request[type]({
			url:url,
			json:true,
		},function(err,resp,body){
			if(err || body.errors){
				reject(err?{command:data.command,data:err.toString()}:{command:data.command,data:body.errors});
				return;
			}
            const d = convert.get(data.command, body);
            !d?reject({command:data.command,data:'Failed to get '+data.command}):resolve({command:data.command,data:d});
		})
	})
};

module.exports = api;
