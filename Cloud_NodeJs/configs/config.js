var os = require('os');
var ifaces = os.networkInterfaces();
var reg = /192/;
var hostip;

if('Wireless Network Connection' in ifaces){
	var con = ifaces['Wireless Network Connection'];
}else if('Local Area Connection' in ifaces ){
	var con = ifaces['Local Area Connection'];
}

con.forEach(function(details){
   if (details.family == 'IPv4') {
    	//if(reg.test(details.address)) {
    		hostip = details.address;
    		return ;
	   // }
   }
});


module.exports = {

    //debug flag
    debug: true,
    //Launch cloud server or webServer
    isWebServerOnly: false,

    name: 'Paratu',

    //cloud host and port
    host:hostip,
    port:"8888",
    //port:"5683",

    //spark core port
    sc_port:"5683",

    //web host
    SITE_ROOT_URL : 'http://localhost:3000',

    //mongoDB
    //mongoHost:"mongodb://172.24.227.39/spark_core",
    mongoHost:"mongodb://127.0.0.1/spark_core",

    //session store
    sessionHost:"mongodb://127.0.0.1/session",
    //sessionHost:"mongodb://172.24.227.39/session",


    // mail SMTP
    mail_opts: {
        use_authentication: true,
        host: 'smtp.163.com',
        port: 465,
        ssl: true,
        auth: {
            user: 'cindy8414@163.com',
            pass: 'yy841024'
        }
    },

    secret:"Paratu",   //used to encrypt for Cookie
    session_secret: 'Paratu_Secret'
}


