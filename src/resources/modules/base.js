var self;
var data = {};
const server = ['lang','screen','theme','showown','market']

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
				data.theme.langDir = l.dir;
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
	if(set||key === 'theme'||key === 'lang'){
		var newState = {
			Global:data
		}
		if(key === 'theme'||key === 'lang'){
			newState.theme = self.makeTheme(data.theme.langDir,data.theme.color,data.theme.theme)
		}
		self.setState(newState);
	}
}
base.prototype.get = function(key){
	if(!key) return data;
	return data[key];
}

export default new base();
