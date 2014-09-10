function Rpc() {}

Rpc.prototype.init = function() {
	var dnode = require('dnode');
	var ifttts = {};
	var sockets = {};
	var ser = dnode({
		setForIfttt : function(resource) {
			ifttts[resource.id] = resource.timer;
		},
		cancelIfttt : function(iftttid){
			if(ifttts[iftttid].hasOwnProperty('clear')){
				ifttts[iftttid].clear();
		 	}else{
		 		clearInterval(ifttts[iftttid]);
		 	}
		 	delete ifttts[iftttid];
		},
		setForCore : function(resource) {
			sockets[resource.coreid] = resource.timer;
		},
		transformInfo : function (resource) {
	    	console.log("This is: " + resource.coreid);
	    	console.log("This info: " + resource.info);
	    	try {
	    		sockets[resource.coreid].write(resource.info);
				} catch (e) {
					console.log("can't find specified coreid,please hold on....");
				}
	    },
	    sendElectric : function (resource) {
	    	for(var core in  sockets){
				if(sockets[core] == resource.sock){
					var re = /.*is\sat\s(\d.\d*).*/.exec(resource.datas);
					console.log(parseFloat(re[1]));
					var obj = {module:"electric",object:{action:"sendElectric",coreid:core,value:parseFloat(re[1])}};
					resource.Factory.setController(obj,resource.sock);
					return;
				}
			}
	    },
	    deleteCore : function (coreid) {
	    	delete sockets[coreid];
	    },
	    get : function(){
    		var util = require('util');
    		var info = util.inspect(ifttts);
	    	console.log(info);
	    }
	});
	ser.listen(5004);
};

Rpc.prototype.invoke = function(method,param) {
	var dnode = require('dnode');
	var d = dnode.connect(5004);
	d.on('remote', function (remote) {
	    eval("remote."+method+"(param)")
	});
};

module.exports = new Rpc();
