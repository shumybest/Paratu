function Core(){
	var net = require("net");
	var config = require("../configs/config");
	var Factory = require("../public/Factory").Factory;
	var tool = require("../public/Tool");
	var rpc = require("../public/Rpc");
	var server = net.createServer();
	
	this.construct = function(){
		server.listen(config.sc_port,config.host);
		//var sockets = {};
		/*var dnode = require('dnode');
		var ser = dnode({
		    transform : function (info,coreid) {
		    	console.log("This is: " + coreid);
		    	console.log("This info: " + info);
		    	try {
		    		sockets[coreid].write(info);
     			} catch (e) {
     				console.log("can't find specified coreid,please hold on....");
     			}
		    }
		});
		ser.listen(5004);*/
		server.on('connection', function(sock) {
			console.log('CORE CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);   
		    sock.name = sock.remoteAddress + ":" + sock.remotePort;

			var randomNum = tool.getRandomNum(40);
			sock.write(randomNum);
			
			var buffer = null;
			sock.on('data', function(data) { 
				var buffer = tool.dataAchieve(data);
				var datas = buffer.toString();
				console.log(buffer.length);
				console.log(datas);
					
				if(/voltage/.test(datas)){
					rpc.invoke("sendElectric",{datas:datas,sock:sock,Factory:Factory});
				}
				//当用户换设备的时候，要触发的事件是 1.要更新device表 的ischange字段表示是否换设备了，同时要回送一个消息给App,告诉它换设备了让去改名字 ，
				//2. 如果用户确定是更换了设备的话，app要回送个信息给cloud，然后cloud去更新ifttts表的active为0，同时去删除它的定时器
				
				if(buffer.length == 18){   
					var pingorack = buffer.slice(2,3);
					console.log("receive method:"+pingorack.toString('hex', 0));
						 
					if(pingorack.toString('hex', 0) == "40"){  //ping
						var messid1 = buffer.slice(4,5);   
						var messid2= buffer.slice(5,6);
						var coreFuntion = require("../public/CoreFunction");
						var info = coreFuntion.ping(messid1,messid2,sock); 
					}else if(pingorack.toString('hex', 0) == "60"){
						console.log("receive ack");
					}
				}else if(buffer.length == 52){
					var coreid= buffer.slice(40).toString('hex', 0);
					 console.log("receive coreid:"+coreid.toString('hex', 0));
					 sock.coreid = coreid; 
					// sockets[coreid] = sock;
					 rpc.invoke("setForCore",{coreid:coreid,sock:sock});
					 var obj = {module:"device",object:{action:"update",coreid:coreid,isConnect:1}};
					 Factory.setController(obj,sock);
				 }	
			});

		    sock.on('end', function() {
		        console.log(sock.name +"'s request has completed .....");
		        
				var obj = {module:"device",object:{action:"update",coreid:sock.coreid,isConnect:0}};
				Factory.setController(obj,sock);
				//delete sockets[sock.coreid];
				rpc.invoke("deleteCore",sock.coreid);
		    });
		    
		    sock.on('error', function(){
		        console.log(sock.name +" error happened .....");
		    });
		});
	};
}

module.exports = new Core();





