function Scrapy(){
	//this.request = require('request').defaults({jar: true, 'proxy':'http://135.245.48.13:8000', encoding: null});
	this.request = require('request');
	this.location = {
			"上海":{
				 "上海":101020100,
		         "闵行":101020200,
		         "宝山":101020300,
		         "嘉定":101020500,
		         "浦东南汇":101020600,
		         "金山":101020700,
		         "青浦":101020800,
		         "松江":101020900,
		         "奉贤":101021000,
		         "崇明":101021100,
		         "徐家汇":101021200,
		         "浦东":101021300
			}
	};
}

Scrapy.prototype.get = function(url, callback){
	this.request({url:url,encoding:null}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(body);
		}else{
			console.log(error);
		}
	})
	
	
	/*var req = this.request(url, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
        .setHeader('accept', 'text/html,application/xhtml+xml');

    req.on('error', function(err) {
        console.log(err);
    });
	var buffers = [];
	var nread =0;
    req.on('response', function(res) {
        res.on('data', function (data) {


        	buffers.push(data);
        	nread += data.length;
        	
        	

        });
        res.on('end',function(){
        	switch(buffers.length){
    		case 0:
    			buffer = new Buffer(0);
    			break;
    		case 1:
    			buffer = buffers[0];
    			break;
    		default:	
    			buffer = new Buffer(nread);
    			for (var i = 0,pos = 0,l=buffers.length;i<l;i++){
    				var chunk = buffers[i];
    				chunk.copy(buffer,pos);
    				pos += chunk.length;
    			}
    			break;
    	}
        	
        	var iconv = require('iconv-lite');
            var result = iconv.decode(buffer,'GBK');
            callback(result);
        });
    });*/
}

module.exports = new Scrapy();
