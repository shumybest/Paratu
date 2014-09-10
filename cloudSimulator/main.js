var config = require("./config");
var net = require("net");

var userLogin = /login/;
var userReg = /register/;
var userForgetPassowrd = /forgetPassword/;
var userRetrieve = /findAll/;

var userjingtaal = /jingtaal/;
var userliuchao = /liuchao/;

var deviceNew = /create/;
var deviceUpdate = /update/;

var showelec = /showElec/;

console.log("listening: " + config.host + ":" + config.port);

net.createServer(function(sock) {
	sock.name = sock.remoteAddress + ":" + sock.remotePort;
	
	sock.on("connection", function() {
		console.log("get connect with " + sock.name);
	});
	
	sock.on("data", function(data) {
		console.log("received from " + sock.name + " data: " + data);
		
		//simulate actions

		if(userLogin.test(data.toString()) && userjingtaal.test(data.toString())) {
			sock.write("{\"res\":\"login success\"}\n");
		}
		
		if(userReg.test(data.toString()) && userliuchao.test(data.toString())) {
			sock.write("{\"res\":\"register success\"}\n");
		}
		
		if(userRetrieve.test(data.toString())) {
			sock.write("{\"res\":[{\"devicename\":\"sp1\", \"coreid\":\"0x1f\", \"owner\":\"jingtaal\", \"value\":0, \"isConnect\":1},{\"devicename\":\"sp2\", \"coreid\":\"0x2f\", \"owner\":\"jingtaal\", \"value\":1, isConnect:1}, {\"devicename\":\"sp3\", \"coreid\":\"0x3f\", \"owner\":\"jingtaal\", \"value\":0, \"isConnect\":0}]}\n");
		}
		
		if(deviceNew.test(data.toString())) {
			sock.write("{\"res\":\"create device success\"}\n");
		}
		
		if(deviceUpdate.test(data.toString())) {
			sock.write("{\"res\":\"update device success\"}\n");
		}
		
		if(showelec.test(data.toString())) {
			sock.write("{\"res\":{\"xaxisValue\":[1,2,3,4,5,6,7],\"xaxisType\":\"小时\",\"yaxisValue\":{\"50ff6e065067545631120587\":{\"name\":\"liu light\",\"marker\":{\"symbol\":\"square\"},\"data\":[7,2,1,0,3,5,5]}}}}\n");
		}
	});

	sock.on("end", function() {
		console.log(sock.name + "\"s request has completed .....");
	});

	sock.on("error", function() {
		console.log(sock.name + " error happened .....");
	});
}).listen(config.port, config.host);