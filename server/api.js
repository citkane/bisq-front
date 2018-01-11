"use strict"

const request = require('request');
const tools = require('./tools.js');

var api = function(socket,port){
	this.socket = socket;
	this.endpoint = 'http://localhost:'+port+'/api/v1/';
	var self = this;
	this.socket.on('get',function(data){
		self.get(data).then(function(response){
			self.socket.emit(data.command,response);
		});
	})
	this.socket.on('delete',function(data){
		self.delete(data).then(function(response){
			self.socket.emit(data.command,response);
		});
	})
}

api.prototype.get = function(data){
	var url = this.endpoint+data.command+tools.params(data.params);
	return new Promise(function(resolve,reject){
		request.get({
			url:url,
			json:true,
		},function(err,resp,body){
			resolve(body);
		})
	})
}
api.prototype.delete = function(data){
	var url = this.endpoint+data.command+tools.params(data.params);
	return new Promise(function(resolve,reject){
		request.delete({
			url:url,
			json:true,
		},function(err,resp,body){
			resolve(body);
		})
	})
}
module.exports = api;
