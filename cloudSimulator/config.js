var os = require('os');
var ifaces = os.networkInterfaces();
var reg = /192/;
var hostip;
	
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details){
    if (details.family == 'IPv4') {
    	if(reg.test(details.address)) {
    		hostip = details.address;
	    }
    }
  });
}

module.exports = {
		//cloud host and port
	    host:hostip,
	    port:"8888"
}


