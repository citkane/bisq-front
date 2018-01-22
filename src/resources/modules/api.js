var api = function(socket){
	this.socket = socket;
}
api.prototype.get = function(command,params){
	this.socket.emit('get',{command:command,params:params});
	var self = this;
	return new Promise(function(resolve,reject){
		self.socket.once(command,function(data){
			if(data.error){
				reject(data.error);
				return;
			}
			resolve(data);
		})
	})
}
api.prototype.market = function(command,params){
	this.socket.emit('market',{command:command,params:params});
	var self = this;
	return new Promise(function(resolve,reject){
		self.socket.once(command,function(data){
			if(data.error){
				reject(data.error);
				return;
			}
			resolve(data);
		})
	})
}
api.prototype.delete = function(command,params){
	this.socket.emit('delete',{command:command,params:params});
	var self = this;
	return new Promise(function(resolve,reject){
		self.socket.once(command,function(data){
			resolve(data);
		})
	})
}
api.prototype.generate = function(amount){
	this.socket.emit('generate',amount);
}
api.prototype.ticker = function(){
	this.socket.emit('ticker');
}

export default api;
