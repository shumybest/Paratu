function MainController(){
    var config = require("../configs/config");
    var Factory = require("../public/Factory").Factory;
    
    var dbConnect = require("../public/DB");
    var DBconnect = new dbConnect();
    DBconnect.construct();
    
    var net = require("net");
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;
    var workers = {};
	
    this.run = function(){
    	if(cluster.isMaster){
    		console.log('[master] ' + "start master...");
    		
    		cluster.on('death', function (worker) {
    			delete workers[worker.pid];
    			worker = cluster.fork();
    			workers[worker.pid] = worker;
    		});
    		
    		cluster.on('listening', function(worker, address) {
    		        console.log('[master] ' + 'listening on : worker' + worker.id + '--pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    		});
    		
    		for (var i = 0; i < numCPUs; i++) {
   	         	var worker = cluster.fork();
   	         	workers[worker.pid] = worker;
    		}
    	}else if(cluster.isWorker){
    		//console.log('[worker] ' + "start worker" + cluster.worker.id + "...");
    		if(cluster.worker.id == 1){
    			console.log("core worker is working...");
        		var core = require("../core/core");
        		core.construct();
    		}else if(cluster.worker.id == 2){
    			//console.log('worker'+cluster.worker.id + " is working...");
    			//andriod app
    			console.log("App worker is working...");
        		var phoneapp = require("../app/phoneApp");
        		phoneapp.construct();
    		/*	var rio = require("rio");
    			var options = {
    				    callback: function (err, res) {
    				        if (err) {
    				           // util.puts(res);
    				        } else {
    				           // util.puts("Rserve call failed. " + err);
    				        	console.log("s");
    				        	console.log(res)
    				        }
    				    },
    				    host : "127.0.0.1",
    				    port : 6311,
    				}
			    rio.enableDebug(true);//开启调试模式
			    rio.evaluate("pi / 2 * 2 * 2",options);//运行R代码*/
    			/*exports.rio = function(req, res){
    				options = {
    					host : "192.168.1.201",
    					port : 6311,
    			        callback: function (err, val) {
    			            if (!err) {
    			            	console.log("RETURN:"+val);
    			            	return res.send({'success':true,'res':val});
    			            } else {
    			            	console.log("ERROR:Rserve call failed")
    			            	return res.send({'success':false});
    			            }
    			        },
    			    }
    			    rio.enableDebug(true);//开启调试模式
    			    rio.evaluate("pi / 2 * 2 * 2",options);//运行R代码
    			};*/
    		}else if(cluster.worker.id == 3){
    			// web app
        		var webapp = require('../spark_core_web/app');
        		webapp.listen(config.web_port, function(){
        				console.log("Web server listening on port " + config.web_port);
        		});
    		}else if(cluster.worker.id == 4){
    			var rpc = require("../public/Rpc");
    			rpc.init();
    			//launch ifttt
    			var obj = {module:"ifttt",object:{action:"launchIfttt"}};
				Factory.setController(obj,null);
    		}			
    	}
    	
    	process.on('SIGTERM', function () {
    		for (var pid in workers) {
    			process.kill(pid);
    		}
    		process.exit(0);
    	});
    } 
}

exports.MainController = new MainController();
