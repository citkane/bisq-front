var self;
var data = {};
const server = ['lang','langDir','screen','theme','color','showown','primary_market','secondary_market','pair_market',]

var base = function(){
	this.make = (x,d)=>{
		self = x;
		data = d;
	}
}
base.prototype.set = function(key,val,set){
	data[key] = val;
	if(key==='lang'){
		set = true;
		data.langList.some((l)=>{
			if(l.language === val){
				data.langDir = l.dir;
				return true;
			}
			return false;
		})
	}
	if(server.indexOf(key)!==-1){
		var settings = {};
		server.forEach((key)=>{
			settings[key] = data[key];
		})
		data.socket.emit('settings',settings)
	}
	if(set||key === 'theme'||key === 'color'||key === 'lang'){
		var newState = {
			Global:data
		}
		if(key === 'theme'||key === 'color'||key === 'lang'){
			newState.theme = self.makeTheme(data.langDir,data.color,data.theme)
		}
		self.setState(newState);
	}
}
base.prototype.get = function(key){
	return data[key];
}

export default new base();
