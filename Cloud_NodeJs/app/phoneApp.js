function PhoneApp(){
	var net = require("net");
	var config = require("../configs/config");
	var Factory = require("../public/Factory").Factory;
	var tool = require("../public/Tool");
	var server = net.createServer();
	
	this.construct = function(){
		server.listen(config.port,config.host);
		server.on('connection', function(sock) {
		    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
		    sock.name = sock.remoteAddress + ":" + sock.remotePort;

			var buffer = null;
			sock.on('data', function(data) {  
				console.log(data);
				console.log('received from ' + sock.name + ' data: ' + data);
				var datas = tool.dataAchieve(data).toString();

 				var extractObj = datas.replace(/(^\s*)|(\s*$)/g, "");
     			try {
     				var obj = eval("(" + extractObj + ")");
     				Factory.setController(obj,sock);
     			} catch (e) {
     				console.log(e);
     			}
			});

            sock.on('end', function() {
                console.log(sock.name +"'s request has completed .....");
            });
            
            sock.on('error', function(){
                console.log(sock.name +" error happened .....");
            });

		});
	};
}

module.exports = new PhoneApp();





