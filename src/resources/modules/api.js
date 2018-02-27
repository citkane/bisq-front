const api = function (socket) {
    this.socket = socket;
};

api.prototype.action = function(command){
    return new Promise((resolve,reject)=>{
        this.socket.once(command,function(data){
            if(data.error){
                reject(data.error);
                return;
            }
            resolve(data);
        })
    });
};

api.prototype.get = function(command,params){
	this.socket.emit('get',{command:command,params:params});
	return this.action(command);
};
api.prototype.post = function(command,params){
    console.error(command,params);
    this.socket.emit('post',{command:command,params:params});
    return this.action(command);
};
api.prototype.delete = function(command,params){
	this.socket.emit('delete',{command:command,params:params});
    return this.action(command);
};
api.prototype.market = function(command,params){
    console.error(command,params);
    this.socket.emit('market',{command:command,params:params});
    return this.action(command);
};
api.prototype.generate = function(amount){
	this.socket.emit('generate',amount);
};
api.prototype.ticker = function(){
	this.socket.emit('ticker');
};

export default api;
